(() => {
  'use strict';
  const $app = document.getElementById('app');
  const L = window.LERN;
  const KEY = 'lernapp.v1';
  const QUIZ_LEN = 8;
  const DAILY_GOAL = 10;

  /* ---------- Helfer ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const shuffle = (arr, r = Math.random) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pad = n => String(n).padStart(2, '0');
  const dayStr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = () => dayStr(new Date());
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); };
  const subj = id => L.subjects.find(s => s.id === id) || { id, name: id, icon: '📘', color: '#4f46e5' };
  const topicByKey = k => L.topics.find(t => t.key === k);
  let qMap = null;
  const qById = id => { if (!qMap) { qMap = {}; L.topics.forEach(t => t.qs.forEach(q => qMap[q.id] = q)); } return qMap[id]; };
  const topicsFor = (s, g) => L.topics.filter(t => t.subject === s && t.grade === g);
  const gensFor = (s, g) => (L.gens || []).filter(x => x.subject === s && x.grade === g);
  const genById = id => (L.gens || []).find(x => x.id === id);
  const nQ = (s, g) => topicsFor(s, g).reduce((a, t) => a + t.qs.length, 0);

  /* ---------- Speicher ---------- */
  const defaults = () => ({ name: '', grade: 0, xp: 0, streak: 0, bestStreak: 0, lastDay: '', quizzes: 0, correct: 0, answered: 0, perfect: 0, duels: 0, wins: 0, tests: [], genCorrect: 0, best: {}, wrong: {}, badges: {}, friends: {}, played: {}, stats: {}, custom: [], daily: { day: '', n: 0 } });
  const load = () => { try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { return defaults(); } };
  let S = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* privater Modus */ } };

  /* ---------- Eigene Themen einbinden ---------- */
  L.base = L.topics.slice();
  function rebuildCustom() {
    L.topics = L.base.slice();
    S.custom.forEach(c => L.topics.push({
      key: 'custom-' + c.id, subject: c.subject, grade: c.grade, id: c.id, name: c.name, custom: true,
      qs: c.rows.map((r, i) => ({ id: 'custom-' + c.id + '-' + i, subject: c.subject, topicKey: 'custom-' + c.id, q: r[0], a: r[1], w: [r[2], r[3], r[4]], e: r[5] || 'Eigene Frage.', ex: r[6] || '–' }))
    }));
    if (S.custom.length && !L.subjects.some(s => s.id === 'eigene')) L.subjects.push({ id: 'eigene', name: 'Eigene Themen', icon: '✏️', color: '#868e96' });
    qMap = null;
  }
  rebuildCustom();

  /* ---------- Level & Abzeichen ---------- */
  const TITLES = ['Neuling', 'Entdecker', 'Lernfuchs', 'Wissenssucher', 'Streber', 'Profi', 'Meister', 'Genie', 'Legende'];
  const levelOf = xp => 1 + Math.floor(Math.sqrt(xp / 40));
  const levelStart = l => 40 * (l - 1) * (l - 1);
  const titleOf = l => TITLES[Math.min(l - 1, TITLES.length - 1)];
  const BADGES = [
    { id: 'first', icon: '🚀', name: 'Erster Schritt', desc: 'Schließe dein erstes Quiz ab.', ok: s => s.quizzes >= 1 },
    { id: 'perfect', icon: '🎯', name: 'Volltreffer', desc: 'Beantworte ein ganzes Quiz fehlerfrei.', ok: s => s.perfect >= 1 },
    { id: 'ten', icon: '💪', name: 'Fleißig', desc: 'Schließe 10 Quizze ab.', ok: s => s.quizzes >= 10 },
    { id: 'c100', icon: '💯', name: 'Hundert richtig', desc: 'Beantworte 100 Fragen richtig.', ok: s => s.correct >= 100 },
    { id: 's3', icon: '🔥', name: 'Dranbleiber', desc: '3 Tage in Folge gelernt.', ok: s => s.bestStreak >= 3 },
    { id: 's7', icon: '🏅', name: 'Wochenheld', desc: '7 Tage in Folge gelernt.', ok: s => s.bestStreak >= 7 },
    { id: 'all', icon: '🧭', name: 'Allrounder', desc: 'Spiele in 3 verschiedenen Fächern.', ok: s => Object.keys(s.played).length >= 3 },
    { id: 'duel', icon: '⚔️', name: 'Duellant', desc: 'Nimm eine Challenge von einem Freund an.', ok: s => s.duels >= 1 },
    { id: 'win', icon: '🏆', name: 'Champion', desc: 'Gewinne 3 Challenges.', ok: s => s.wins >= 3 },
    { id: 'lvl5', icon: '⭐', name: 'Level 5', desc: 'Erreiche Level 5.', ok: s => levelOf(s.xp) >= 5 },
    { id: 'test', icon: '📝', name: 'Prüfungsprofi', desc: 'Schließe einen Probetest ab.', ok: s => s.tests.length >= 1 },
    { id: 'note1', icon: '🥇', name: 'Einserkandidat', desc: 'Erreiche im Probetest mindestens Note 2.', ok: s => s.tests.some(t => t.note <= 2) },
    { id: 'rechner', icon: '🧮', name: 'Kopfrechner', desc: 'Löse 25 Rechenaufgaben richtig.', ok: s => s.genCorrect >= 25 }
  ];
  const NOTEN = ['', 'sehr gut', 'gut', 'befriedigend', 'ausreichend', 'mangelhaft', 'ungenügend'];
  const noteOf = pct => pct >= 92 ? 1 : pct >= 81 ? 2 : pct >= 67 ? 3 : pct >= 50 ? 4 : pct >= 30 ? 5 : 6;

  /* ---------- Navigation ---------- */
  const view = { screen: 'home', subject: null, challenge: null, sheet: null, edit: null, testcfg: null };
  let sess = null;
  const go = (screen, extra) => { Object.assign(view, { screen }, extra); render(); window.scrollTo(0, 0); };
  const TAB = { home: 'home', subject: 'home', sheet: 'home', editor: 'home', editform: 'home', testsetup: 'tests', rewards: 'rewards', report: 'report', friends: 'friends', challenge: 'friends', result: 'home' };

  /* ---------- Items & Sitzungen ---------- */
  const mcItem = (q, r, review) => ({ kind: 'mc', q, review, opts: shuffle([{ t: q.a, ok: true }, ...q.w.map(t => ({ t, ok: false }))], r) });
  const numItem = g => ({ kind: 'num', g, t: g.make(Math.random) });
  const keyOf = it => it.kind === 'mc' ? it.q.topicKey : 'gen:' + it.g.id;
  const nameOfKey = k => k.startsWith('gen:') ? '🧮 ' + ((genById(k.slice(4)) || {}).name || k) : ((topicByKey(k) || {}).name || k);
  const subjOfKey = k => k.startsWith('gen:') ? (genById(k.slice(4)) || {}).subject : (topicByKey(k) || {}).subject;

  function startQuiz(t, o = {}) {
    const seeded = o.seed != null;
    const r = seeded ? rng(o.seed) : Math.random;
    let items = shuffle(t.qs, r).slice(0, o.count || QUIZ_LEN).map(q => mcItem(q, r, false));
    if (!seeded) {
      const extra = shuffle(Object.keys(S.wrong).map(qById).filter(q => q && q.subject === t.subject && q.topicKey !== t.key)).slice(0, 2);
      items = shuffle(items.concat(extra.map(q => mcItem(q, r, true))));
    }
    sess = { mode: 'quiz', topic: t, title: t.name, items, i: 0, correct: 0, picked: null, seed: seeded ? o.seed : null, ch: o.challenge || null, log: [] };
    go('quiz');
  }
  function startReview() {
    const qs = shuffle(Object.keys(S.wrong).map(qById).filter(Boolean)).slice(0, QUIZ_LEN);
    if (!qs.length) return;
    sess = { mode: 'quiz', topic: null, title: 'Wiederholung', items: qs.map(q => mcItem(q, Math.random, true)), i: 0, correct: 0, picked: null, seed: null, ch: null, log: [] };
    go('quiz');
  }
  function startTrain(g) {
    sess = { mode: 'train', topic: null, gen: g, title: 'Rechentraining: ' + g.name, items: Array.from({ length: 6 }, () => numItem(g)), i: 0, correct: 0, picked: null, seed: null, ch: null, log: [] };
    go('quiz');
  }
  function startTest(cfg) {
    const cats = shuffle(cfg.cats);
    const pools = {};
    cats.forEach(k => { pools[k] = k.startsWith('gen:') ? null : shuffle(topicByKey(k).qs); });
    const items = []; let guard = 0;
    while (items.length < cfg.n && guard++ < 2000) {
      let progressed = false;
      for (const k of cats) {
        if (items.length >= cfg.n) break;
        if (k.startsWith('gen:')) { items.push(numItem(genById(k.slice(4)))); progressed = true; }
        else if (pools[k].length) { items.push(mcItem(pools[k].pop(), Math.random, false)); progressed = true; }
      }
      if (!progressed) break;
    }
    if (!items.length) { toast('Keine Aufgaben in den gewählten Kategorien.'); return; }
    sess = { mode: 'test', topic: null, title: 'Probetest ' + subj(cfg.subject).name + ' · Klasse ' + cfg.grade, cfg, items: shuffle(items), i: 0, correct: 0, picked: null, seed: null, ch: null, log: [], t0: Date.now() };
    go('quiz');
  }

  /* ---------- Antworten ---------- */
  function bump(it, ok) {
    const k = keyOf(it), s = S.stats[k] || (S.stats[k] = { a: 0, c: 0 });
    s.a++; if (ok) s.c++;
    S.answered++; if (ok) { S.correct++; if (it.kind === 'num') S.genCorrect++; }
    if (it.kind === 'mc') { if (ok) delete S.wrong[it.q.id]; else S.wrong[it.q.id] = (S.wrong[it.q.id] || 0) + 1; }
  }
  function record(it, ok, given) {
    sess.log.push({ it, ok, given });
    if (ok) sess.correct++;
    bump(it, ok);
    save();
  }
  function answer(i) {
    if (!sess || sess.picked != null) return;
    const it = sess.items[sess.i];
    if (it.kind !== 'mc') return;
    sess.picked = i;
    record(it, it.opts[i].ok, it.opts[i].t);
    render(); focusNext();
  }
  function parseNum(s) {
    s = String(s).trim().replace(/\s/g, '').replace(/[−–]/g, '-');
    const m = s.match(/^([-+]?\d+(?:[.,]\d+)?)(?:\/(\d+(?:[.,]\d+)?))?/);
    if (!m) return NaN;
    const a = parseFloat(m[1].replace(',', '.'));
    if (m[2]) { const b = parseFloat(m[2].replace(',', '.')); return b ? a / b : NaN; }
    return a;
  }
  function answerNum(text) {
    if (!sess || sess.picked != null) return;
    const it = sess.items[sess.i];
    if (it.kind !== 'num') return;
    const v = parseNum(text);
    if (isNaN(v)) { toast('Bitte eine Zahl eingeben (z. B. 12,5 oder 3/4).'); return; }
    const t = it.t, tol = t.tol != null ? t.tol : (Number.isInteger(t.ans) ? 0.0005 : Math.max(0.011, Math.abs(t.ans) * 0.0002));
    sess.picked = text;
    record(it, Math.abs(v - t.ans) <= tol, text);
    render(); focusNext();
  }
  const focusNext = () => { const nx = $app.querySelector('[data-act=next]'); if (nx) nx.focus({ preventScroll: true }); };
  function next() {
    if (!sess || sess.picked == null) return;
    sess.picked = null;
    if (++sess.i >= sess.items.length) finish(); else { render(); const inp = $app.querySelector('input[name=a]'); if (inp) inp.focus({ preventScroll: true }); }
  }

  function finish() {
    const n = sess.items.length, c = sess.correct, perfect = c === n;
    const lvBefore = levelOf(S.xp);
    let xp = c * (sess.mode === 'test' ? 5 : 10) + (perfect && sess.mode !== 'test' ? 25 : 0);
    const t = today();
    if (S.lastDay !== t) { S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1; S.lastDay = t; S.bestStreak = Math.max(S.bestStreak, S.streak); }
    if (S.daily.day !== t) S.daily = { day: t, n: 0 };
    S.daily.n += c;
    S.quizzes++; if (perfect && sess.mode !== 'test') S.perfect++;
    if (sess.topic) {
      S.played[sess.topic.subject] = 1;
      const pct = Math.round(c / n * 100);
      if (pct > (S.best[sess.topic.key] || 0)) S.best[sess.topic.key] = pct;
    } else if (sess.gen) S.played[sess.gen.subject] = 1;
    else if (sess.cfg) S.played[sess.cfg.subject] = 1;
    let duel = null;
    if (sess.ch) {
      const o = sess.ch, res = c > o.p ? 'win' : c < o.p ? 'loss' : 'draw';
      S.duels++; if (res === 'win') { S.wins++; xp += 20; }
      const f = S.friends[o.n] || { w: 0, d: 0, l: 0 };
      f[res === 'win' ? 'w' : res === 'draw' ? 'd' : 'l']++;
      f.last = { me: c, them: o.p, of: n, topic: sess.title };
      S.friends[o.n] = f;
      duel = { res, them: o.p, name: o.n };
    }
    let test = null;
    if (sess.mode === 'test') {
      const pct = Math.round(c / n * 100), note = noteOf(pct), by = {};
      sess.log.forEach(x => { const k = keyOf(x.it), b = by[k] || (by[k] = { k, n: 0, c: 0 }); b.n++; if (x.ok) b.c++; });
      const cats = Object.values(by).map(b => Object.assign(b, { pct: Math.round(b.c / b.n * 100) })).sort((a, b) => a.pct - b.pct);
      test = { pct, note, cats, secs: Math.round((Date.now() - sess.t0) / 1000) };
      S.tests.push({ d: t, subject: sess.cfg.subject, grade: sess.cfg.grade, pct, note, n });
    }
    S.xp += xp;
    const fresh = BADGES.filter(b => !S.badges[b.id] && b.ok(S));
    fresh.forEach(b => S.badges[b.id] = t);
    save();
    sess.result = { xp, perfect, duel, fresh, test, levelUp: levelOf(S.xp) > lvBefore };
    go('result');
  }

  /* ---------- Challenge-Links ---------- */
  const baseUrl = () => location.href.split('#')[0];
  const enc = o => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  function dec(code) {
    try {
      const o = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
      const t = L.topics.find(x => !x.custom && x.subject === o.s && x.grade === o.g && x.id === o.t);
      if (!t || !Number.isInteger(o.d) || !Number.isInteger(o.p) || !Number.isInteger(o.m) || o.p < 0 || o.m < 1 || o.p > o.m || o.m > t.qs.length) return null;
      return { topic: t, seed: o.d, p: o.p, m: o.m, n: String(o.n || 'Freund').slice(0, 20) };
    } catch { return null; }
  }
  const parseCode = txt => { const m = String(txt).match(/#c=([^\s&]+)/); return dec(m ? m[1] : txt); };

  function toast(msg) {
    const el = document.createElement('div'); el.className = 'toast no-print'; el.textContent = msg; el.setAttribute('role', 'status');
    document.body.appendChild(el); setTimeout(() => el.remove(), 2800);
  }

  async function shareChallenge() {
    if (!sess || !sess.topic || sess.seed == null) return;
    if (!S.name) {
      const n = (prompt('Wie sollen deine Freunde dich nennen?') || '').trim().slice(0, 20);
      if (!n) return; S.name = n; save();
    }
    const t = sess.topic;
    const url = baseUrl() + '#c=' + enc({ s: t.subject, g: t.grade, t: t.id, d: sess.seed, n: S.name, p: sess.correct, m: sess.items.length });
    const text = `${S.name} fordert dich heraus: ${t.name} (Klasse ${t.grade}) – ${sess.correct}/${sess.items.length} Punkte. Schaffst du mehr?`;
    try { if (navigator.share) { await navigator.share({ title: 'Lern-Challenge', text, url }); return; } }
    catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text + '\n' + url); toast('Link kopiert – jetzt an deine Freunde schicken!'); }
    catch { prompt('Kopiere diesen Link und schicke ihn an deine Freunde:', url); }
  }

  /* ---------- Merkbilder ---------- */
  function merkbild(t) {
    const d = L.diagrams && L.diagrams[t.key];
    if (d) return `<figure class="merk">${d()}<figcaption>Merkbild: ${esc(t.name)}</figcaption></figure>`;
    const s = subj(t.subject);
    const terms = [...new Set(t.qs.map(q => q.a).filter(a => a.length <= 22))].slice(0, 6);
    if (!terms.length) return '';
    const cols = ['#ffe3e3', '#d3f9d8', '#d0ebff', '#fff3bf', '#e5dbff', '#ffe8cc'];
    const pos = [[100, 40], [300, 40], [70, 110], [330, 110], [130, 175], [270, 175]];
    const nodes = terms.map((x, i) => `<g><line x1="200" y1="110" x2="${pos[i][0]}" y2="${pos[i][1]}" class="dl"/><rect x="${pos[i][0] - 62}" y="${pos[i][1] - 15}" width="124" height="30" rx="15" fill="${cols[i]}" stroke="${s.color}"/><text x="${pos[i][0]}" y="${pos[i][1] + 4}" text-anchor="middle" font-size="11" fill="#1d2033">${esc(x.length > 20 ? x.slice(0, 19) + '…' : x)}</text></g>`).join('');
    return `<figure class="merk"><svg viewBox="0 0 400 220" class="dia" role="img" aria-label="Schlüsselbegriffe zu ${esc(t.name)}">${nodes}<circle cx="200" cy="110" r="38" fill="${s.color}"/><text x="200" y="104" text-anchor="middle" font-size="24">${s.icon}</text><text x="200" y="124" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">${esc(t.name.length > 18 ? t.name.slice(0, 17) + '…' : t.name)}</text></svg><figcaption>Schlüsselbegriffe: ${esc(t.name)}</figcaption></figure>`;
  }

  /* ---------- Ansichten ---------- */
  function header() {
    const lv = levelOf(S.xp), a = levelStart(lv), b = levelStart(lv + 1);
    const pct = Math.round((S.xp - a) / (b - a) * 100);
    return `<header class="top no-print">
      <div class="brand"><span class="logo">🎓</span><div><h1>LernQuest</h1><p>${S.name ? 'Hallo ' + esc(S.name) + '!' : 'Gymnasium NRW · Klasse 5–10'}${S.grade ? ' · Klasse ' + S.grade : ''}</p></div></div>
      <div class="chips"><span class="chip" title="Tage in Folge">🔥 ${S.lastDay === today() || S.lastDay === yesterday() ? S.streak : 0}</span><span class="chip" title="Erfahrungspunkte">⭐ ${S.xp}</span></div>
      <div class="lvl"><span>Level ${lv} · ${titleOf(lv)}</span><div class="bar"><i style="width:${pct}%"></i></div></div>
    </header>`;
  }
  const gradeChips = (act = 'setgrade') => `<div class="chips-row no-print" role="tablist" aria-label="Klassenstufe">${L.grades.map(g => `<button role="tab" aria-selected="${g === S.grade}" class="gchip ${g === S.grade ? 'on' : ''}" data-act="${act}" data-g="${g}">Klasse ${g}</button>`).join('')}</div>`;

  function viewHome() {
    const g = S.grade;
    if (!g) return `${header()}<h2>In welcher Klasse bist du?</h2><div class="gradegrid">${L.grades.map(x => `<button class="gbig" data-act="setgrade" data-g="${x}"><b>${x}</b><small>Klasse</small></button>`).join('')}</div><p class="hint">Danach siehst du nur die Fächer und Themen deiner Klasse. Du kannst die Klasse jederzeit wechseln.</p>`;
    const t = today(), dn = S.daily.day === t ? S.daily.n : 0, dp = Math.min(100, Math.round(dn / DAILY_GOAL * 100));
    const wrongN = Object.keys(S.wrong).filter(qById).length;
    const subs = L.subjects.filter(s => topicsFor(s.id, g).length || gensFor(s.id, g).length);
    return `${header()}${gradeChips()}
      <section class="card goal"><div class="row"><b>Tagesziel</b><span>${Math.min(dn, DAILY_GOAL)} / ${DAILY_GOAL} richtige Antworten ${dn >= DAILY_GOAL ? '✅' : ''}</span></div><div class="bar big"><i style="width:${dp}%"></i></div></section>
      ${wrongN ? `<button class="card review" data-act="review"><span class="ic">🔁</span><span><b>Wiederholen</b><small>${wrongN} Frage${wrongN > 1 ? 'n' : ''}, die du noch festigen kannst</small></span></button>` : ''}
      <h2>Deine Fächer in Klasse ${g}</h2>
      <div class="grid">${subs.map(s => {
        const n = nQ(s.id, g), gn = gensFor(s.id, g).length;
        return `<button class="subj" style="--c:${s.color}" data-act="subject" data-id="${s.id}"><span class="ic">${s.icon}</span><b>${esc(s.name)}</b><small>${n} Fragen${gn ? ' + Rechentraining' : ''}</small></button>`;
      }).join('') || '<div class="card empty">Für diese Klasse gibt es noch keine Inhalte.</div>'}</div>
      <div class="btns no-print" style="margin-top:16px"><button class="btn ghost" data-act="editor">✏️ Eigene Themen erstellen</button></div>`;
  }

  function viewSubject() {
    const s = subj(view.subject), g = S.grade;
    const ts = topicsFor(s.id, g), gs = gensFor(s.id, g);
    return `<div class="bar-top no-print"><button class="back" data-act="home" aria-label="Zurück">←</button><h2 style="--c:${s.color}">${s.icon} ${esc(s.name)} · Klasse ${g}</h2></div>
      ${gradeChips('setgrade')}
      <div class="btns no-print" style="margin:8px 0"><button class="btn alt" data-act="testsetup" data-id="${s.id}">📝 Probetest</button><button class="btn ghost" data-act="sheet" data-subject="${s.id}">🖨️ Lernzettel (alle Themen)</button></div>
      ${gs.length ? `<h2>🧮 Rechentraining <small>zufällige Aufgaben mit Rechenweg</small></h2>${gs.map(x => `<article class="card topic" style="--c:${s.color}"><div><h3>${esc(x.name)}</h3><small>unendlich viele Aufgaben · ${S.stats['gen:' + x.id] ? S.stats['gen:' + x.id].c + ' von ' + S.stats['gen:' + x.id].a + ' richtig' : 'noch nicht geübt'}</small></div><div class="btns"><button class="btn" data-act="train" data-id="${x.id}">Üben</button></div></article>`).join('')}` : ''}
      <h2>Themen</h2>
      ${ts.length ? ts.map(t => {
        const best = S.best[t.key];
        return `<article class="card topic" style="--c:${s.color}"><div><h3>${esc(t.name)}</h3><small>${t.qs.length} Fragen · ${best != null ? 'Bestleistung ' + best + ' %' + (best === 100 ? ' 🌟' : '') : 'noch nicht gespielt'}</small>${best != null ? `<div class="bar"><i style="width:${best}%"></i></div>` : ''}</div>
          <div class="btns"><button class="btn" data-act="start" data-key="${t.key}">Quiz starten</button><button class="btn ghost" data-act="sheet" data-key="${t.key}">📄 Lernzettel</button>${t.custom ? '' : `<button class="btn ghost" data-act="duel" data-key="${t.key}" title="Freund herausfordern">⚔️</button>`}</div></article>`;
      }).join('') : '<div class="card empty">Hier gibt es für diese Klasse noch keine Themen. 🚧</div>'}`;
  }

  function viewQuiz() {
    const it = sess.items[sess.i], p = sess.picked, answered = p != null, total = sess.items.length, test = sess.mode === 'test';
    const bar = `<div class="bar-top no-print"><button class="back" data-act="quit" aria-label="Abbrechen">✕</button>
        <div class="prog"><div class="bar big"><i style="width:${Math.round((sess.i + (answered ? 1 : 0)) / total * 100)}%"></i></div><small>Aufgabe ${sess.i + 1} von ${total} · ${esc(sess.title)}${sess.ch ? ' · ⚔️ gegen ' + esc(sess.ch.n) : ''}</small></div></div>`;
    const nextBtn = `<button class="btn" data-act="next">${sess.i + 1 >= total ? (test ? 'Test abgeben' : 'Ergebnis ansehen') : 'Weiter'} →</button>`;
    if (it.kind === 'mc') {
      const ok = answered && it.opts[p].ok, right = it.opts.find(o => o.ok).t;
      return `${bar}<section class="card q">${it.review ? '<span class="tag">🔁 Wiederholung</span>' : ''}<h2 class="qtext">${esc(it.q.q)}</h2>
        <div class="opts" role="group" aria-label="Antworten">${it.opts.map((o, i) => {
          let cls = ''; if (answered) cls = test ? (i === p ? 'picked' : 'dim') : (o.ok ? 'right' : i === p ? 'wrong' : 'dim');
          return `<button class="opt ${cls}" data-act="answer" data-i="${i}" ${answered ? 'disabled' : ''}><kbd>${i + 1}</kbd><span>${esc(o.t)}</span>${answered && !test && o.ok ? '<em>✓</em>' : answered && !test && i === p ? '<em>✗</em>' : ''}</button>`;
        }).join('')}</div>
        ${answered ? (test ? `<div class="fb neutral" aria-live="polite"><b>Antwort gespeichert</b><p>Die Auswertung bekommst du am Ende.</p>${nextBtn}</div>` : `<div class="fb ${ok ? 'good' : 'bad'}" aria-live="polite"><b>${ok ? '🎉 Richtig! +10 XP' : '💡 Leider falsch'}</b>${ok ? '' : `<p>Richtig ist: <strong>${esc(right)}</strong></p>`}<p>${esc(it.q.e)}</p><p class="ex"><span>Zum Beispiel</span> ${esc(it.q.ex)}</p>${nextBtn}</div>`) : ''}</section>`;
    }
    const t = it.t, last = sess.log[sess.log.length - 1];
    return `${bar}<section class="card q"><span class="tag">🧮 ${esc(it.g.name)}</span><h2 class="qtext">${esc(t.q)}</h2>${t.fig ? `<div class="fig">${t.fig}</div>` : ''}
      <form class="numform" data-form="num"><input name="a" inputmode="decimal" autocomplete="off" autocapitalize="off" placeholder="Deine Antwort" aria-label="Antwort" ${answered ? 'disabled value="' + esc(p) + '"' : ''}><span class="unit">${esc(t.unit || '')}</span>${answered ? '' : '<button class="btn">Prüfen</button>'}</form>
      ${answered ? (test ? `<div class="fb neutral"><b>Antwort gespeichert</b>${nextBtn}</div>` : `<div class="fb ${last.ok ? 'good' : 'bad'}" aria-live="polite"><b>${last.ok ? '🎉 Richtig! +10 XP' : '💡 Nicht ganz'}</b><p>Richtig ist: <strong>${esc(showAns(t))} ${esc(t.unit || '')}</strong></p><p>So rechnest du:</p><ol class="steps">${t.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>${nextBtn}</div>`) : ''}</section>`;
  }
  const fmt = x => String(Math.round(x * 10000) / 10000).replace('.', ',');
  const showAns = t => Number.isInteger(t.ans) ? fmt(t.ans) : (t.tol >= 0.05 ? (Math.round(t.ans * 10) / 10).toFixed(1) : (Math.round(t.ans * 100) / 100).toFixed(2)).replace('.', ',');

  function reviewBlock(x) {
    const it = x.it;
    if (it.kind === 'mc') return `<article class="card rev"><b>${esc(it.q.q)}</b><p>Deine Antwort: <span class="bad-t">${esc(x.given)}</span></p><p>Richtig: <strong>${esc(it.opts.find(o => o.ok).t)}</strong></p><p>${esc(it.q.e)}</p><p class="ex"><span>Zum Beispiel</span> ${esc(it.q.ex)}</p></article>`;
    return `<article class="card rev"><b>${esc(it.t.q)}</b>${it.t.fig ? `<div class="fig">${it.t.fig}</div>` : ''}<p>Deine Antwort: <span class="bad-t">${esc(x.given)}</span></p><p>Richtig: <strong>${esc(showAns(it.t))} ${esc(it.t.unit || '')}</strong></p><ol class="steps">${it.t.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></article>`;
  }

  function viewResult() {
    const n = sess.items.length, c = sess.correct, r = sess.result, pct = Math.round(c / n * 100), lv = levelOf(S.xp);
    const wrong = sess.log.filter(x => !x.ok);
    const pops = `${r.levelUp ? `<div class="pop">🎊 Level-Up! Du bist jetzt Level ${lv} – ${titleOf(lv)}</div>` : ''}
      ${r.duel ? `<div class="pop ${r.duel.res}">${r.duel.res === 'win' ? '🏆 Du hast gewonnen' : r.duel.res === 'draw' ? '🤝 Unentschieden' : '😅 Knapp verloren'} gegen ${esc(r.duel.name)}: ${c} zu ${r.duel.them}${r.duel.res === 'win' ? ' (+20 XP)' : ''}</div>` : ''}
      ${r.fresh.map(b => `<div class="pop badge">${b.icon} Neues Abzeichen: <b>${esc(b.name)}</b></div>`).join('')}`;
    if (r.test) {
      const T = r.test, m = Math.floor(T.secs / 60);
      const plan = T.cats.filter(x => x.pct < 80);
      return `<section class="card result"><div class="note n${T.note}"><small>Deine Note</small><b>${T.note}</b><span>${NOTEN[T.note]}</span></div>
        <h2>${c} von ${n} Aufgaben richtig (${T.pct} %)</h2><p class="xp">+${r.xp} XP · Zeit: ${m} min ${T.secs % 60} s</p>${pops}
        <p class="hint">Notenschlüssel (Richtwert): ab 92 % = 1, 81 % = 2, 67 % = 3, 50 % = 4, 30 % = 5. Deine Schule kann abweichen.</p></section>
        <h2>Ergebnis nach Bereichen</h2><div class="card list">${T.cats.map(x => `<div class="fr"><div><b>${esc(nameOfKey(x.k))}</b><div class="bar"><i style="width:${x.pct}%"></i></div></div><span class="rec"><i class="${x.pct >= 80 ? 'w' : x.pct >= 50 ? 'd' : 'l'}">${x.c}/${x.n}</i></span></div>`).join('')}</div>
        <h2>📋 Dein Übungsplan</h2>${plan.length ? `<div class="card"><ol class="plan">${plan.map(x => {
          const isGen = x.k.startsWith('gen:'), g = isGen ? genById(x.k.slice(4)) : null;
          return `<li><b>${esc(nameOfKey(x.k))}</b> (${x.pct} %) – ${x.pct < 50 ? 'Lies zuerst den Lernzettel und mache dann das Quiz zweimal.' : 'Mach das Quiz nochmal und achte auf die Erklärungen.'}<div class="btns no-print">${isGen ? `<button class="btn" data-act="train" data-id="${g.id}">Üben</button>` : `<button class="btn ghost" data-act="sheet" data-key="${x.k}">📄 Lernzettel</button><button class="btn" data-act="start" data-key="${x.k}">Quiz</button>`}</div></li>`;
        }).join('')}</ol></div>` : '<div class="card empty">Stark – in allen Bereichen über 80 %! Weiter so. 🌟</div>'}
        ${wrong.length ? `<h2>Das war falsch – so geht es richtig</h2>${wrong.map(reviewBlock).join('')}` : ''}
        <div class="btns col no-print"><button class="btn" data-act="tab" data-id="tests">Neuer Probetest</button><button class="btn ghost" data-act="home">Zur Übersicht</button></div>`;
    }
    const msg = pct === 100 ? 'Perfekt! Fehlerfrei! 🌟' : pct >= 70 ? 'Stark gemacht! 💪' : pct >= 40 ? 'Gut dran – bleib dabei! 🙂' : 'Übung macht den Meister – probier es nochmal! 🌱';
    return `<section class="card result"><div class="ring" style="--p:${pct}"><b>${c}/${n}</b><small>${pct} %</small></div><h2>${msg}</h2>
        <p class="xp">+${r.xp} XP ${r.perfect ? '· Perfekt-Bonus +25' : ''}</p>${pops}
        <div class="btns col">
          ${sess.topic ? '<button class="btn" data-act="again">Nochmal spielen</button>' : ''}
          ${sess.gen ? `<button class="btn" data-act="train" data-id="${sess.gen.id}">Noch eine Runde</button>` : ''}
          ${sess.topic && sess.seed != null ? `<button class="btn alt" data-act="share">⚔️ ${sess.ch ? 'Ergebnis zurückschicken' : 'Freund herausfordern'}</button>` : ''}
          ${sess.topic && sess.seed == null && !sess.topic.custom ? `<button class="btn alt" data-act="duel" data-key="${sess.topic.key}">⚔️ Mit diesem Thema herausfordern</button>` : ''}
          <button class="btn ghost" data-act="home">Zur Übersicht</button></div></section>
      ${wrong.length ? `<h2>Das schauen wir uns nochmal an</h2>${wrong.map(reviewBlock).join('')}` : ''}`;
  }

  /* --- Probetest-Einrichtung --- */
  function viewTestSetup() {
    const g = S.grade;
    if (!g) return `${header()}<div class="card empty">Wähle zuerst auf der Startseite deine Klasse.<div class="btns" style="justify-content:center;margin-top:10px"><button class="btn" data-act="home">Zur Klassenwahl</button></div></div>`;
    const subs = L.subjects.filter(s => topicsFor(s.id, g).length || gensFor(s.id, g).length);
    const cfg = view.testcfg && view.testcfg.grade === g ? view.testcfg : (view.testcfg = { subject: (subs[0] || {}).id, grade: g, cats: null, n: 15 });
    if (!subs.some(s => s.id === cfg.subject)) cfg.subject = (subs[0] || {}).id;
    const ts = topicsFor(cfg.subject, g), gs = gensFor(cfg.subject, g);
    if (!cfg.cats) cfg.cats = ts.map(t => t.key).concat(gs.map(x => 'gen:' + x.id));
    return `${header()}<h2>📝 Probetest zusammenstellen</h2>${gradeChips('setgrade')}
      <section class="card"><h3>Fach</h3><div class="chips-row">${subs.map(s => `<button class="gchip ${s.id === cfg.subject ? 'on' : ''}" data-act="tsubject" data-id="${s.id}">${s.icon} ${esc(s.name)}</button>`).join('')}</div></section>
      <section class="card"><h3>Kategorien</h3><div class="checks">${ts.map(t => `<label><input type="checkbox" data-cat="${t.key}" ${cfg.cats.includes(t.key) ? 'checked' : ''}> ${esc(t.name)} <small>(${t.qs.length})</small></label>`).join('')}${gs.map(x => `<label><input type="checkbox" data-cat="gen:${x.id}" ${cfg.cats.includes('gen:' + x.id) ? 'checked' : ''}> 🧮 ${esc(x.name)} <small>(Rechenaufgaben)</small></label>`).join('')}</div></section>
      <section class="card"><h3>Anzahl der Aufgaben</h3><div class="chips-row">${[10, 15, 20, 30].map(n => `<button class="gchip ${cfg.n === n ? 'on' : ''}" data-act="tn" data-n="${n}">${n}</button>`).join('')}</div>
      <p class="hint">Im Test siehst du die Lösungen erst am Ende – wie in der Klassenarbeit. Danach bekommst du Note, Erklärungen und einen Übungsplan.</p>
      <div class="btns" style="margin-top:10px"><button class="btn" data-act="starttest">Test starten</button></div></section>`;
  }

  /* --- Lernzettel --- */
  function viewSheet() {
    const sh = view.sheet;
    const ts = sh.key ? [topicByKey(sh.key)].filter(Boolean) : topicsFor(sh.subject, S.grade);
    const s = subj(ts.length ? ts[0].subject : sh.subject);
    return `<div class="bar-top no-print"><button class="back" data-act="back-subject" aria-label="Zurück">←</button><h2>📄 Lernzettel</h2><button class="btn" data-act="print">🖨️ Drucken</button></div>
      <article class="sheet"><h1 class="sheet-title">${s.icon} ${esc(s.name)} · Klasse ${ts.length ? ts[0].grade : S.grade}</h1>
      ${ts.map(t => `<section class="sheet-topic"><h2>${esc(t.name)}</h2>${merkbild(t)}
        ${t.pairs ? `<table class="vocab"><tbody>${t.pairs.map(p => `<tr><td>${esc(p[0])}</td><td>${esc(p[1])}</td></tr>`).join('')}</tbody></table>` :
          t.qs.map(q => `<div class="fact"><b>${esc(q.q)}</b><p>➜ <strong>${esc(q.a)}</strong></p><p>${esc(q.e)}</p><p class="ex"><span>Beispiel</span> ${esc(q.ex)}</p></div>`).join('')}</section>`).join('')}
      <p class="sheet-foot">Erstellt mit LernQuest · ${new Date().toLocaleDateString('de-DE')}</p></article>`;
  }

  /* --- Report --- */
  function viewReport() {
    const st = Object.entries(S.stats).filter(([k]) => k.startsWith('gen:') || topicByKey(k));
    const bySub = {};
    st.forEach(([k, v]) => { const s = subjOfKey(k); if (!s) return; const b = bySub[s] || (bySub[s] = { a: 0, c: 0 }); b.a += v.a; b.c += v.c; });
    const weak = st.filter(([, v]) => v.a >= 3).map(([k, v]) => ({ k, a: v.a, c: v.c, pct: Math.round(v.c / v.a * 100) })).sort((x, y) => x.pct - y.pct).slice(0, 8);
    const acc = S.answered ? Math.round(S.correct / S.answered * 100) : 0;
    const wrongN = Object.keys(S.wrong).filter(qById).length;
    return `${header()}<h2>📊 Dein Lernreport</h2>
      <div class="stats"><div><b>${S.answered}</b><small>Antworten</small></div><div><b>${acc} %</b><small>Trefferquote</small></div><div><b>${S.quizzes}</b><small>Runden</small></div><div><b>${wrongN}</b><small>zu festigen</small></div></div>
      <h2>Nach Fächern</h2>${Object.keys(bySub).length ? `<div class="card list">${Object.entries(bySub).sort((x, y) => x[1].c / x[1].a - y[1].c / y[1].a).map(([s, v]) => { const p = Math.round(v.c / v.a * 100); return `<div class="fr"><span class="ic">${subj(s).icon}</span><div><b>${esc(subj(s).name)}</b><small>${v.c} von ${v.a} richtig</small><div class="bar"><i style="width:${p}%"></i></div></div><span class="rec"><i class="${p >= 80 ? 'w' : p >= 50 ? 'd' : 'l'}">${p} %</i></span></div>`; }).join('')}</div>` : '<div class="card empty">Noch keine Daten. Spiele ein paar Quizze! 📚</div>'}
      <h2>Hier tust du dich schwer</h2>${weak.length ? `<div class="card list">${weak.map(w => `<div class="fr"><div><b>${esc(nameOfKey(w.k))}</b><small>${esc(subj(subjOfKey(w.k)).name)} · ${w.c} von ${w.a} richtig</small><div class="bar"><i style="width:${w.pct}%"></i></div></div><span class="rec"><i class="${w.pct >= 80 ? 'w' : w.pct >= 50 ? 'd' : 'l'}">${w.pct} %</i></span>
        <span class="btns no-print">${w.k.startsWith('gen:') ? `<button class="btn ghost" data-act="train" data-id="${w.k.slice(4)}">Üben</button>` : `<button class="btn ghost" data-act="sheet" data-key="${w.k}" title="Lernzettel">📄</button><button class="btn" data-act="start" data-key="${w.k}">Quiz</button>`}</span></div>`).join('')}</div>` : '<div class="card empty">Sobald du ein Thema mindestens 3-mal beantwortet hast, siehst du hier deine Schwächen.</div>'}
      ${wrongN ? '<div class="btns" style="margin-top:12px"><button class="btn alt" data-act="review">🔁 Fehlerfragen wiederholen</button></div>' : ''}
      <h2>Probetests</h2>${S.tests.length ? `<div class="card list">${S.tests.slice(-8).reverse().map(t => `<div class="fr"><span class="rk">${t.note}</span><div><b>${esc(subj(t.subject).name)} · Klasse ${t.grade}</b><small>${esc(t.d)} · ${t.n} Aufgaben · ${t.pct} %</small></div><span class="rec"><i class="${t.note <= 2 ? 'w' : t.note <= 4 ? 'd' : 'l'}">${NOTEN[t.note]}</i></span></div>`).join('')}</div>` : '<div class="card empty">Noch kein Probetest absolviert.</div>'}
      <h2>Inhalte deiner Klasse</h2>${S.grade ? `<div class="card list">${L.subjects.filter(s => nQ(s.id, S.grade) || gensFor(s.id, S.grade).length).map(s => `<div class="fr"><span class="ic">${s.icon}</span><div><b>${esc(s.name)}</b></div><span class="rec"><i class="d">${nQ(s.id, S.grade)} Fragen${gensFor(s.id, S.grade).length ? ' + ∞' : ''}</i></span></div>`).join('')}</div>` : ''}`;
  }

  function viewRewards() {
    const lv = levelOf(S.xp), a = levelStart(lv), b = levelStart(lv + 1), pct = Math.round((S.xp - a) / (b - a) * 100);
    const acc = S.answered ? Math.round(S.correct / S.answered * 100) : 0;
    return `${header()}
      <section class="card"><h3>Level ${lv} – ${titleOf(lv)}</h3><div class="bar big"><i style="width:${pct}%"></i></div><small>${b - S.xp} XP bis Level ${lv + 1}</small></section>
      <div class="stats">
        <div><b>${S.streak && (S.lastDay === today() || S.lastDay === yesterday()) ? S.streak : 0}</b><small>Tage-Serie</small></div>
        <div><b>${S.bestStreak}</b><small>Rekord-Serie</small></div>
        <div><b>${S.quizzes}</b><small>Runden</small></div>
        <div><b>${acc} %</b><small>Trefferquote</small></div>
      </div>
      <h2>Abzeichen <small>${Object.keys(S.badges).length}/${BADGES.length}</small></h2>
      <div class="badges">${BADGES.map(bd => { const got = !!S.badges[bd.id]; return `<div class="bd ${got ? 'got' : ''}"><span class="ic">${got ? bd.icon : '🔒'}</span><b>${esc(bd.name)}</b><small>${esc(bd.desc)}</small></div>`; }).join('')}</div>`;
  }

  function viewFriends() {
    const fr = Object.entries(S.friends).sort((x, y) => (y[1].w - y[1].l) - (x[1].w - x[1].l));
    const me = { w: fr.reduce((s, [, f]) => s + f.w, 0), d: fr.reduce((s, [, f]) => s + f.d, 0), l: fr.reduce((s, [, f]) => s + f.l, 0) };
    return `${header()}
      <section class="card"><h3>Dein Name</h3><form class="inline" data-form="name"><input name="n" maxlength="20" value="${esc(S.name)}" placeholder="z. B. Mia" autocomplete="nickname" aria-label="Dein Name"><button class="btn">Speichern</button></form></section>
      <section class="card"><h3>So funktioniert die Challenge</h3><ol class="how"><li>Wähle bei einem Thema <b>⚔️</b> und spiele das Quiz.</li><li>Schicke deinen <b>Link</b> an einen Freund (WhatsApp, Mail …).</li><li>Dein Freund spielt <b>dieselben Fragen</b> und sieht dein Ergebnis. Wer mehr Punkte hat, gewinnt.</li></ol></section>
      <section class="card"><h3>Challenge erhalten?</h3><form class="inline" data-form="paste"><input name="c" placeholder="Link hier einfügen" aria-label="Challenge-Link"><button class="btn">Öffnen</button></form></section>
      <h2>Duell-Bilanz <small>${me.w} S · ${me.d} U · ${me.l} N</small></h2>
      ${fr.length ? `<div class="card list">${fr.map(([n, f], i) => `<div class="fr"><span class="rk">${i + 1}</span><div><b>${esc(n)}</b><small>${f.last ? esc(f.last.topic) + ': ' + f.last.me + ' zu ' + f.last.them : ''}</small></div><span class="rec"><i class="w">${f.w}</i><i class="d">${f.d}</i><i class="l">${f.l}</i></span></div>`).join('')}</div>` : '<div class="card empty">Noch keine Duelle. Fordere jemanden heraus! ⚔️</div>'}`;
  }

  function viewChallenge() {
    const c = view.challenge;
    return `<section class="card result"><div class="big-ic">⚔️</div><h2>${esc(c.n)} fordert dich heraus!</h2>
      <p>${subj(c.topic.subject).icon} <b>${esc(c.topic.name)}</b> · Klasse ${c.topic.grade}</p>
      <p>${esc(c.n)} hat <b>${c.p} von ${c.m}</b> Fragen richtig. Schaffst du mehr?</p>
      <div class="btns col"><button class="btn" data-act="accept">Challenge annehmen</button><button class="btn ghost" data-act="home">Nicht jetzt</button></div></section>`;
  }

  /* --- Editor --- */
  function viewEditor() {
    return `<div class="bar-top no-print"><button class="back" data-act="home" aria-label="Zurück">←</button><h2>✏️ Eigene Themen</h2></div>
      <p class="hint">Eigene Themen werden nur in diesem Browser gespeichert (nicht auf GitHub). Sichere sie über „Exportieren“.</p>
      <div class="btns"><button class="btn" data-act="newtopic">+ Neues Thema</button></div>
      ${S.custom.length ? S.custom.map(c => `<article class="card topic"><div><h3>${esc(c.name)}</h3><small>${esc(subj(c.subject).name)} · Klasse ${c.grade} · ${c.rows.length} Fragen</small></div><div class="btns"><button class="btn" data-act="start" data-key="custom-${c.id}">Quiz</button><button class="btn ghost" data-act="edittopic" data-id="${c.id}">Bearbeiten</button><button class="btn ghost" data-act="deltopic" data-id="${c.id}">🗑️</button></div></article>`).join('') : '<div class="card empty">Noch keine eigenen Themen.</div>'}
      <section class="card"><h3>Sichern & Teilen</h3><div class="btns"><button class="btn ghost" data-act="exportfile">⬇️ Exportieren (Datei)</button><label class="btn ghost filebtn">⬆️ Importieren<input type="file" accept="application/json,.json" data-file="import" hidden></label></div></section>`;
  }
  const emptyRow = () => ['', '', '', '', '', '', ''];
  function viewEditForm() {
    const e = view.edit;
    const subs = L.subjects.filter(s => s.id !== 'eigene').concat([{ id: 'eigene', name: 'Eigene Themen / Sonstiges', icon: '✏️' }]);
    return `<div class="bar-top no-print"><button class="back" data-act="editor" aria-label="Zurück">←</button><h2>${e.id ? 'Thema bearbeiten' : 'Neues Thema'}</h2></div>
      <form data-form="topic" class="editor">
        <section class="card"><label>Titel<input name="name" maxlength="60" required value="${esc(e.name)}" placeholder="z. B. Satz des Thales"></label>
        <div class="two"><label>Fach<select name="subject">${subs.map(s => `<option value="${s.id}" ${s.id === e.subject ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></label>
        <label>Klasse<select name="grade">${L.grades.map(g => `<option ${g === e.grade ? 'selected' : ''}>${g}</option>`).join('')}</select></label></div></section>
        ${e.rows.map((r, i) => `<section class="card"><div class="row"><b>Frage ${i + 1}</b><button type="button" class="btn ghost" data-act="delrow" data-i="${i}">Entfernen</button></div>
          <label>Frage<input name="r${i}_0" value="${esc(r[0])}"></label><label>✅ Richtige Antwort<input name="r${i}_1" value="${esc(r[1])}"></label>
          <label>❌ Falsch 1<input name="r${i}_2" value="${esc(r[2])}"></label><label>❌ Falsch 2<input name="r${i}_3" value="${esc(r[3])}"></label><label>❌ Falsch 3<input name="r${i}_4" value="${esc(r[4])}"></label>
          <label>Erklärung<input name="r${i}_5" value="${esc(r[5])}"></label><label>Praxisbeispiel<input name="r${i}_6" value="${esc(r[6])}"></label></section>`).join('')}
        <div class="btns"><button type="button" class="btn ghost" data-act="addrow">+ Frage hinzufügen</button></div>
        <section class="card"><h3>Schnell-Import</h3><p class="hint">Eine Frage pro Zeile, getrennt durch <code>|</code>:<br><code>Frage | richtig | falsch1 | falsch2 | falsch3 | Erklärung | Beispiel</code></p><textarea name="bulk" rows="4" placeholder="Hauptstadt von Italien? | Rom | Mailand | Neapel | Turin | Rom liegt am Tiber. | Das Kolosseum steht in Rom."></textarea><div class="btns" style="margin-top:8px"><button type="button" class="btn ghost" data-act="bulk">Zeilen übernehmen</button></div></section>
        <div class="btns"><button class="btn">💾 Speichern</button></div></form>`;
  }
  function collectEditor() {
    const f = $app.querySelector('form[data-form=topic]'); if (!f) return;
    const e = view.edit;
    e.name = f.name.value.trim(); e.subject = f.subject.value; e.grade = +f.grade.value;
    e.rows = e.rows.map((_, i) => [0, 1, 2, 3, 4, 5, 6].map(j => f['r' + i + '_' + j].value.trim()));
  }

  /* ---------- Render ---------- */
  function render() {
    const sc = view.screen;
    const body = { home: viewHome, subject: viewSubject, quiz: viewQuiz, result: viewResult, rewards: viewRewards, report: viewReport, friends: viewFriends, challenge: viewChallenge, testsetup: viewTestSetup, sheet: viewSheet, editor: viewEditor, editform: viewEditForm }[sc]();
    const tab = TAB[sc];
    const tabs = sc === 'quiz' ? '' : `<nav class="tabs no-print" aria-label="Hauptnavigation">${[['home', '📚', 'Lernen'], ['tests', '📝', 'Probetest'], ['report', '📊', 'Report'], ['rewards', '🏆', 'Erfolge'], ['friends', '👥', 'Freunde']].map(([id, ic, lb]) => `<button class="${tab === id ? 'on' : ''}" data-act="tab" data-id="${id}" ${tab === id ? 'aria-current="page"' : ''}><span>${ic}</span>${lb}</button>`).join('')}</nav>`;
    $app.innerHTML = `<main class="wrap">${body}</main>${tabs}`;
    if (sc === 'quiz' && sess.picked == null) { const inp = $app.querySelector('input[name=a]'); if (inp) inp.focus({ preventScroll: true }); }
  }

  /* ---------- Events ---------- */
  function saveTopic(e) {
    if (!e.name) { toast('Bitte einen Titel eingeben.'); return false; }
    const rows = e.rows.filter(r => r.some(Boolean));
    if (!rows.length) { toast('Mindestens eine Frage ausfüllen.'); return false; }
    const bad = rows.findIndex(r => r.slice(0, 5).some(x => !x));
    if (bad >= 0) { toast('Frage ' + (bad + 1) + ': Frage, richtige und 3 falsche Antworten ausfüllen.'); return false; }
    for (const r of rows) if (new Set(r.slice(1, 5)).size < 4) { toast('Antwortmöglichkeiten dürfen nicht doppelt sein.'); return false; }
    const rec = { id: e.id || Date.now().toString(36), subject: e.subject, grade: e.grade, name: e.name, rows };
    const i = S.custom.findIndex(c => c.id === rec.id);
    if (i >= 0) S.custom[i] = rec; else S.custom.push(rec);
    save(); rebuildCustom(); return true;
  }
  $app.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const d = el.dataset;
    switch (d.act) {
      case 'tab': go(d.id === 'tests' ? 'testsetup' : d.id); break;
      case 'home': sess = null; go('home'); break;
      case 'setgrade': S.grade = +d.g; save(); if (view.testcfg) view.testcfg.cats = null; render(); break;
      case 'subject': go('subject', { subject: d.id }); break;
      case 'start': startQuiz(topicByKey(d.key)); break;
      case 'duel': { const t = topicByKey(d.key); startQuiz(t, { seed: Math.floor(Math.random() * 2 ** 31), count: Math.min(QUIZ_LEN, t.qs.length) }); break; }
      case 'review': startReview(); break;
      case 'train': startTrain(genById(d.id)); break;
      case 'answer': answer(+d.i); break;
      case 'next': next(); break;
      case 'quit': if (confirm('Wirklich abbrechen? Dein Fortschritt in dieser Runde geht verloren.')) { sess = null; go('home'); } break;
      case 'again': startQuiz(sess.topic); break;
      case 'share': shareChallenge(); break;
      case 'accept': { const c = view.challenge; startQuiz(c.topic, { seed: c.seed, count: c.m, challenge: c }); break; }
      case 'testsetup': view.testcfg = null; go('testsetup'); view.testcfg.subject = d.id; view.testcfg.cats = null; render(); break;
      case 'tsubject': view.testcfg.subject = d.id; view.testcfg.cats = null; render(); break;
      case 'tn': view.testcfg.n = +d.n; render(); break;
      case 'starttest': { const c = view.testcfg; if (!c.cats.length) { toast('Wähle mindestens eine Kategorie.'); break; } startTest(c); break; }
      case 'sheet': go('sheet', { sheet: { key: d.key || null, subject: d.subject || null }, back: view.screen }); break;
      case 'back-subject': { const sh = view.sheet; const t = sh.key && topicByKey(sh.key); go(t ? 'subject' : 'subject', { subject: t ? t.subject : sh.subject }); break; }
      case 'print': window.print(); break;
      case 'editor': go('editor'); break;
      case 'newtopic': go('editform', { edit: { id: null, subject: 'mathe', grade: S.grade || 5, name: '', rows: [emptyRow()] } }); break;
      case 'edittopic': { const c = S.custom.find(x => x.id === d.id); go('editform', { edit: { id: c.id, subject: c.subject, grade: c.grade, name: c.name, rows: c.rows.map(r => r.slice()) } }); break; }
      case 'deltopic': if (confirm('Dieses Thema wirklich löschen?')) { S.custom = S.custom.filter(x => x.id !== d.id); save(); rebuildCustom(); render(); } break;
      case 'addrow': collectEditor(); view.edit.rows.push(emptyRow()); render(); break;
      case 'delrow': collectEditor(); view.edit.rows.splice(+d.i, 1); if (!view.edit.rows.length) view.edit.rows.push(emptyRow()); render(); break;
      case 'bulk': {
        collectEditor(); const f = $app.querySelector('form[data-form=topic]');
        const lines = f.bulk.value.split('\n').map(l => l.split('|').map(x => x.trim())).filter(p => p.length >= 5 && p[0]);
        if (!lines.length) { toast('Keine gültigen Zeilen gefunden.'); break; }
        view.edit.rows = view.edit.rows.filter(r => r.some(Boolean)).concat(lines.map(p => [0, 1, 2, 3, 4, 5, 6].map(j => p[j] || '')));
        render(); toast(lines.length + ' Fragen übernommen.'); break;
      }
      case 'exportfile': {
        const blob = new Blob([JSON.stringify({ lernquest: 1, topics: S.custom }, null, 1)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'lernquest-eigene-themen.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); break;
      }
    }
  });
  $app.addEventListener('submit', e => {
    const f = e.target.closest('[data-form]'); if (!f) return;
    e.preventDefault();
    const k = f.dataset.form;
    if (k === 'name') { S.name = f.n.value.trim().slice(0, 20); save(); toast('Name gespeichert'); render(); }
    if (k === 'paste') { const c = parseCode(f.c.value); if (c) go('challenge', { challenge: c }); else toast('Dieser Link ist ungültig.'); }
    if (k === 'num') answerNum(f.a.value);
    if (k === 'topic') { collectEditor(); if (saveTopic(view.edit)) { toast('Gespeichert ✓'); go('editor'); } }
  });
  $app.addEventListener('change', e => {
    const c = e.target.closest('[data-cat]');
    if (c && view.testcfg) { const set = new Set(view.testcfg.cats); c.checked ? set.add(c.dataset.cat) : set.delete(c.dataset.cat); view.testcfg.cats = [...set]; }
    if (e.target.matches('[data-file=import]')) {
      const file = e.target.files[0]; if (!file) return;
      file.text().then(txt => {
        try {
          const o = JSON.parse(txt); const list = Array.isArray(o) ? o : o.topics;
          let n = 0;
          list.forEach(t => {
            if (!t || !t.name || !Array.isArray(t.rows)) return;
            const rows = t.rows.filter(r => Array.isArray(r) && r.length >= 5 && r.slice(0, 5).every(x => typeof x === 'string' && x)).map(r => [0, 1, 2, 3, 4, 5, 6].map(j => String(r[j] || '').slice(0, 400)));
            if (!rows.length) return;
            S.custom.push({ id: Date.now().toString(36) + (n++), subject: String(t.subject || 'eigene'), grade: L.grades.includes(+t.grade) ? +t.grade : 5, name: String(t.name).slice(0, 60), rows });
          });
          save(); rebuildCustom(); render(); toast(n + ' Thema/Themen importiert.');
        } catch { toast('Datei konnte nicht gelesen werden.'); }
      });
    }
  });
  document.addEventListener('keydown', e => {
    if (view.screen !== 'quiz' || !sess || e.target.matches('input,textarea,select') || e.metaKey || e.ctrlKey || e.altKey) return;
    const it = sess.items[sess.i];
    if (it.kind === 'mc' && sess.picked == null && /^[1-4]$/.test(e.key) && it.opts[+e.key - 1]) answer(+e.key - 1);
    else if (sess.picked != null && e.key === 'Enter' && !e.target.closest('button')) next();
  });

  function fromHash() {
    const m = location.hash.match(/^#c=(.+)$/); if (!m) return;
    const c = dec(m[1]);
    history.replaceState(null, '', baseUrl());
    if (c) { if (!S.grade) S.grade = c.topic.grade; go('challenge', { challenge: c }); } else toast('Dieser Challenge-Link ist ungültig.');
  }
  window.addEventListener('hashchange', fromHash);

  render();
  fromHash();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
