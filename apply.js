/* Anwendungsaufgaben: Prüfen frei eingetippter Antworten, Zuordnungs- und Reihenfolge-Aufgaben.
   Reine Funktionen ohne Oberfläche – die Darstellung übernimmt app.js. */
LERN.app = (() => {
  const shuffle = (arr, r = Math.random) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fold = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  // Vereinheitlicht Anführungszeichen, Striche, Leerzeichen und Satzzeichen am Ende
  const clean = (s, mode) => {
    s = String(s).trim().replace(/[’`´‘]/g, "'").replace(/[„“”"«»]/g, '').replace(/[−–—]/g, '-').replace(/,\s+/g, ' ').replace(/\s+/g, ' ').replace(/\s*[.!?;:]+$/, '');
    return mode === 'exact' ? s : s.toLowerCase();
  };
  const ART = /^(?:der|die|das|den|dem|ein|eine|einen|the|an|a|to|le|la|les|un|une|des|du)\s+|^l'/i;
  const noArt = s => s.replace(ART, '');
  const key = s => s.replace(/[\s.]/g, '');       // „776 v. Chr.“ = „776 v.Chr.“, „1.000“ = „1000“
  const lev = (a, b) => {
    if (Math.abs(a.length - b.length) > 2) return 9;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  };

  /* Alle Schreibweisen, die als richtig gelten (Alternativen mit |, ohne Klammerzusatz, Zahl ohne Einheit …) */
  function variants(ty) {
    const out = [];
    const add = x => { x = String(x).trim(); if (x && !out.includes(x)) out.push(x); };
    String(ty.ans).split('|').forEach(a => {
      add(a);
      const np = a.replace(/\s*\([^)]*\)/g, '').trim();
      add(np);
      if (ty.par) { const m = a.match(/\(([^)]+)\)/); if (m) add(m[1]); }
      if (/^[\p{L}-]{3,}\/[\p{L}-]{3,}$/u.test(np)) np.split('/').forEach(add);        // „Australien/Ozeanien“
      const vc = np.match(/^(\d+) v\. Chr\.$/); if (vc) add(vc[1] + ' vor Christus');
      const mu = np.match(/^([\d.,]+)\s+[\p{L}°%²³\/]+$/u); if (mu) add(mu[1]);          // „300 cm“ → auch „300“
    });
    (ty.alt || []).forEach(add);
    return out;
  }
  const shown = ty => variants(ty)[0];
  /* Dieselbe Frage kommt manchmal mit zwei richtigen Antworten vor („Weg“ = via oder iter, „Staatenbund in Europa“ = EU oder Europäische Union).
     Beim Eintippen gelten dann beide. */
  function linkAlts(topics) {
    const m = {};
    topics.forEach(t => t.qs.forEach(q => { if (q.ty && !q.ty.prompt) { (m[q.q] = m[q.q] || []).push(q); } }));
    Object.values(m).forEach(qs => {
      const all = [...new Set(qs.map(q => q.ty.ans))];
      if (all.length > 1) qs.forEach(q => { q.ty.alt = all.filter(a => a !== q.ty.ans); });
    });
  }
  // Reine Zahlenangabe: Dezimalzahl, Bruch oder Prozent
  const num = s => {
    const m = s.replace(/\s/g, '').match(/^(-?\d+(?:,\d+)?)(?:\/(\d+))?(%?)$/);
    if (!m) return null;
    const v = parseFloat(m[1].replace(',', '.')) / (m[2] ? +m[2] : 1);
    return isFinite(v) ? { v, pct: !!m[3], frac: !!m[2] } : null;
  };

  /* Prüft eine getippte Antwort. Ergebnis: { ok, note?, empty? } */
  function check(q, text) {
    const ty = q.ty, mode = ty.mode || 'lenient', inp = clean(text, mode);
    if (!inp) return { ok: false, empty: true };
    const cands = variants(ty), show = cands[0];
    // Bei Lückentexten gehört der Artikel zur Antwort („dem Nachbarn“ ≠ „den Nachbarn“) und wird nicht ignoriert.
    const na = ty.noart ? (x => x) : noArt;
    const inF = [...new Set([inp, na(inp), inp.replace(/(\d)\.(\d)/g, '$1,$2')])].map(key);
    const forms = c => { const x = clean(c, mode); return [key(x), key(na(x))]; };
    for (const c of cands) if (forms(c).some(f => inF.includes(f))) return { ok: true };
    // Gleichwertige Zahlen: „0,50“ für „0,5“ oder „2/4“ für „1/2“ (Bruch bleibt Bruch, Prozent bleibt Prozent)
    const b = num(inp.replace(/(\d)\.(\d)/g, '$1,$2'));
    if (b) for (const c of cands) { const a = num(clean(c, mode)); if (a && a.pct === b.pct && a.frac === b.frac && Math.abs(a.v - b.v) < 1e-9) return { ok: true }; }
    // Französisch: fehlende Akzente gelten als richtig, werden aber angemerkt
    if (q.subject === 'franzoesisch') for (const c of cands) if (forms(c).some(f => inF.map(fold).includes(fold(f)))) return { ok: true, note: 'Richtig – achte aber auf die Akzente: ' + show };
    if (mode === 'lenient' || mode === 'name') {
      for (const c of cands) for (const f0 of forms(c)) {
        const f = f0.replace(/ß/g, 'ss');
        if (/\d/.test(f)) continue;                                   // Zahlen müssen genau stimmen
        const thr = f.length >= 10 ? 2 : f.length >= 5 ? 1 : 0;
        if (thr && inF.some(x => lev(x.replace(/ß/g, 'ss'), f) <= thr)) return { ok: true, note: inF.includes(f) ? '' : 'Fast – richtig geschrieben wird: ' + show };
        if (!thr && inF.some(x => x.replace(/ß/g, 'ss') === f)) return { ok: true };
      }
    }
    if (mode === 'name') {                                            // Nachname genügt: „Goethe“ für „Johann Wolfgang von Goethe“
      for (const c of cands) {
        const parts = clean(c, mode).split(' '), last = parts[parts.length - 1];
        if (parts.some(p => /^(der|die|das)$/.test(p))) continue;     // „Karl der Große“: „Große“ allein genügt nicht
        if (parts.length > 1 && last.length >= 4 && inF.some(x => x === last || lev(x, last) <= 1)) return { ok: true };
      }
    }
    return { ok: false };
  }

  /* Zuordnungsaufgabe aus den Paaren eines Themas: links 4 Begriffe, rechts die gemischten Partner */
  function buildMatch(t, r) {
    if (!t.pairs) return null;
    const out = [], a = new Set(), b = new Set();
    for (const p of shuffle(t.pairs.filter(p => p[0].length <= 70 && p[1].length <= 70), r)) {
      if (a.has(p[0]) || b.has(p[1])) continue;
      a.add(p[0]); b.add(p[1]); out.push(p);
      if (out.length === 4) break;
    }
    if (out.length < 4) return null;
    return { left: out.map(p => p[0]), right: shuffle(out.map((p, i) => ({ t: p[1], i })), r) };   // right[k].i = Index des passenden linken Eintrags
  }

  /* Zahlenwert einer Angabe: „776 v. Chr.“ → −776, „1600–1720“ → 1600, „37,5 %“ → 37.5 */
  function val(s) {
    const m = String(s).replace(/\s/g, '').match(/\d+(?:\.\d{3})*(?:,\d+)?/);
    if (!m) return NaN;
    const v = parseFloat(m[0].replace(/\./g, '').replace(',', '.'));
    return /v\.?\s*Chr/i.test(s) ? -v : v;
  }
  /* Reihenfolge-Aufgabe: 4 Einträge nach Zeit oder Größe ordnen */
  function buildOrder(t, r) {
    if (!t.order || !t.pairs) return null;
    const out = [], seen = new Set();
    for (const p of shuffle(t.pairs, r)) {
      const v = val(p[1]);
      if (isNaN(v) || seen.has(v) || p[0].length > 70) continue;
      seen.add(v); out.push({ t: p[0], v, label: p[1] });
      if (out.length === 4) break;
    }
    if (out.length < 4) return null;
    const sorted = out.slice().sort((x, y) => x.v - y.v);
    // nicht zufällig schon richtig sortiert vorgeben
    let items = shuffle(out, r);
    if (items.every((x, i) => x === sorted[i])) items = [items[1], items[0], items[3], items[2]];
    return { items, sol: sorted.map(x => items.indexOf(x)), kind: t.order };
  }

  return { check, variants, shown, linkAlts, buildMatch, buildOrder, val, shuffle };
})();
