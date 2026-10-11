(() => {
  'use strict';
  const $app = document.getElementById('app');
  const L = window.LERN;
  const A = L.app, LP = L.lp;
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
  const natCmp = (a, b) => a.localeCompare(b, 'de', { numeric: true });

  /* ---------- Speicher ---------- */
  const defaults = () => ({ name: '', grade: 0, xp: 0, streak: 0, bestStreak: 0, lastDay: '', quizzes: 0, correct: 0, answered: 0, perfect: 0, duels: 0, wins: 0, tests: [], genCorrect: 0, applyDone: 0, best: {}, bestA: {}, wrong: {}, badges: {}, friends: {}, played: {}, stats: {}, custom: [], quest: {}, daily: { day: '', n: 0 }, theme: '', inv: { joker: 1, heal: 1 }, books: {}, chap: {}, gradeOv: {} });
  const load = () => { try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { return defaults(); } };
  let S = load();
  if (!L.grades.includes(S.grade)) S.grade = 0;
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* privater Modus */ } };

  /* ---------- Hell / Dunkel ---------- */
  const sysDark = () => !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  const isDark = () => S.theme ? S.theme === 'dark' : sysDark();
  function applyTheme() {
    const root = document.documentElement;
    if (S.theme === 'dark' || S.theme === 'light') root.dataset.theme = S.theme; else delete root.dataset.theme;
    const m = document.querySelector('meta[name=theme-color]');
    if (m) m.content = isDark() ? '#1c1e30' : '#4f46e5';
  }
  applyTheme();

  /* ---------- Eigene Themen einbinden, eigene Klassen-Zuordnung anwenden ---------- */
  L.base = L.topics.slice();
  L.base.forEach(t => { if (t.grade0 == null) t.grade0 = t.grade; });
  A.linkAlts(L.base);
  // Eigene Vokabelliste: aus den Paaren entstehen Auswahl-, Tipp- und Zuordnungsaufgaben
  function addVocab(c) {
    const key = 'custom-' + c.id;
    const t = L.pairs(c.subject, c.grade, c.id, c.name, { q: 'Übersetze: „{0}“', qr: 'Was bedeutet „{1}“?', e: '{0} = {1}', ty: 1, tm: 'strict' }, c.pairs);
    Object.assign(t, { key, custom: true, vocab: true });
    t.qs.forEach((q, i) => { q.id = key + '-' + i; q.topicKey = key; });
  }
  // Liest „deutsch = Fremdsprache“ (auch mit ; Tabulator oder Gedankenstrich), eine Vokabel pro Zeile; Doppelte fallen weg
  function parseVocab(text) {
    const out = [], l = new Set(), r = new Set();
    String(text).split('\n').forEach(line => {
      const m = line.match(/^(.+?)\s*(?:=|;|\t|\s[-–—]\s)\s*(.+)$/);
      if (!m) return;
      const a = m[1].trim().slice(0, 60), b = m[2].trim().slice(0, 60);
      if (!a || !b || l.has(a.toLowerCase()) || r.has(b.toLowerCase()) || out.length >= 200) return;
      l.add(a.toLowerCase()); r.add(b.toLowerCase()); out.push([a, b]);
    });
    return out;
  }
  function rebuildCustom() {
    // Themen, die die eigene Schule in einem anderen Jahr behandelt, stehen in S.gradeOv
    L.base.forEach(t => { const o = own(S.gradeOv, t.key) ? +S.gradeOv[t.key] : 0; t.grade = L.grades.includes(o) ? o : t.grade0; });
    L.topics = L.base.slice();
    S.custom.forEach(c => c.kind === 'vocab' ? addVocab(c) : L.topics.push({
      key: 'custom-' + c.id, subject: c.subject, grade: c.grade, id: c.id, name: c.name, custom: true,
      qs: c.rows.map((r, i) => ({ id: 'custom-' + c.id + '-' + i, subject: c.subject, topicKey: 'custom-' + c.id, q: r[0], a: r[1], w: [r[2], r[3], r[4]], e: r[5] || 'Eigene Frage.', ex: r[6] || '–' }))
    }));
    if (S.custom.length && !L.subjects.some(s => s.id === 'eigene')) L.subjects.push({ id: 'eigene', name: 'Eigene Themen', icon: '✏️', color: '#868e96' });
    qMap = null;
  }
  rebuildCustom();

  /* ---------- Lehrplan & Schulbuch ---------- */
  const lpLine = t => {
    const x = LP && !t.custom ? LP.lpOf(t) : null;
    if (!x) return '';
    const off = x.band === 'e' && t.grade >= 7 ? ' · laut Kernlehrplan Erprobungsstufe (5/6)' : x.band === 'm' && t.grade <= 6 ? ' · laut Kernlehrplan ab Klasse 7' : '';
    return x.field + off;
  };
  const chapOf = t => (own(S.chap, t.key) ? String(S.chap[t.key]) : '');
  // Sobald Kapitel eingetragen sind, stehen die Themen in der Reihenfolge des Schulbuchs
  const byChap = ts => ts.some(chapOf) ? ts.slice().sort((a, b) => { const x = chapOf(a), y = chapOf(b); return x && y ? natCmp(x, y) : x ? -1 : y ? 1 : 0; }) : ts;
  const bookOf = (s, g) => (own(S.books, s + '-' + g) ? String(S.books[s + '-' + g]) : '');

  /* ---------- Level & Abzeichen ---------- */
  const TITLES = ['Neuling', 'Entdecker', 'Lernfuchs', 'Wissenssucher', 'Streber', 'Profi', 'Meister', 'Genie', 'Legende'];
  const levelOf = xp => 1 + Math.floor(Math.sqrt(xp / 40));
  const levelStart = l => 40 * (l - 1) * (l - 1);
  const titleOf = l => TITLES[Math.min(l - 1, TITLES.length - 1)];
  const qVals = s => Object.values(s.quest).filter(q => q && q.done);
  const itemCount = s => qVals(s).reduce((a, q) => a + Object.keys(q.done).filter(k => k !== 'boss').length + Object.keys(q.s2 || {}).length + Object.keys(q.s3 || {}).length, 0);
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
    { id: 'rechner', icon: '🧮', name: 'Kopfrechner', desc: 'Löse 25 Rechenaufgaben richtig.', ok: s => s.genCorrect >= 25 },
    { id: 'apply', icon: '✍️', name: 'Anwender', desc: 'Löse 25 Anwendungsaufgaben richtig (schreiben, zuordnen, ordnen).', ok: s => s.applyDone >= 25 },
    { id: 'quest1', icon: '🗡️', name: 'Erster Sieg', desc: 'Besiege deinen ersten Quest-Gegner.', ok: s => qVals(s).some(q => Object.keys(q.done).length >= 1) },
    { id: 'stars3', icon: '🌟', name: 'Dreisterne-Held', desc: 'Schaffe in der Quest alle drei Stufen eines Fachs.', ok: s => qVals(s).some(q => Object.keys(q.s3 || {}).length >= 1) },
    { id: 'sammler', icon: '🎒', name: 'Sammler', desc: 'Sammle 10 Gegenstände in der Quest.', ok: s => itemCount(s) >= 10 },
    { id: 'questall', icon: '👑', name: 'Held von Edukia', desc: 'Besiege den Endgegner einer Klassen-Quest.', ok: s => qVals(s).some(q => q.done.boss != null) },
    { id: 'legende', icon: '💎', name: 'Legende', desc: 'Hole in einer Quest alle Sterne und entdecke das geheime Ende.', ok: s => Object.keys(s.quest).some(g => allStars(+g)) }
  ];
  const NOTEN = ['', 'sehr gut', 'gut', 'befriedigend', 'ausreichend', 'mangelhaft', 'ungenügend'];
  const noteOf = pct => pct >= 92 ? 1 : pct >= 81 ? 2 : pct >= 67 ? 3 : pct >= 50 ? 4 : pct >= 30 ? 5 : 6;

  /* ---------- Navigation ---------- */
  const view = { screen: 'home', subject: null, challenge: null, sheet: null, edit: null, testcfg: null, lpOpen: false, otherOpen: false, tset: null, questIdx: 0, questStage: 1 };
  let sess = null;
  const go = (screen, extra) => {
    Object.assign(view, { screen }, extra); render(); window.scrollTo(0, 0);
    if (screen === 'home') disarmBack(); else armBack();
  };

  /* ---------- Zurück-Navigation (Pfeil in der App und Zurück-Taste von Browser/Handy) ---------- */
  const PARENT = { editform: 'editor', questprolog: 'questmap', questlevel: 'questmap', questbag: 'questmap', questlog: 'questmap' };
  function goBack() {
    const sc = view.screen;
    if (sc === 'home') return;
    const wasQuest = !!(sess && sess.mode === 'quest');
    if (sc === 'quiz') {
      if (!confirm('Wirklich abbrechen? Dein Fortschritt in dieser Runde geht verloren.')) return;
      sess = null; go(wasQuest ? 'questmap' : 'home'); return;
    }
    if (sc === 'result') { sess = null; go(wasQuest ? 'questmap' : 'home'); return; }
    if (sc === 'sheet') {
      const sh = view.sheet, t = sh.key && topicByKey(sh.key), s = t ? t.subject : sh.subject;
      if (sh.from === 'result' && sess && sess.result) go('result');
      else if (sh.from === 'report') go('report');
      else if (s) go('subject', { subject: s });
      else go('home');
      return;
    }
    let to = PARENT[sc] || 'home';
    if (to === 'questmap' && !S.quest[S.grade]) to = 'home';
    go(to);
  }
  // Ein zusätzlicher Verlaufseintrag dient als Puffer: Die Zurück-Taste führt dann innerhalb der App zurück,
  // statt die Seite zu verlassen (und z. B. ein laufendes Quiz zu verlieren).
  let skipPop = 0;
  const hasBuffer = () => !!(history.state && history.state.lq);
  function armBack() { try { if (!hasBuffer()) history.pushState({ lq: 1 }, ''); } catch { /* z. B. file:// */ } }
  // history.back() wirkt verzögert: Solange ein Rücksprung unterwegs ist, keinen zweiten auslösen (sonst verlässt man die Seite).
  function disarmBack() { try { if (hasBuffer() && !skipPop) { skipPop++; history.back(); } } catch { /* egal */ } }
  window.addEventListener('popstate', () => {
    if (skipPop) { skipPop--; if (view.screen !== 'home') armBack(); return; }
    if (view.screen === 'home') return;
    goBack();
    if (view.screen !== 'home') armBack();
  });
  const TAB = { home: 'home', subject: 'home', sheet: 'home', editor: 'home', editform: 'home', testsetup: 'tests', rewards: 'rewards', report: 'report', friends: 'friends', challenge: 'friends', result: 'home', questmap: 'home', questhero: 'home', questprolog: 'home', questlevel: 'home', questbag: 'home', questlog: 'home' };

  /* ---------- Aufgaben (Items) ----------
     mc = Auswahl, num = Rechenaufgabe, type = selbst schreiben, match = zuordnen, order = in Reihenfolge bringen */
  const mcItem = (q, r, review) => ({ kind: 'mc', q, review, opts: shuffle([{ t: q.a, ok: true }, ...q.w.map(t => ({ t, ok: false }))], r) });
  const typeItem = (q, review) => ({ kind: 'type', q, review });
  const matchItem = (t, m) => ({ kind: 'match', t, m, map: {}, sel: null });
  const orderItem = (t, o) => ({ kind: 'order', t, o, seq: [] });
  // Rundungsfehler der Gleitkommarechnung entfernen (z. B. 113.00000000000001 → 113)
  const numItem = g => { const t = g.make(Math.random); t.ans = Math.round(t.ans * 1e9) / 1e9; return { kind: 'num', g, t }; };
  const isApp = it => it.kind === 'type' || it.kind === 'match' || it.kind === 'order';
  // Wählt bis zu n Fragen; Hin- und Rückfrage desselben Begriffspaares (q.grp) kommen nie gemeinsam vor.
  const pickQs = (qs, n, r) => {
    const out = [], seen = new Set();
    for (const q of shuffle(qs, r)) {
      if (out.length >= n) break;
      if (q.grp != null) { const k = q.topicKey + '#' + q.grp; if (seen.has(k)) continue; seen.add(k); }
      out.push(q);
    }
    return out;
  };
  const keyOf = it => it.kind === 'num' ? 'gen:' + it.g.id : it.q ? it.q.topicKey : it.t.key;
  const nameOfKey = k => k.startsWith('gen:') ? '🧮 ' + ((genById(k.slice(4)) || {}).name || k) : ((topicByKey(k) || {}).name || k);
  const subjOfKey = k => k.startsWith('gen:') ? (genById(k.slice(4)) || {}).subject : (topicByKey(k) || {}).subject;

  /* Anwendungsaufgaben: selbst schreiben, zuordnen, ordnen */
  const canApply = t => {
    if (t._app == null) t._app = (!t.custom || t.vocab) && t.qs.filter(q => q.ty).length + (A.buildMatch(t, Math.random) ? 3 : 0) >= 3;
    return t._app;
  };
  function applyItems(topics, n) {
    if (n <= 0) return [];
    const typed = pickQs(topics.flatMap(t => t.qs.filter(q => q.ty)), n);
    const ord = [], mat = [];
    const reps = topics.length === 1 ? 3 : 1;      // bei einem einzelnen Thema mehrere Zuordnungen mit anderen Begriffen
    shuffle(topics).forEach(t => {
      for (let i = 0; i < reps; i++) { const m = A.buildMatch(t, Math.random); if (m) mat.push(matchItem(t, m)); }
      const o = A.buildOrder(t, Math.random); if (o) ord.push(orderItem(t, o));
    });
    // Gibt es etwas zu ordnen (Jahreszahlen, Größen), ist immer eine Reihenfolge-Aufgabe dabei
    const sp = shuffle(ord).slice(0, n >= 10 ? 2 : 1).concat(shuffle(mat));
    const nSp = Math.min(sp.length, Math.max(Math.ceil(n / 4), n - typed.length));
    return shuffle(typed.slice(0, n - nSp).map(q => typeItem(q, false)).concat(sp.slice(0, nSp)));
  }

  const newSess = o => Object.assign({ topic: null, i: 0, correct: 0, picked: null, seed: null, ch: null, log: [] }, o);
  function startQuiz(t, o = {}) {
    const seeded = o.seed != null;
    const r = seeded ? rng(o.seed) : Math.random;
    let items = pickQs(t.qs, o.count || QUIZ_LEN, r).map(q => mcItem(q, r, false));
    if (!seeded) {
      const extra = shuffle(Object.keys(S.wrong).map(qById).filter(q => q && q.subject === t.subject && q.topicKey !== t.key)).slice(0, 2);
      items = shuffle(items.concat(extra.map(q => mcItem(q, r, true))));
    }
    sess = newSess({ mode: 'quiz', topic: t, title: t.name, items, seed: seeded ? o.seed : null, ch: o.challenge || null });
    go('quiz');
  }
  function startReview() {
    const qs = shuffle(Object.keys(S.wrong).map(qById).filter(Boolean)).slice(0, QUIZ_LEN);
    if (!qs.length) return;
    sess = newSess({ mode: 'quiz', title: 'Wiederholung', items: qs.map(q => mcItem(q, Math.random, true)) });
    go('quiz');
  }
  function startTrain(g) {
    sess = newSess({ mode: 'train', gen: g, title: 'Rechentraining: ' + g.name, items: Array.from({ length: 6 }, () => numItem(g)) });
    go('quiz');
  }
  function startApply(t) {
    const items = applyItems([t], QUIZ_LEN);
    if (!items.length) { toast('Zu diesem Thema gibt es noch keine Anwendungsaufgaben.'); return; }
    sess = newSess({ mode: 'apply', topic: t, title: 'Anwenden: ' + t.name, items });
    go('quiz');
  }
  function startApplyMix(sid) {
    const g = S.grade, sach = shuffle(gensFor(sid, g).filter(x => x.sach)).slice(0, 3);
    const items = shuffle(applyItems(topicsFor(sid, g).filter(canApply), 10 - sach.length).concat(sach.map(numItem)));
    if (!items.length) { toast('In diesem Fach gibt es für diese Klasse noch keine Anwendungsaufgaben.'); return; }
    sess = newSess({ mode: 'apply', subject: sid, title: 'Anwendungs-Mix ' + subj(sid).name, items });
    go('quiz');
  }
  function startTest(cfg) {
    const cats = shuffle(cfg.cats.filter(k => k.startsWith('gen:') ? genById(k.slice(4)) : topicByKey(k)));
    const pools = {};
    cats.forEach(k => { pools[k] = k.startsWith('gen:') ? null : pickQs(topicByKey(k).qs, cfg.n); });
    // Mit Anwendungsaufgaben: ein Teil der Fragen wird selbst geschrieben, dazu kommen einzelne Zuordnungen und Reihenfolgen
    let sp = [];
    if (cfg.apply) {
      cats.filter(k => !k.startsWith('gen:')).forEach(k => { const t = topicByKey(k), o = A.buildOrder(t, Math.random), m = A.buildMatch(t, Math.random); if (o) sp.push(orderItem(t, o)); if (m) sp.push(matchItem(t, m)); });
      sp = shuffle(sp).slice(0, Math.floor(cfg.n / 7));
    }
    const want = cfg.n - sp.length, items = []; let guard = 0;
    while (items.length < want && guard++ < 2000) {
      let progressed = false;
      for (const k of cats) {
        if (items.length >= want) break;
        if (k.startsWith('gen:')) { items.push(numItem(genById(k.slice(4)))); progressed = true; }
        else if (pools[k].length) { const q = pools[k].pop(); items.push(cfg.apply && q.ty && Math.random() < 0.45 ? typeItem(q, false) : mcItem(q, Math.random, false)); progressed = true; }
      }
      if (!progressed) break;
    }
    if (!items.length) { toast('Keine Aufgaben in den gewählten Kategorien.'); return; }
    sess = newSess({ mode: 'test', title: 'Probetest ' + subj(cfg.subject).name + ' · Klasse ' + cfg.grade, cfg, items: shuffle(items.concat(sp)), t0: Date.now() });
    go('quiz');
  }

  /* ---------- Quest-Modus ----------
     Jedes Fach hat drei Stufen: 1 = Auswahlfragen, 2 = zur Hälfte Anwendungsaufgaben, 3 = Meisterprüfung.
     Stufe 1 schaltet das nächste Fach frei; sind alle Fächer geschafft, wartet der Endgegner. */
  const Q = L.quest;
  const STAGES = [null, { n: 10, ratio: 0.7, app: 0 }, { n: 10, ratio: 0.75, app: 0.5 }, { n: 12, ratio: 0.8, app: 0.75 }];
  const BOSS = { n: 15, ratio: 0.8, app: 0.3 };
  const needOf = c => Math.ceil(c.n * c.ratio);
  const qst = g => { const st = S.quest[g]; if (st) { st.done = st.done || {}; st.s2 = st.s2 || {}; st.s3 = st.s3 || {}; } return st; };
  const stageMap = (st, s) => s === 2 ? st.s2 : s === 3 ? st.s3 : st.done;
  const stageDone = (g, id, s) => { const st = qst(g); return !!st && stageMap(st, s)[id] != null; };
  const starsOf = (g, id) => [1, 2, 3].filter(s => stageDone(g, id, s)).length;
  const questLevels = g => L.subjects.filter(s => s.id !== 'eigene' && (nQ(s.id, g) || gensFor(s.id, g).length)).map(s => ({ id: s.id, subject: s })).concat([{ id: 'boss', boss: true }]);
  const questSubs = g => questLevels(g).filter(l => !l.boss);
  const questIdx = g => { const lv = questLevels(g), i = lv.findIndex(l => !stageDone(g, l.id, 1)); return i < 0 ? lv.length : i; };
  const questOpen = (g, idx, s) => { const lv = questLevels(g)[idx]; return !!lv && (lv.boss || s === 1 ? idx <= questIdx(g) : stageDone(g, lv.id, s - 1)); };
  const allStars = g => { const subs = questSubs(g); return !!qst(g) && subs.length > 0 && subs.every(l => starsOf(g, l.id) === 3) && stageDone(g, 'boss', 1); };
  const interCount = (done, total) => total ? Math.min(3, Math.floor(done * 4 / total)) : 0;
  const ENC0 = ['Ein fremder Ort', 'Ein Gegner', '👾', 'Ein Gegner stellt sich dir in den Weg.', 'Du hast gewonnen!', 'Du musst noch üben.', 'Wissenskristall', 'Der Gegner kehrt stärker zurück.', 'Wieder gewonnen!', 'Die Meisterprüfung beginnt.', 'Meisterprüfung bestanden!', 'Talisman', '🧿', 'Kleiner Begleiter', '🐾'];
  const encOf = (g, lv) => lv.boss ? [Q.arcs[g].world, Q.arcs[g].villain, Q.arcs[g].vemoji, Q.arcs[g].bossIntro, Q.arcs[g].bossWin, Q.arcs[g].bossLose, 'Das Licht der Weisheit'] : (Q.enc[lv.id] || ENC0);
  const story = (g, s) => String(s).replace(/\{name\}/g, S.quest[g].hero.name).replace(/\{mentor\}/g, Q.arcs[g].mentor);
  const give = (kind, n) => { S.inv[kind] = Math.min(9, (+S.inv[kind] || 0) + n); };
  if (!S.inv || typeof S.inv !== 'object') S.inv = { joker: 1, heal: 1 };

  function startQuest(g, idx, stage) {
    const lv = questLevels(g)[idx];
    if (!lv || !qst(g)) return;
    const boss = !!lv.boss;
    stage = boss ? 1 : Math.min(3, Math.max(1, stage || 1));
    if (!questOpen(g, idx, stage)) return;
    const c = boss ? BOSS : STAGES[stage], total = c.n + 2;       // zwei Reserve-Aufgaben für Heiltränke
    const topics = boss ? L.subjects.filter(s => s.id !== 'eigene').flatMap(s => topicsFor(s.id, g)) : topicsFor(lv.id, g);
    let gens = shuffle(boss ? (L.gens || []).filter(x => x.grade === g) : gensFor(lv.id, g));
    if (stage > 1) gens = gens.filter(x => x.sach).concat(gens.filter(x => !x.sach));     // ab Stufe 2 zuerst Sachaufgaben
    const nNum = gens.length ? Math.round(total * 0.3) : 0;
    const app = c.app ? applyItems(topics.filter(t => !t.custom), Math.round((total - nNum) * c.app)) : [];
    const used = new Set(app.filter(x => x.q).map(x => x.q.id));
    const mc = pickQs(topics.flatMap(t => t.qs).filter(q => !used.has(q.id)), total - nNum - app.length).map(q => mcItem(q, Math.random, false));
    const nums = gens.length ? Array.from({ length: total - mc.length - app.length }, (_, i) => numItem(gens[i % gens.length])) : [];
    const items = shuffle(mc.concat(app, nums));
    if (!items.length) return;
    const n = Math.min(c.n, items.length), need = Math.ceil(n * c.ratio);
    const e = encOf(g, lv);
    sess = newSess({ mode: 'quest', quest: { g, idx, id: lv.id, stage, need, n, boss, bonus: 0, spare: items.length - n }, title: (boss ? 'Endkampf: ' : 'Kampf: ') + e[1] + (boss ? '' : ' · Stufe ' + stage), items });
    go('quiz');
  }
  function questPanel() {
    const qs = sess.quest, g = qs.g, it = sess.items[sess.i], open = sess.picked == null;
    const wrong = sess.log.length - sess.correct, maxLives = qs.n - qs.need + 1 + qs.bonus, lives = Math.max(0, maxLives - wrong);
    const e = encOf(g, { id: qs.id, boss: qs.boss }), hp = Math.max(0, 100 - Math.round(sess.correct / qs.need * 100));
    const canJ = open && it.kind === 'mc' && !it.hide && S.inv.joker > 0;
    const canH = open && wrong > 0 && qs.bonus < qs.spare && S.inv.heal > 0;
    return `<div class="fight"><div class="mon"><span class="mon-ic">${e[2]}</span><div><b>${esc(e[1])}</b><div class="bar hp"><i style="width:${hp}%"></i></div><small>Noch ${Math.max(0, qs.need - sess.correct)} Treffer nötig</small></div></div><div class="hero"><span class="hero-ic">${esc(S.quest[g].hero.emoji)}</span><span class="hearts" aria-label="${lives} Leben">${'❤️'.repeat(lives)}${'🖤'.repeat(maxLives - lives)}</span></div></div>
      <div class="potions no-print"><button class="pbtn" data-act="joker" ${canJ ? '' : 'disabled'} title="Streicht zwei falsche Antworten (nur bei Auswahlfragen)">🃏 Joker <b>${+S.inv.joker || 0}</b></button><button class="pbtn" data-act="heal" ${canH ? '' : 'disabled'} title="Gibt dir ein verlorenes Leben zurück">🧪 Heiltrank <b>${+S.inv.heal || 0}</b></button></div>`;
  }
  function useJoker() {
    if (!sess || sess.mode !== 'quest' || sess.picked != null) return;
    const it = sess.items[sess.i];
    if (it.kind !== 'mc' || it.hide || !(S.inv.joker > 0)) return;
    it.hide = shuffle(it.opts.map((o, i) => o.ok ? -1 : i).filter(i => i >= 0)).slice(0, 2);
    S.inv.joker--; save(); render();
  }
  function useHeal() {
    if (!sess || sess.mode !== 'quest' || sess.picked != null) return;
    const qs = sess.quest;
    if (!(S.inv.heal > 0) || qs.bonus >= qs.spare || sess.log.length === sess.correct) return;
    qs.bonus++; S.inv.heal--; save(); render(); toast('🧪 Ein Leben zurück!');
  }

  /* ---------- Antworten ---------- */
  function bump(it, ok) {
    const k = keyOf(it), s = S.stats[k] || (S.stats[k] = { a: 0, c: 0 });
    s.a++; if (ok) s.c++;
    S.answered++;
    if (ok) { S.correct++; if (it.kind === 'num') S.genCorrect++; if (isApp(it)) S.applyDone = (+S.applyDone || 0) + 1; }
    if (it.q) { if (ok) delete S.wrong[it.q.id]; else S.wrong[it.q.id] = (S.wrong[it.q.id] || 0) + 1; }
  }
  function record(it, ok, given, note) {
    sess.log.push({ it, ok, given, note: note || '' });
    if (ok) sess.correct++;
    bump(it, ok);
    save();
  }
  // Aktuelle, noch unbeantwortete Aufgabe der gewünschten Art
  const cur = kind => { if (!sess || sess.picked != null) return null; const it = sess.items[sess.i]; return it.kind === kind ? it : null; };
  function answer(i) {
    const it = cur('mc');
    if (!it || !it.opts[i] || (it.hide && it.hide.includes(i))) return;
    sess.picked = i;
    record(it, it.opts[i].ok, it.opts[i].t);
    render(); focusNext();
  }
  // Versteht 12,5 · 12.5 · −3 · 3/4 · gemischte Zahlen wie „1 1/2“; Einheiten am Ende werden ignoriert.
  function parseNum(s) {
    s = String(s).trim().replace(/[−–]/g, '-');
    const mixed = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)/);
    if (mixed) { const d = +mixed[4]; return d ? (mixed[1] ? -1 : 1) * (+mixed[2] + +mixed[3] / d) : NaN; }
    s = s.replace(/\s/g, '');
    const m = s.match(/^([-+]?\d+(?:[.,]\d+)?)(?:\/(\d+(?:[.,]\d+)?))?/);
    if (!m) return NaN;
    const a = parseFloat(m[1].replace(',', '.'));
    if (m[2]) { const b = parseFloat(m[2].replace(',', '.')); return b ? a / b : NaN; }
    return a;
  }
  // Mögliche Lesarten einer Eingabe: „1.024“ kann 1,024 oder 1024 (Tausenderpunkt) bedeuten.
  function numCandidates(text) {
    const out = [parseNum(text)], s = String(text).trim();
    if (/^[-−–]?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s.replace(/\s/g, ''))) out.push(parseNum(s.replace(/\./g, '')));
    return out.filter(v => !isNaN(v));
  }
  // Ohne eigene Toleranz der Aufgabe zählt nur das exakte Ergebnis (bis auf Rundungsfehler).
  const tolOf = t => t.tol != null ? t.tol : 1e-6 + Math.abs(t.ans) * 1e-9;
  const isRight = (t, text) => numCandidates(text).some(v => Math.abs(v - t.ans) <= tolOf(t));
  function answerNum(text) {
    const it = cur('num');
    if (!it) return;
    if (!numCandidates(text).length) { toast('Bitte eine Zahl eingeben (z. B. 12,5 oder 3/4).'); return; }
    sess.picked = String(text).trim();
    record(it, isRight(it.t, text), sess.picked);
    render(); focusNext();
  }
  function answerType(text, skip) {
    const it = cur('type');
    if (!it) return;
    const res = skip ? { ok: false } : A.check(it.q, text);
    if (res.empty) { toast('Bitte eine Antwort eintippen – oder „Weiß ich nicht“ wählen.'); return; }
    sess.picked = skip ? '–' : String(text).trim();
    record(it, res.ok, sess.picked, res.note);
    render(); focusNext();
  }
  // Zuordnen: erst ein Feld antippen, dann den Partner in der anderen Spalte
  function matchTap(side, i) {
    const it = cur('match');
    if (!it) return;
    const free = r => { for (const k of Object.keys(it.map)) if (it.map[k] === r) delete it.map[k]; };
    if (side === 'l') delete it.map[i]; else free(i);
    if (it.sel && it.sel.side !== side) {
      const l = side === 'l' ? i : it.sel.i, r = side === 'r' ? i : it.sel.i;
      free(r); it.map[l] = r; it.sel = null;
    } else it.sel = it.sel && it.sel.i === i ? null : { side, i };
    render();
  }
  function matchCheck() {
    const it = cur('match');
    if (!it) return;
    const m = it.m;
    if (Object.keys(it.map).length < m.left.length) { toast('Ordne zuerst alle Begriffe zu.'); return; }
    const hits = m.left.filter((_, l) => m.right[it.map[l]].i === l).length;
    sess.picked = 'done';
    record(it, hits === m.left.length, hits + ' von ' + m.left.length + ' richtig zugeordnet');
    render(); focusNext();
  }
  function orderTap(i) {
    const it = cur('order');
    if (!it) return;
    const k = it.seq.indexOf(i);
    if (k >= 0) it.seq.splice(k, 1); else it.seq.push(i);
    render();
  }
  function orderCheck() {
    const it = cur('order');
    if (!it) return;
    if (it.seq.length < it.o.items.length) { toast('Tippe zuerst alle Einträge in der richtigen Reihenfolge an.'); return; }
    sess.picked = 'done';
    record(it, it.seq.every((x, k) => x === it.o.sol[k]), it.seq.map(x => it.o.items[x].t).join(' → '));
    render(); focusNext();
  }
  // Ein Quest-Kampf endet vorzeitig, sobald genug Treffer erreicht oder alle Leben verbraucht sind.
  const fightOver = () => !!sess && sess.mode === 'quest' && (sess.correct >= sess.quest.need || (sess.log.length - sess.correct) > sess.quest.n - sess.quest.need + sess.quest.bonus);
  const focusNext = () => { const nx = $app.querySelector('[data-act=next]'); if (nx) nx.focus({ preventScroll: true }); };
  function next() {
    if (!sess || sess.picked == null) return;
    sess.picked = null;
    if (fightOver() || ++sess.i >= sess.items.length) finish(); else { render(); window.scrollTo(0, 0); }
  }

  function finish() {
    const isQuest = sess.mode === 'quest';
    const n = isQuest ? sess.log.length : sess.items.length, c = sess.correct, perfect = c === n && !isQuest;
    const lvBefore = levelOf(S.xp), loot = [];
    let xp = c * (sess.mode === 'test' ? 5 : 10) + (perfect && sess.mode !== 'test' ? 25 : 0);
    const t = today();
    if (S.lastDay !== t) { S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1; S.lastDay = t; S.bestStreak = Math.max(S.bestStreak, S.streak); }
    if (S.daily.day !== t) S.daily = { day: t, n: 0 };
    const dBefore = S.daily.n;
    S.daily.n += c;
    // Tränke für die Quest verdient man auch beim normalen Üben
    if (dBefore < DAILY_GOAL && S.daily.n >= DAILY_GOAL) { give('heal', 1); loot.push('🧪 +1 Heiltrank für die Quest (Tagesziel erreicht)'); }
    if (perfect && n >= 6 && (sess.mode === 'quiz' || sess.mode === 'apply')) { give('joker', 1); loot.push('🃏 +1 Joker für die Quest (fehlerfreie Runde)'); }
    S.quizzes++; if (perfect && sess.mode !== 'test') S.perfect++;
    if (sess.topic) {
      S.played[sess.topic.subject] = 1;
      const pct = Math.round(c / n * 100), tab = sess.mode === 'apply' ? S.bestA : S.best;
      if (pct > (tab[sess.topic.key] || 0)) tab[sess.topic.key] = pct;
    } else if (sess.gen) S.played[sess.gen.subject] = 1;
    else if (sess.cfg) S.played[sess.cfg.subject] = 1;
    else if (sess.subject) S.played[sess.subject] = 1;
    let duel = null;
    if (sess.ch) {
      const o = sess.ch, res = c > o.p ? 'win' : c < o.p ? 'loss' : 'draw';
      S.duels++; if (res === 'win') { S.wins++; xp += 20; }
      const f = own(S.friends, o.n) ? S.friends[o.n] : { w: 0, d: 0, l: 0 };
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
    let quest = null;
    if (isQuest) {
      const qs = sess.quest, g = qs.g, win = c >= qs.need, st = qst(g), map = stageMap(st, qs.stage), e = encOf(g, { id: qs.id, boss: qs.boss });
      const subs = questSubs(g), cnt = () => subs.filter(l => stageDone(g, l.id, 1)).length;
      const interBefore = interCount(cnt(), subs.length), starsBefore = allStars(g);
      quest = Object.assign({ win, c, answered: n, loot: [], item: null, inter: null, secret: false }, qs);
      if (!qs.boss) S.played[qs.id] = 1;
      if (win) {
        const first = map[qs.id] == null;
        map[qs.id] = Math.max(map[qs.id] || 0, Math.round(c / n * 100));
        if (first) {
          if (qs.boss) { xp += 60; give('joker', 2); give('heal', 2); quest.loot.push('🃏 +2 Joker', '🧪 +2 Heiltränke'); }
          else if (qs.stage === 1) { xp += 30; give('joker', 1); quest.loot.push('🃏 +1 Joker'); quest.item = { ic: '🔷', name: e[6] }; }
          else if (qs.stage === 2) { xp += 40; give('heal', 1); quest.loot.push('🧪 +1 Heiltrank'); quest.item = { ic: e[12], name: e[11] }; }
          else { xp += 50; give('joker', 1); give('heal', 1); quest.loot.push('🃏 +1 Joker', '🧪 +1 Heiltrank'); quest.item = { ic: e[14], name: e[13] }; }
          const ia = interCount(cnt(), subs.length);
          if (ia > interBefore) quest.inter = (Q.arcs[g].inter || [])[ia - 1] || null;
          if (!starsBefore && allStars(g)) quest.secret = true;
        }
      }
    }
    S.xp += xp;
    const fresh = BADGES.filter(b => !S.badges[b.id] && b.ok(S));
    fresh.forEach(b => S.badges[b.id] = t);
    save();
    sess.result = { xp, perfect, duel, fresh, test, quest, loot, levelUp: levelOf(S.xp) > lvBefore };
    go('result');
  }

  /* ---------- Challenge-Links ---------- */
  const baseUrl = () => location.href.split('#')[0];
  const enc = o => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  function dec(code) {
    try {
      const o = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
      // Neue Links nennen den Themen-Schlüssel (k), ältere Fach, Klasse und Thema einzeln.
      const t = topicByKey(String(o.k || (o.s + '-' + o.g + '-' + o.t)));
      if (!t || t.custom || !Number.isInteger(o.d) || !Number.isInteger(o.p) || !Number.isInteger(o.m) || o.p < 0 || o.m < 1 || o.p > o.m || o.m > t.qs.length) return null;
      // Der Name stammt aus einem fremden Link: kürzen und Namen sperren, die Objekt-Eigenschaften überschreiben würden.
      let name = String(o.n || 'Freund').trim().slice(0, 20) || 'Freund';
      if (name in Object.prototype) name = 'Freund';
      return { topic: t, seed: o.d, p: o.p, m: o.m, n: name };
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
    const url = baseUrl() + '#c=' + enc({ k: t.key, d: sess.seed, n: S.name, p: sess.correct, m: sess.items.length });
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
    const pct = Math.round((S.xp - a) / (b - a) * 100), dark = isDark();
    return `<header class="top no-print">
      <div class="brand"><span class="logo">🎓</span><div><h1>LernQuest</h1><p>${S.name ? 'Hallo ' + esc(S.name) + '!' : 'Gymnasium NRW · Klasse 5–10'}${S.grade ? ' · Klasse ' + S.grade : ''}</p></div></div>
      <div class="chips"><span class="chip" title="Tage in Folge">🔥 ${S.lastDay === today() || S.lastDay === yesterday() ? S.streak : 0}</span><span class="chip" title="Erfahrungspunkte">⭐ ${S.xp}</span><button class="chip tgl" data-act="theme" aria-pressed="${dark}" aria-label="${dark ? 'Zum hellen Design wechseln' : 'Zum dunklen Design wechseln'}" title="${dark ? 'Helles Design' : 'Dunkles Design'}">${dark ? '☀️' : '🌙'}</button></div>
      <div class="lvl"><span>Level ${lv} · ${titleOf(lv)}</span><div class="bar"><i style="width:${pct}%"></i></div></div>
    </header>`;
  }
  const gradeChips = (act = 'setgrade') => `<div class="chips-row no-print" role="tablist" aria-label="Klassenstufe">${L.grades.map(g => `<button role="tab" aria-selected="${g === S.grade}" class="gchip ${g === S.grade ? 'on' : ''}" data-act="${act}" data-g="${g}">Klasse ${g}</button>`).join('')}</div>`;
  const gradeSpan = gs => { gs = [...new Set(gs)].sort((a, b) => a - b); return gs.length > 1 && gs[gs.length - 1] - gs[0] === gs.length - 1 ? gs[0] + '–' + gs[gs.length - 1] : gs.join(', '); };

  function viewHome() {
    const g = S.grade;
    if (!g) return `${header()}<h2>In welcher Klasse bist du?</h2><div class="gradegrid">${L.grades.map(x => `<button class="gbig" data-act="setgrade" data-g="${x}"><b>${x}</b><small>Klasse</small></button>`).join('')}</div><p class="hint">Danach siehst du nur die Fächer und Themen deiner Klasse. Du kannst die Klasse jederzeit wechseln.</p>`;
    const t = today(), dn = S.daily.day === t ? S.daily.n : 0, dp = Math.min(100, Math.round(dn / DAILY_GOAL * 100));
    const wrongN = Object.keys(S.wrong).filter(qById).length;
    const subs = L.subjects.filter(s => topicsFor(s.id, g).length || gensFor(s.id, g).length);
    const more = L.subjects.filter(s => s.id !== 'eigene' && !subs.includes(s) && L.topics.some(x => x.subject === s.id));
    const questCard = () => {
      const st = qst(g), arc = Q.arcs[g], tot = questLevels(g).length, curI = questIdx(g), sb = questSubs(g);
      const stars = sb.reduce((a, l) => a + starsOf(g, l.id), 0);
      return `<button class="card questcard" data-act="quest"><span class="ic">🗺️</span><span><b>Quest-Modus: ${esc(arc.world)}</b><small>${!st ? 'Starte dein Abenteuer durch alle Fächer von Klasse ' + g + '!' : (curI >= tot ? '🏆 Endgegner besiegt' : 'Weiter mit Level ' + (curI + 1) + ' von ' + tot) + ' · ⭐ ' + stars + '/' + sb.length * 3 + ' · ' + esc(st.hero.name) + ' ' + esc(st.hero.emoji)}</small></span></button>`;
    };
    return `${header()}${gradeChips()}
      <section class="card goal"><div class="row"><b>Tagesziel</b><span>${Math.min(dn, DAILY_GOAL)} / ${DAILY_GOAL} richtige Antworten ${dn >= DAILY_GOAL ? '✅' : ''}</span></div><div class="bar big"><i style="width:${dp}%"></i></div></section>
      ${questCard()}
      ${wrongN ? `<button class="card review" data-act="review"><span class="ic">🔁</span><span><b>Wiederholen</b><small>${wrongN} Frage${wrongN > 1 ? 'n' : ''}, die du noch festigen kannst</small></span></button>` : ''}
      <h2>Deine Fächer in Klasse ${g}</h2>
      <div class="grid">${subs.map(s => {
        const n = nQ(s.id, g), gn = gensFor(s.id, g).length;
        return `<button class="subj" style="--c:${s.color}" data-act="subject" data-id="${s.id}"><span class="ic">${s.icon}</span><b>${esc(s.name)}</b><small>${n} Fragen${gn ? ' + Rechentraining' : ''}</small></button>`;
      }).join('') || '<div class="card empty">Für diese Klasse gibt es noch keine Inhalte.</div>'}</div>
      ${more.length ? `<h2>Weitere Fächer <small>Themen aus anderen Klassen</small></h2><div class="grid">${more.map(s => `<button class="subj soon" style="--c:${s.color}" data-act="subject" data-id="${s.id}"><span class="ic">${s.icon}</span><b>${esc(s.name)}</b><small>Themen für Klasse ${gradeSpan(L.topics.filter(x => x.subject === s.id).map(x => x.grade))}</small></button>`).join('')}</div>` : ''}
      <div class="btns no-print" style="margin-top:16px"><button class="btn ghost" data-act="editor">✏️ Eigene Themen erstellen</button></div>`;
  }

  function viewSubject() {
    const s = subj(view.subject), g = S.grade;
    const ts = byChap(topicsFor(s.id, g)), gs = gensFor(s.id, g), bk = bookOf(s.id, g);
    const others = L.topics.filter(t => t.subject === s.id && t.grade !== g && !t.custom);
    const uv = LP && LP.uvOf(s.id, g), note = LP && LP.note[s.id], books = (LP && LP.books[s.id]) || [];
    const oOpen = view.otherOpen || (!ts.length && !gs.length);
    const lpCard = !LP || s.id === 'eigene' ? '' : `<section class="card lp"><button class="lphead" data-act="lptoggle" aria-expanded="${!!view.lpOpen}"><b>📘 Lehrplan &amp; Schulbuch</b><span>${bk ? esc(bk) + ' · ' : ''}${view.lpOpen ? '▲' : '▼'}</span></button>${view.lpOpen ? `
        <p class="hint">Jedes Thema ist einem Inhaltsfeld des Kernlehrplans NRW (Gymnasium, G9) zugeordnet. In welcher Klasse ein Inhaltsfeld drankommt, legt jede Schule selbst fest – der Kernlehrplan trennt nur die Klassen 5/6 von den Klassen 7–10.</p>
        ${note ? `<p class="hint">ℹ️ ${esc(note)}</p>` : ''}
        ${uv ? `<h3>Beispiel-Unterrichtsvorhaben Klasse ${esc(uv.span)}</h3><ul class="uv">${uv.list.map(x => `<li>${esc(x)}</li>`).join('')}</ul><p class="hint">Aus dem Beispiel-Lehrplan des Landes – die Reihenfolge an deiner Schule kann anders sein.</p>` : ''}
        <h3>Dein Schulbuch für Klasse ${g}</h3>
        <form class="inline" data-form="book"><input name="b" list="booklist" maxlength="40" value="${esc(bk)}" placeholder="${books.length ? 'z. B. ' + esc(books[0]) : 'Name des Schulbuchs'}" aria-label="Schulbuch"><datalist id="booklist">${books.map(b => `<option value="${esc(b)}">`).join('')}</datalist><button class="btn">Speichern</button></form>
        <p class="hint">Trage danach bei jedem Thema über ⚙️ das Kapitel oder die Seite ein. Die Themen stehen dann in der Reihenfolge deines Buches, und Probetests lassen sich kapitelweise zusammenstellen.</p>
        <p class="hint">Quelle: ${esc(LP.source)}</p>` : ''}</section>`;
    const tsetForm = t => `<form class="tset" data-form="tset" data-key="${t.key}"><label>Kapitel oder Seite im Schulbuch<input name="chap" maxlength="20" value="${esc(chapOf(t))}" placeholder="z. B. 3.2 oder S. 84"></label><label>Bei uns in Klasse<select name="grade">${L.grades.map(x => `<option value="${x}" ${x === t.grade ? 'selected' : ''}>${x}${x === t.grade0 ? ' (Vorgabe)' : ''}</option>`).join('')}</select></label><div class="btns"><button class="btn">Speichern</button></div></form>`;
    return `<div class="bar-top no-print"><button class="back" data-act="home" aria-label="Zurück">←</button><h2 style="--c:${s.color}">${s.icon} ${esc(s.name)} · Klasse ${g}</h2></div>
      ${gradeChips('setgrade')}
      <div class="btns no-print" style="margin:8px 0"><button class="btn alt" data-act="testsetup" data-id="${s.id}">📝 Probetest</button>${ts.some(canApply) ? `<button class="btn" data-act="applymix" data-id="${s.id}">✍️ Anwendungs-Mix</button>` : ''}<button class="btn ghost" data-act="sheet" data-subject="${s.id}">🖨️ Lernzettel (alle Themen)</button></div>
      ${lpCard}
      ${gs.length ? `<h2>🧮 Rechentraining <small>zufällige Aufgaben mit Rechenweg</small></h2>${gs.map(x => `<article class="card topic" style="--c:${s.color}"><div><h3>${esc(x.name)}</h3><small>unendlich viele Aufgaben · ${S.stats['gen:' + x.id] ? S.stats['gen:' + x.id].c + ' von ' + S.stats['gen:' + x.id].a + ' richtig' : 'noch nicht geübt'}</small></div><div class="btns"><button class="btn" data-act="train" data-id="${x.id}">Üben</button></div></article>`).join('')}` : ''}
      <h2>Themen${ts.some(chapOf) ? ' <small>nach Schulbuch-Kapitel sortiert</small>' : ''}</h2>
      ${ts.length ? ts.map(t => {
        const best = S.best[t.key], bA = S.bestA[t.key], ch = chapOf(t), line = lpLine(t);
        return `<article class="card topic" style="--c:${s.color}"><div><h3>${ch ? `<span class="chapb">📖 ${esc(ch)}</span> ` : ''}${esc(t.name)}</h3><small>${t.qs.length} Fragen · ${best != null ? 'Bestleistung ' + best + ' %' + (best === 100 ? ' 🌟' : '') : 'noch nicht gespielt'}${bA != null ? ' · ✍️ ' + bA + ' %' : ''}</small>${best != null ? `<div class="bar"><i style="width:${best}%"></i></div>` : ''}${line ? `<small class="lpline">📘 ${esc(line)}</small>` : ''}</div>
          <div class="btns"><button class="btn" data-act="start" data-key="${t.key}">Quiz starten</button>${canApply(t) ? `<button class="btn alt" data-act="apply" data-key="${t.key}" title="Selbst schreiben, zuordnen, ordnen">✍️ Anwenden</button>` : ''}<button class="btn ghost" data-act="sheet" data-key="${t.key}">📄 Lernzettel</button>${t.custom ? '' : `<button class="btn ghost" data-act="duel" data-key="${t.key}" title="Freund herausfordern" aria-label="Freund herausfordern">⚔️</button><button class="btn ghost" data-act="tset" data-key="${t.key}" title="Schulbuch-Kapitel und Klasse einstellen" aria-label="Schulbuch-Kapitel und Klasse einstellen" aria-expanded="${view.tset === t.key}">⚙️</button>`}</div>${view.tset === t.key ? tsetForm(t) : ''}</article>`;
      }).join('') : `<div class="card empty">Für Klasse ${g} gibt es in diesem Fach noch keine Themen. ${others.length ? 'Unten findest du Themen aus anderen Klassen – du kannst sie in deine Klasse holen.' : '🚧'}</div>`}
      ${others.length ? `<section class="card lp"><button class="lphead" data-act="othertoggle" aria-expanded="${oOpen}"><b>🔀 Themen aus anderen Klassen</b><span>${others.length} · ${oOpen ? '▲' : '▼'}</span></button>${oOpen ? `<p class="hint">Behandelt deine Schule ein Thema in einem anderen Jahr? Mit „In Klasse ${g}“ holst du es in deine Klasse.</p>${L.grades.filter(x => x !== g).map(x => { const l = others.filter(t => t.grade === x); return l.length ? `<h3 class="oh">Klasse ${x}</h3>${l.map(t => `<div class="fr"><div><b>${esc(t.name)}</b><small>${t.qs.length} Fragen</small></div><span class="btns"><button class="btn ghost" data-act="start" data-key="${t.key}">Quiz</button><button class="btn ghost" data-act="adopt" data-key="${t.key}">In Klasse ${g}</button></span></div>`).join('')}` : ''; }).join('')}` : ''}</section>` : ''}`;
  }

  /* --- Quest-Ansichten --- */
  function viewQuestMap() {
    const g = S.grade, st = qst(g), arc = Q.arcs[g], lv = questLevels(g), curI = questIdx(g), subs = questSubs(g);
    const stars = subs.reduce((a, l) => a + starsOf(g, l.id), 0), bossDone = stageDone(g, 'boss', 1);
    return `${header()}<div class="bar-top no-print"><button class="back" data-act="home" aria-label="Zurück">←</button><h2>🗺️ ${esc(arc.world)}</h2></div>
      <section class="card hero-card"><span class="hero-big">${esc(st.hero.emoji)}</span><div><b>${esc(st.hero.name)}</b><small>Klasse ${g} · ⭐ ${stars} von ${subs.length * 3} Sternen${bossDone ? ' · 🏆 Endgegner besiegt' : ''}</small><small>🃏 ${+S.inv.joker || 0} Joker · 🧪 ${+S.inv.heal || 0} ${+S.inv.heal === 1 ? "Heiltrank" : "Heiltränke"}</small></div></section>
      <div class="btns no-print" style="margin-top:10px"><button class="btn ghost" data-act="questlog">📖 Chronik</button><button class="btn ghost" data-act="questbag">🎒 Sammlung</button></div>
      ${bossDone ? `<section class="card story-end"><b>🎉 ${esc(arc.villain)} ist besiegt!</b><p class="story">${esc(story(g, arc.epilogue))}</p>${allStars(g) ? '' : `<p class="hint">Es fehlen noch ${subs.length * 3 - stars} Sterne. Wer alle sammelt, entdeckt das geheime Ende …</p>`}</section>` : ''}
      ${allStars(g) ? `<section class="card story-end"><b>💎 Geheimes Ende</b><p class="story">${esc(story(g, arc.secret))}</p></section>` : ''}
      <div class="path">${lv.map((l, i) => {
        const e = encOf(g, l), isDone = stageDone(g, l.id, 1), isCur = i === curI, locked = i > curI;
        if (l.boss) return `<article class="card node ${isDone ? 'done' : isCur ? 'cur' : 'locked'}"><span class="node-ic">${locked ? '🔒' : e[2]}</span><div><b>⚔️ Endkampf: ${esc(locked ? 'Der Endgegner wartet …' : e[0])}</b><small>${locked ? 'Schaffe zuerst in jedem Fach die Stufe 1' : esc(e[1]) + ' · Fragen aus allen Fächern'}</small>${isDone ? `<small class="ok-t">✅ Bestleistung ${st.done.boss} %</small>` : ''}</div>${locked ? '' : `<button class="btn ${isCur ? '' : 'ghost'}" data-act="questgo" data-i="${i}" data-s="1">${isDone ? 'Erneut' : 'Kämpfen'}</button>`}</article>`;
        const n = starsOf(g, l.id);
        return `<article class="card node ${n === 3 ? 'done' : isCur ? 'cur' : locked ? 'locked' : isDone ? 'part' : ''}"><span class="node-ic">${locked ? '🔒' : e[2]}</span><div><b>${esc(e[0])}</b><small>${locked ? 'Besiege zuerst den vorherigen Gegner' : esc(e[1]) + ' · ' + esc(l.subject.name)}</small>${locked ? '' : `<small class="stars" aria-label="${n} von 3 Sternen">${'★'.repeat(n)}${'☆'.repeat(3 - n)}</small>`}</div>
          ${locked ? '' : `<div class="stgs" role="group" aria-label="Stufen">${[1, 2, 3].map(sg => { const d = stageDone(g, l.id, sg), o = questOpen(g, i, sg); return `<button class="stg ${d ? 'done' : o ? 'open' : 'lock'}" data-act="questgo" data-i="${i}" data-s="${sg}" ${o ? '' : 'disabled'} aria-label="Stufe ${sg}${d ? ' (geschafft)' : o ? '' : ' (gesperrt)'}">${d ? '★' : o ? '⚔️' : '🔒'}<small>Stufe ${sg}</small></button>`; }).join('')}</div>`}</article>`;
      }).join('')}</div>
      <p class="hint">Stufe 1: Auswahlfragen · Stufe 2: zur Hälfte selbst schreiben, zuordnen und ordnen · Stufe 3: Meisterprüfung. Für jede Stufe gibt es einen Stern und ein Sammelstück.</p>
      <div class="btns no-print" style="margin-top:14px"><button class="btn ghost" data-act="questreset">Quest neu starten</button></div>`;
  }
  function viewQuestHero() {
    const g = S.grade, arc = Q.arcs[g];
    return `<div class="bar-top no-print"><button class="back" data-act="home" aria-label="Zurück">←</button><h2>🗺️ ${esc(arc.world)}</h2></div>
      <form class="card" data-form="hero"><h3>Wer bist du, Held:in?</h3>
        <label class="lbl">Dein Name<input name="n" maxlength="20" required value="${esc(S.name)}" placeholder="z. B. Mia"></label>
        <p class="lbl">Wähle deinen Charakter</p><div class="heropick">${Q.heroes.map((h, i) => `<label><input type="radio" name="e" value="${h}" ${i === 0 ? 'checked' : ''}><span>${h}</span></label>`).join('')}</div>
        <div class="btns" style="margin-top:14px"><button class="btn">Abenteuer beginnen →</button></div></form>`;
  }
  function viewQuestProlog() {
    const g = S.grade, arc = Q.arcs[g];
    return `<section class="card story-card"><div class="big-ic">${arc.vemoji}</div><h2>${esc(arc.world)}</h2>${arc.prologue.map(p => `<p class="story">${esc(story(g, p))}</p>`).join('')}<div class="btns col"><button class="btn" data-act="questmap">Zur Karte →</button></div></section>`;
  }
  function viewQuestLevel() {
    const g = S.grade, i = view.questIdx, lv = questLevels(g)[i], e = encOf(g, lv);
    const sg = lv.boss ? 1 : Math.min(3, Math.max(1, view.questStage || 1)), c = lv.boss ? BOSS : STAGES[sg], need = needOf(c);
    const intro = lv.boss ? e[3] : [e[3], e[7], e[9]][sg - 1];
    const task = lv.boss ? 'Beantworte Fragen aus allen Fächern – auch einige zum Selbstschreiben.' : sg === 1 ? 'Beantworte Fragen aus dem Fach ' + esc(lv.subject.name) + '.' : sg === 2 ? 'Jetzt wird angewendet: Etwa die Hälfte der Aufgaben musst du selbst schreiben, zuordnen oder in die richtige Reihenfolge bringen.' : 'Meisterprüfung: Die meisten Aufgaben löst du ohne Auswahlmöglichkeiten.';
    const prize = lv.boss ? '🃏 2 Joker und 🧪 2 Heiltränke' : sg === 1 ? '🔷 ' + esc(e[6]) + ' und 🃏 1 Joker' : sg === 2 ? e[12] + ' ' + esc(e[11]) + ' und 🧪 1 Heiltrank' : e[14] + ' ' + esc(e[13]) + ', 🃏 1 Joker und 🧪 1 Heiltrank';
    return `<div class="bar-top no-print"><button class="back" data-act="questmap" aria-label="Zurück">←</button><h2>${esc(e[0])}${lv.boss ? '' : ' · Stufe ' + sg}</h2></div>
      <section class="card story-card"><div class="big-ic">${e[2]}</div><h3>${esc(e[1])}</h3><p class="story">${esc(story(g, intro))}</p>
        <p class="hint"><b>Aufgabe:</b> ${task} Mit ${need} richtigen Antworten von etwa ${c.n} gewinnst du. Du hast ${c.n - need + 1} Leben ❤️ – bei zu vielen Fehlern ist der Kampf verloren (du kannst es beliebig oft versuchen).</p>
        <p class="hint"><b>Belohnung beim ersten Sieg:</b> ${prize}</p>
        <div class="btns col"><button class="btn" data-act="questfight" data-i="${i}" data-s="${sg}">⚔️ Kampf beginnen</button>${lv.boss ? '' : `<button class="btn ghost" data-act="subject" data-id="${lv.id}">Erst üben</button>`}</div></section>`;
  }
  function viewQuestBag() {
    const g = S.grade, arc = Q.arcs[g], subs = questSubs(g);
    const slot = (got, ic, name, sg) => `<div class="slot ${got ? 'got' : ''}"><span>${got ? ic : '❔'}</span><small>${got ? esc(name) : 'Stufe ' + sg}</small></div>`;
    return `<div class="bar-top no-print"><button class="back" data-act="questmap" aria-label="Zurück">←</button><h2>🎒 Sammlung · ${esc(arc.world)}</h2></div>
      <section class="card"><h3>Tränke</h3><div class="fr"><span class="ic">🃏</span><div><b>Joker × ${+S.inv.joker || 0}</b><small>Streicht bei einer Auswahlfrage zwei falsche Antworten.</small></div></div><div class="fr"><span class="ic">🧪</span><div><b>Heiltrank × ${+S.inv.heal || 0}</b><small>Gibt dir im Kampf ein verlorenes Leben zurück.</small></div></div>
        <p class="hint">Nachschub: Quest-Siege, eine fehlerfreie Übungsrunde (Joker) und das erreichte Tagesziel (Heiltrank). Tränke gelten für alle Klassen, höchstens 9 je Sorte.</p></section>
      <h2>Fundstücke <small>${subs.reduce((a, l) => a + starsOf(g, l.id), 0)} von ${subs.length * 3}</small></h2>
      ${subs.map(l => { const e = encOf(g, l); return `<section class="card bag"><div><b>${l.subject.icon} ${esc(l.subject.name)}</b><small>${esc(e[0])}</small></div><div class="slots">${slot(stageDone(g, l.id, 1), '🔷', e[6], 1)}${slot(stageDone(g, l.id, 2), e[12], e[11], 2)}${slot(stageDone(g, l.id, 3), e[14], e[13], 3)}</div></section>`; }).join('')}`;
  }
  function chronicle(g) {
    const arc = Q.arcs[g], subs = questSubs(g), out = [{ ic: arc.vemoji, t: 'Prolog', p: arc.prologue }];
    let done = 0, shown = 0;
    subs.forEach(l => {
      if (!stageDone(g, l.id, 1)) return;
      const e = encOf(g, l), p = [e[4]];
      if (stageDone(g, l.id, 2)) p.push(e[8]);
      if (stageDone(g, l.id, 3)) p.push(e[10]);
      out.push({ ic: e[2], t: e[0] + ': ' + e[1], p });
      done++;
      for (const k = interCount(done, subs.length); shown < k; shown++) { const x = (arc.inter || [])[shown]; if (x) out.push({ ic: '📜', t: x[0], p: [x[1]] }); }
    });
    if (stageDone(g, 'boss', 1)) out.push({ ic: '🏆', t: 'Endkampf: ' + arc.villain, p: [arc.bossWin, arc.epilogue] });
    if (allStars(g)) out.push({ ic: '💎', t: 'Geheimes Ende', p: [arc.secret] });
    return { out, hidden: subs.length - done + (3 - shown) + (stageDone(g, 'boss', 1) ? 0 : 1) + (allStars(g) ? 0 : 1) };
  }
  function viewQuestLog() {
    const g = S.grade, arc = Q.arcs[g], ch = chronicle(g);
    return `<div class="bar-top no-print"><button class="back" data-act="questmap" aria-label="Zurück">←</button><h2>📖 Chronik · ${esc(arc.world)}</h2></div>
      ${ch.out.map((c, i) => `<section class="card chron"><span class="node-ic">${c.ic}</span><div><b>${i ? 'Kapitel ' + i + ': ' : ''}${esc(c.t)}</b>${c.p.map(p => `<p class="story">${esc(story(g, p))}</p>`).join('')}</div></section>`).join('')}
      ${ch.hidden > 0 ? `<div class="card empty">🔒 ${ch.hidden} weitere${ch.hidden === 1 ? 's' : ''} Kapitel wartet${ch.hidden === 1 ? '' : 'en'} noch auf dich.</div>` : ''}`;
  }

  /* --- Quiz --- */
  const COARSE = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  const exP = (q, lbl) => q.ex && q.ex !== '–' ? `<p class="ex"><span>${lbl}</span> ${esc(q.ex)}</p>` : '';
  const fmt = x => String(Math.round(x * 10000) / 10000).replace('.', ',').replace('-', '−');
  const showAns = t => t.show || (t.dec != null && !Number.isInteger(t.ans) ? t.ans.toFixed(t.dec).replace('.', ',').replace('-', '−') : fmt(t.ans));
  const matchSol = it => `<ul class="sol">${it.m.left.map((l, i) => `<li><b>${esc(l)}</b> → ${esc(it.m.right.find(r => r.i === i).t)}</li>`).join('')}</ul>`;
  const orderSol = it => `<ol class="sol">${it.o.sol.map(i => `<li><b>${esc(it.o.items[i].t)}</b> <small>${esc(it.o.items[i].label)}</small></li>`).join('')}</ol>`;
  const orderTask = it => it.o.kind === 'groesse' ? 'Ordne der Größe nach: Tippe zuerst die kleinste Zahl an, dann die nächstgrößere.' : 'Bringe in die richtige Reihenfolge: Tippe zuerst an, was am frühesten war.';
  const ACCENTS = ['é', 'è', 'ê', 'à', 'â', 'ç', 'î', 'ô', 'ù', 'û', 'œ'];

  function viewQuiz() {
    const it = sess.items[sess.i], p = sess.picked, answered = p != null, test = sess.mode === 'test', qs = sess.quest;
    const total = qs ? qs.n + qs.bonus : sess.items.length;
    const last = answered ? sess.log[sess.log.length - 1] : null;
    const bar = `<div class="bar-top no-print"><button class="back" data-act="quit" aria-label="Abbrechen">✕</button>
        <div class="prog"><div class="bar big"><i style="width:${Math.min(100, Math.round((sess.i + (answered ? 1 : 0)) / total * 100))}%"></i></div><small>Aufgabe ${sess.i + 1} von ${qs ? 'höchstens ' : ''}${total} · ${esc(sess.title)}${sess.ch ? ' · ⚔️ gegen ' + esc(sess.ch.n) : ''}</small></div></div>${qs ? questPanel() : ''}`;
    const lastOne = sess.i + 1 >= sess.items.length || fightOver();
    const nextBtn = `<button class="btn" data-act="next">${lastOne ? (test ? 'Test abgeben' : 'Ergebnis ansehen') : 'Weiter'} →</button>`;
    // Rückmeldung nach der Antwort; im Probetest gibt es die Auflösung erst am Ende
    const fb = (good, bad, body) => !answered ? '' : test ? `<div class="fb neutral" aria-live="polite"><b>Antwort gespeichert</b><p>Die Auswertung bekommst du am Ende.</p>${nextBtn}</div>` : `<div class="fb ${last.ok ? 'good' : 'bad'}" aria-live="polite"><b>${last.ok ? good : bad}</b>${body()}${nextBtn}</div>`;
    const rv = it.review ? '<span class="tag">🔁 Wiederholung</span> ' : '';
    // Tipps (nicht im Probetest): bei Rechenaufgaben die ersten Rechenschritte, beim Schreiben Anfangsbuchstabe und Wortanfang
    const sol = it.kind === 'type' ? A.shown(it.q.ty) : '';
    const hintMax = test ? 0 : it.kind === 'num' ? it.t.steps.length - 1 : it.kind === 'type' ? (sol.length > 3 ? 2 : sol.length > 1 ? 1 : 0) : 0, hN = Math.min(it.hints || 0, hintMax);
    const hintBtn = !answered && hN < hintMax ? `<button type="button" class="btn ghost" data-act="hint">💡 ${hN ? 'Noch ein Tipp' : 'Tipp'}</button>` : '';

    if (it.kind === 'mc') {
      const right = it.opts.find(o => o.ok).t;
      return `${bar}<section class="card q">${rv}<h2 class="qtext">${esc(it.q.q)}</h2>
        <div class="opts" role="group" aria-label="Antworten">${it.opts.map((o, i) => {
          const gone = !answered && it.hide && it.hide.includes(i);
          let cls = gone ? 'dim gone' : ''; if (answered) cls = test ? (i === p ? 'picked' : 'dim') : (o.ok ? 'right' : i === p ? 'wrong' : 'dim');
          return `<button class="opt ${cls}" data-act="answer" data-i="${i}" ${answered || gone ? 'disabled' : ''}><kbd>${i + 1}</kbd><span>${esc(o.t)}</span>${answered && !test && o.ok ? '<em>✓</em>' : answered && !test && i === p ? '<em>✗</em>' : ''}</button>`;
        }).join('')}</div>
        ${fb('🎉 Richtig! +10 XP', '💡 Leider falsch', () => `${last.ok ? '' : `<p>Richtig ist: <strong>${esc(right)}</strong></p>`}<p>${esc(it.q.e)}</p>${exP(it.q, 'Zum Beispiel')}`)}</section>`;
    }

    if (it.kind === 'type') {
      const q = it.q, ty = q.ty, prompt = ty.prompt || q.q;
      const hint = ty.mode === 'exact' && !/Groß/.test(prompt) ? '<p class="hint">Achte auf Groß- und Kleinschreibung.</p>' : '';
      return `${bar}<section class="card q">${rv}<span class="tag app">✍️ Selbst schreiben</span><h2 class="qtext">${esc(prompt)}</h2>
        <form class="typeform" data-form="type"><div class="numrow"><input name="a" class="txt" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Deine Antwort" aria-label="Antwort" ${answered ? 'disabled value="' + esc(p) + '"' : 'value="' + esc(it.draft || '') + '"'}>${answered ? '' : '<button class="btn">Prüfen</button>'}</div>
          ${!answered && q.subject === 'franzoesisch' ? `<div class="acc" role="group" aria-label="Sonderzeichen">${ACCENTS.map(k => `<button type="button" class="key sm" data-act="key" data-k="${k}">${k}</button>`).join('')}</div>` : ''}
          ${!answered && hN ? `<div class="tip"><b>💡 Tipp</b><p>Beginnt mit „${esc(sol[0])}“ – ${sol.trim().split(/\s+/).length > 1 ? sol.trim().split(/\s+/).length + ' Wörter, ' : ''}${sol.replace(/\s/g, '').length} Zeichen.</p>${hN > 1 ? `<p>Anfang: „${esc(sol.slice(0, Math.ceil(sol.length / 2)))}…“</p>` : ''}</div>` : ''}
          ${answered ? '' : hint + '<div class="btns" style="margin-top:10px">' + hintBtn + '<button type="button" class="btn ghost" data-act="skip">Weiß ich nicht</button></div>'}</form>
        ${fb('🎉 Richtig! +10 XP', '💡 Leider falsch', () => `${last.ok ? (last.note ? `<p>${esc(last.note)}</p>` : '') : `<p>Richtig ist: <strong>${esc(A.shown(ty))}</strong></p>`}<p>${esc(q.e)}</p>${exP(q, 'Zum Beispiel')}`)}</section>`;
    }

    if (it.kind === 'match') {
      const m = it.m, leftOf = r => { const k = Object.keys(it.map).find(l => it.map[l] === r); return k == null ? -1 : +k; };
      const cell = (side, i, text) => {
        const l = side === 'l' ? i : leftOf(i), paired = side === 'l' ? it.map[i] != null : l >= 0;
        const hit = paired && m.right[side === 'l' ? it.map[i] : i].i === l;
        const cls = answered ? (test ? '' : hit ? 'right' : 'wrong') : it.sel && it.sel.side === side && it.sel.i === i ? 'sel' : paired ? 'paired' : '';
        return `<button class="mbtn ${cls}" data-act="${side === 'l' ? 'ml' : 'mr'}" data-i="${i}" ${answered ? 'disabled' : ''}>${paired ? `<i class="num c${l}">${l + 1}</i>` : '<i class="num none"></i>'}<span>${esc(text)}</span></button>`;
      };
      return `${bar}<section class="card q"><span class="tag app">🔗 Zuordnen</span> <span class="tag sub">${esc(it.t.name)}</span><h2 class="qtext">Was gehört zusammen?</h2>
        ${answered ? '' : '<p class="hint">Tippe links einen Begriff an und dann rechts den passenden Partner.</p>'}
        <div class="match"><div class="mcol">${m.left.map((x, i) => cell('l', i, x)).join('')}</div><div class="mcol">${m.right.map((x, i) => cell('r', i, x.t)).join('')}</div></div>
        ${answered ? '' : `<div class="btns" style="margin-top:12px"><button class="btn" data-act="mcheck" ${Object.keys(it.map).length < m.left.length ? 'disabled' : ''}>Prüfen</button></div>`}
        ${fb('🎉 Alles richtig zugeordnet! +10 XP', '💡 Nicht ganz – ' + esc(last ? last.given : ''), () => `<p>So gehört es zusammen:</p>${matchSol(it)}`)}</section>`;
    }

    if (it.kind === 'order') {
      const o = it.o;
      return `${bar}<section class="card q"><span class="tag app">🔢 Reihenfolge</span> <span class="tag sub">${esc(it.t.name)}</span><h2 class="qtext">${orderTask(it)}</h2>
        <div class="order">${o.items.map((x, i) => {
          const k = it.seq.indexOf(i), cls = answered ? (test ? '' : o.sol[k] === i ? 'right' : 'wrong') : k >= 0 ? 'paired' : '';
          return `<button class="mbtn ${cls}" data-act="oi" data-i="${i}" ${answered ? 'disabled' : ''}>${k >= 0 ? `<i class="num">${k + 1}</i>` : '<i class="num none"></i>'}<span>${esc(x.t)}</span></button>`;
        }).join('')}</div>
        ${answered ? '' : `<p class="hint">Vertippt? Tippe einen Eintrag noch einmal an, um ihn wieder herauszunehmen.</p><div class="btns" style="margin-top:12px"><button class="btn" data-act="ocheck" ${it.seq.length < o.items.length ? 'disabled' : ''}>Prüfen</button></div>`}
        ${fb('🎉 Richtige Reihenfolge! +10 XP', '💡 Nicht ganz', () => `<p>Die richtige Reihenfolge:</p>${orderSol(it)}`)}</section>`;
    }

    const t = it.t;
    return `${bar}<section class="card q"><span class="tag">🧮 ${esc(it.g.name)}</span><h2 class="qtext">${esc(t.q)}</h2>${t.fig ? `<div class="fig">${t.fig}</div>` : ''}
      <form class="numform" data-form="num"><div class="numrow"><input name="a" inputmode="${COARSE ? 'none' : 'decimal'}" autocomplete="off" autocapitalize="off" placeholder="Deine Antwort" aria-label="Antwort" ${answered ? 'disabled value="' + esc(p) + '"' : 'value="' + esc(it.draft || '') + '"'}><span class="unit">${esc(t.unit || '')}</span></div>
        ${answered ? '' : `<div class="keypad" role="group" aria-label="Zahlentastatur">${[['7', '7'], ['8', '8'], ['9', '9'], ['bs', '⌫'], ['4', '4'], ['5', '5'], ['6', '6'], ['clr', 'C'], ['1', '1'], ['2', '2'], ['3', '3'], ['/', '/'], ['−', '−'], ['0', '0'], [',', ','], ['ok', '✓']].map(([k, l]) => k === 'ok' ? `<button class="key ok" aria-label="Prüfen">${l}</button>` : `<button type="button" class="key ${k === 'bs' || k === 'clr' ? 'ctl' : /\d/.test(k) ? '' : 'op'}" data-act="key" data-k="${k}" aria-label="${k === 'bs' ? 'Löschen' : k === 'clr' ? 'Alles löschen' : k === '/' ? 'Bruchstrich' : k === '−' ? 'Minus' : k === ',' ? 'Komma' : k}">${l}</button>`).join('')}</div><p class="hint">Brüche: <b>3/4</b> · Dezimalzahlen mit Komma: <b>0,75</b> · negative Zahlen mit <b>−</b></p>${hN ? `<div class="tip"><b>💡 Tipp</b><ol class="steps">${t.steps.slice(0, hN).map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>` : ''}${hintBtn ? `<div class="btns" style="margin-top:10px">${hintBtn}</div>` : ''}`}</form>
      ${fb('🎉 Richtig! +10 XP', '💡 Nicht ganz', () => `<p>Richtig ist: <strong>${esc(showAns(t))} ${esc(t.unit || '')}</strong></p><p>So rechnest du:</p><ol class="steps">${t.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>`)}</section>`;
  }

  function reviewBlock(x) {
    const it = x.it, mine = `<p>Deine Antwort: <span class="bad-t">${esc(x.given)}</span></p>`;
    if (it.kind === 'mc') return `<article class="card rev"><b>${esc(it.q.q)}</b>${mine}<p>Richtig: <strong>${esc(it.opts.find(o => o.ok).t)}</strong></p><p>${esc(it.q.e)}</p>${exP(it.q, 'Zum Beispiel')}</article>`;
    if (it.kind === 'type') return `<article class="card rev"><b>${esc(it.q.ty.prompt || it.q.q)}</b>${mine}<p>Richtig: <strong>${esc(A.shown(it.q.ty))}</strong></p><p>${esc(it.q.e)}</p>${exP(it.q, 'Zum Beispiel')}</article>`;
    if (it.kind === 'match') return `<article class="card rev"><b>Zuordnen: ${esc(it.t.name)}</b><p><span class="bad-t">${esc(x.given)}</span> – so gehört es zusammen:</p>${matchSol(it)}</article>`;
    if (it.kind === 'order') return `<article class="card rev"><b>Reihenfolge: ${esc(it.t.name)}</b>${mine}<p>Richtig:</p>${orderSol(it)}</article>`;
    return `<article class="card rev"><b>${esc(it.t.q)}</b>${it.t.fig ? `<div class="fig">${it.t.fig}</div>` : ''}${mine}<p>Richtig: <strong>${esc(showAns(it.t))} ${esc(it.t.unit || '')}</strong></p><ol class="steps">${it.t.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></article>`;
  }

  function viewResult() {
    const n = sess.items.length, c = sess.correct, r = sess.result, pct = Math.round(c / n * 100), lv = levelOf(S.xp);
    const wrong = sess.log.filter(x => !x.ok);
    const pops = `${r.levelUp ? `<div class="pop">🎊 Level-Up! Du bist jetzt Level ${lv} – ${titleOf(lv)}</div>` : ''}
      ${r.duel ? `<div class="pop ${r.duel.res}">${r.duel.res === 'win' ? '🏆 Du hast gewonnen' : r.duel.res === 'draw' ? '🤝 Unentschieden' : '😅 Knapp verloren'} gegen ${esc(r.duel.name)}: ${c} zu ${r.duel.them}${r.duel.res === 'win' ? ' (+20 XP)' : ''}</div>` : ''}
      ${r.loot.map(x => `<div class="pop">${esc(x)}</div>`).join('')}
      ${r.fresh.map(b => `<div class="pop badge">${b.icon} Neues Abzeichen: <b>${esc(b.name)}</b></div>`).join('')}`;
    if (r.quest) {
      const R = r.quest, g = R.g, arc = Q.arcs[g], e = encOf(g, { id: R.id, boss: R.boss });
      const winText = R.boss ? e[4] : [e[4], e[8], e[10]][R.stage - 1];
      return `<section class="card result quest-res ${R.win ? 'won' : 'lost'}"><div class="big-ic">${R.win ? '🏆' : '💤'}</div><h2>${R.win ? 'Sieg!' : 'Noch nicht geschafft'}</h2>
        <p class="story">${esc(story(g, R.win ? winText : e[5]))}</p>
        <p class="xp">${R.c} von ${R.answered} richtig · nötig waren ${R.need} Treffer · +${r.xp} XP</p>
        ${R.item ? `<div class="pop badge">${R.item.ic} Neu in deiner Sammlung: <b>${esc(R.item.name)}</b></div>` : ''}${R.loot.map(x => `<div class="pop">${esc(x)}</div>`).join('')}${pops}
        ${R.inter ? `<div class="card story-end"><b>📜 ${esc(R.inter[0])}</b><p class="story">${esc(story(g, R.inter[1]))}</p></div>` : ''}
        ${R.win && R.boss ? `<div class="card story-end"><b>🎉 ${esc(arc.villain)} ist besiegt!</b><p class="story">${esc(story(g, arc.epilogue))}</p></div>` : ''}
        ${R.secret ? `<div class="card story-end"><b>💎 Geheimes Ende</b><p class="story">${esc(story(g, arc.secret))}</p></div>` : ''}
        <div class="btns col">${R.win && !R.boss && R.stage < 3 ? `<button class="btn" data-act="questgo" data-i="${R.idx}" data-s="${R.stage + 1}">Weiter mit Stufe ${R.stage + 1} →</button>` : ''}<button class="btn ${R.win && !R.boss && R.stage < 3 ? 'ghost' : ''}" data-act="quest">Zur Quest-Karte</button>
          ${R.win ? '' : `<button class="btn alt" data-act="questfight" data-i="${R.idx}" data-s="${R.stage}">Nochmal kämpfen</button>${R.boss ? '' : `<button class="btn ghost" data-act="subject" data-id="${R.id}">Erst üben (Themen)</button>`}`}</div></section>
        ${wrong.length ? `<h2>Das war falsch – so geht es richtig</h2>${wrong.map(reviewBlock).join('')}` : ''}`;
    }
    if (r.test) {
      const T = r.test, m = Math.floor(T.secs / 60);
      const plan = T.cats.filter(x => x.pct < 80);
      return `<section class="card result"><div class="note n${T.note}"><small>Deine Note</small><b>${T.note}</b><span>${NOTEN[T.note]}</span></div>
        <h2>${c} von ${n} Aufgaben richtig (${T.pct} %)</h2><p class="xp">+${r.xp} XP · Zeit: ${m} min ${T.secs % 60} s</p>${pops}
        <p class="hint">Notenschlüssel (Richtwert): ab 92 % = 1, 81 % = 2, 67 % = 3, 50 % = 4, 30 % = 5. Deine Schule kann abweichen.</p></section>
        <h2>Ergebnis nach Bereichen</h2><div class="card list">${T.cats.map(x => `<div class="fr"><div><b>${esc(nameOfKey(x.k))}</b><div class="bar"><i style="width:${x.pct}%"></i></div></div><span class="rec"><i class="${x.pct >= 80 ? 'w' : x.pct >= 50 ? 'd' : 'l'}">${x.c}/${x.n}</i></span></div>`).join('')}</div>
        <h2>📋 Dein Übungsplan</h2>${plan.length ? `<div class="card"><ol class="plan">${plan.map(x => {
          const isGen = x.k.startsWith('gen:'), g = isGen ? genById(x.k.slice(4)) : null, tp = isGen ? null : topicByKey(x.k);
          return `<li><b>${esc(nameOfKey(x.k))}</b> (${x.pct} %) – ${x.pct < 50 ? 'Lies zuerst den Lernzettel und mache dann das Quiz zweimal.' : 'Mach das Quiz nochmal und achte auf die Erklärungen.'}<div class="btns no-print">${isGen ? `<button class="btn" data-act="train" data-id="${g.id}">Üben</button>` : `<button class="btn ghost" data-act="sheet" data-key="${x.k}">📄 Lernzettel</button><button class="btn" data-act="start" data-key="${x.k}">Quiz</button>${tp && canApply(tp) ? `<button class="btn alt" data-act="apply" data-key="${x.k}">✍️ Anwenden</button>` : ''}`}</div></li>`;
        }).join('')}</ol></div>` : '<div class="card empty">Stark – in allen Bereichen über 80 %! Weiter so. 🌟</div>'}
        ${wrong.length ? `<h2>Das war falsch – so geht es richtig</h2>${wrong.map(reviewBlock).join('')}` : ''}
        <div class="btns col no-print"><button class="btn" data-act="tab" data-id="tests">Neuer Probetest</button><button class="btn ghost" data-act="home">Zur Übersicht</button></div>`;
    }
    const msg = pct === 100 ? 'Perfekt! Fehlerfrei! 🌟' : pct >= 70 ? 'Stark gemacht! 💪' : pct >= 40 ? 'Gut dran – bleib dabei! 🙂' : 'Übung macht den Meister – probier es nochmal! 🌱';
    const tp = sess.topic;
    return `<section class="card result"><div class="ring" style="--p:${pct}"><b>${c}/${n}</b><small>${pct} %</small></div><h2>${msg}</h2>
        <p class="xp">+${r.xp} XP ${r.perfect ? '· Perfekt-Bonus +25' : ''}</p>${pops}
        <div class="btns col">
          ${sess.mode === 'apply' ? (tp ? `<button class="btn" data-act="apply" data-key="${tp.key}">Nochmal anwenden</button><button class="btn ghost" data-act="start" data-key="${tp.key}">Quiz zu diesem Thema</button>` : `<button class="btn" data-act="applymix" data-id="${esc(sess.subject)}">Noch ein Mix</button>`) : `
          ${tp ? '<button class="btn" data-act="again">Nochmal spielen</button>' : ''}
          ${tp && sess.seed == null && canApply(tp) ? `<button class="btn alt" data-act="apply" data-key="${tp.key}">✍️ Jetzt anwenden (selbst schreiben)</button>` : ''}
          ${sess.gen ? `<button class="btn" data-act="train" data-id="${sess.gen.id}">Noch eine Runde</button>` : ''}
          ${tp && sess.seed != null ? `<button class="btn alt" data-act="share">⚔️ ${sess.ch ? 'Ergebnis zurückschicken' : 'Freund herausfordern'}</button>` : ''}
          ${tp && sess.seed == null && !tp.custom ? `<button class="btn ghost" data-act="duel" data-key="${tp.key}">⚔️ Mit diesem Thema herausfordern</button>` : ''}`}
          <button class="btn ghost" data-act="home">Zur Übersicht</button></div></section>
      ${wrong.length ? `<h2>Das schauen wir uns nochmal an</h2>${wrong.map(reviewBlock).join('')}` : ''}`;
  }

  /* --- Probetest-Einrichtung --- */
  const newTestCfg = (subject, grade) => ({ subject, grade, cats: null, n: 15, apply: true, chaps: [] });
  function viewTestSetup() {
    const g = S.grade;
    if (!g) return `${header()}<div class="card empty">Wähle zuerst auf der Startseite deine Klasse.<div class="btns" style="justify-content:center;margin-top:10px"><button class="btn" data-act="home">Zur Klassenwahl</button></div></div>`;
    const subs = L.subjects.filter(s => topicsFor(s.id, g).length || gensFor(s.id, g).length);
    const cfg = view.testcfg && view.testcfg.grade === g ? view.testcfg : (view.testcfg = newTestCfg((subs[0] || {}).id, g));
    if (!subs.some(s => s.id === cfg.subject)) cfg.subject = (subs[0] || {}).id;
    const ts = byChap(topicsFor(cfg.subject, g)), gs = gensFor(cfg.subject, g);
    if (!cfg.cats) cfg.cats = ts.map(t => t.key).concat(gs.map(x => 'gen:' + x.id));
    const chaps = [...new Set(ts.map(chapOf).filter(Boolean))].sort(natCmp), bk = bookOf(cfg.subject, g);
    return `${header()}<h2>📝 Probetest zusammenstellen</h2>${gradeChips('setgrade')}
      <section class="card"><h3>Fach</h3><div class="chips-row">${subs.map(s => `<button class="gchip ${s.id === cfg.subject ? 'on' : ''}" data-act="tsubject" data-id="${s.id}">${s.icon} ${esc(s.name)}</button>`).join('')}</div></section>
      <section class="card"><h3>Kategorien</h3>
        ${chaps.length ? `<p class="hint">Schnellauswahl nach Schulbuch-Kapitel${bk ? ' (' + esc(bk) + ')' : ''}:</p><div class="chips-row">${chaps.map(c => `<button class="gchip ${cfg.chaps.includes(c) ? 'on' : ''}" data-act="tchap" data-c="${esc(c)}">📖 ${esc(c)}</button>`).join('')}<button class="gchip" data-act="tchap" data-c="">Alle</button></div>` : '<p class="hint">Tipp: Trage im Fach bei den Themen über ⚙️ die Kapitel deines Schulbuchs ein – dann kannst du hier ganze Kapitel auswählen.</p>'}
        <div class="checks">${ts.map(t => `<label><input type="checkbox" data-cat="${t.key}" ${cfg.cats.includes(t.key) ? 'checked' : ''}> ${chapOf(t) ? `<span class="chapb">📖 ${esc(chapOf(t))}</span> ` : ''}${esc(t.name)} <small>(${t.qs.length})</small></label>`).join('')}${gs.map(x => `<label><input type="checkbox" data-cat="gen:${x.id}" ${cfg.cats.includes('gen:' + x.id) ? 'checked' : ''}> 🧮 ${esc(x.name)} <small>(Rechenaufgaben)</small></label>`).join('')}</div></section>
      <section class="card"><h3>Aufgaben</h3><div class="chips-row">${[10, 15, 20, 30].map(n => `<button class="gchip ${cfg.n === n ? 'on' : ''}" data-act="tn" data-n="${n}">${n}</button>`).join('')}</div>
      <div class="checks"><label><input type="checkbox" data-opt="apply" ${cfg.apply ? 'checked' : ''}> ✍️ Mit Anwendungsaufgaben (selbst schreiben, zuordnen, ordnen) – wie in einer echten Arbeit</label></div>
      <p class="hint">Im Test siehst du die Lösungen erst am Ende – wie in der Klassenarbeit. Danach bekommst du Note, Erklärungen und einen Übungsplan.</p>
      <div class="btns" style="margin-top:10px"><button class="btn" data-act="starttest">Test starten</button></div></section>`;
  }

  /* --- Lernzettel --- */
  function viewSheet() {
    const sh = view.sheet;
    const ts = sh.key ? [topicByKey(sh.key)].filter(Boolean) : byChap(topicsFor(sh.subject, S.grade));
    const s = subj(ts.length ? ts[0].subject : sh.subject);
    const gr = ts.length ? ts[0].grade : S.grade, bk = bookOf(s.id, gr);
    return `<div class="bar-top no-print"><button class="back" data-act="back-subject" aria-label="Zurück">←</button><h2>📄 Lernzettel</h2><button class="btn" data-act="print">🖨️ Drucken</button></div>
      <article class="sheet"><h1 class="sheet-title">${s.icon} ${esc(s.name)} · Klasse ${gr}</h1>${bk ? `<p class="lpline">📖 Schulbuch: ${esc(bk)}</p>` : ''}
      ${ts.map(t => `<section class="sheet-topic"><h2>${esc(t.name)}</h2>${chapOf(t) || lpLine(t) ? `<p class="lpline">${chapOf(t) ? '📖 Kapitel/Seite ' + esc(chapOf(t)) + (lpLine(t) ? ' · ' : '') : ''}${lpLine(t) ? '📘 Lehrplan NRW: ' + esc(lpLine(t)) : ''}</p>` : ''}${merkbild(t)}
        ${t.pairs ? `<table class="vocab"><tbody>${t.pairs.map(p => `<tr><td>${esc(p[0])}</td><td>${esc(p[1])}</td></tr>`).join('')}</tbody></table>` :
          t.qs.map(q => `<div class="fact"><b>${esc(q.q)}</b><p>➜ <strong>${esc(q.a)}</strong></p><p>${esc(q.e)}</p>${exP(q, 'Beispiel')}</div>`).join('')}</section>`).join('')}
      <p class="sheet-foot">Erstellt mit LernQuest · ${new Date().toLocaleDateString('de-DE')}</p></article>`;
  }

  /* --- Report --- */
  function viewReport() {
    const st = Object.entries(S.stats).filter(([k]) => k.startsWith('gen:') ? genById(k.slice(4)) : topicByKey(k));
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
      <h2>Abzeichen <small>${BADGES.filter(bd => S.badges[bd.id]).length}/${BADGES.length}</small></h2>
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
      <p class="hint">Mit einer <b>Vokabelliste</b> übst du die Wörter aus deinem Buch: Aus jeder Liste entstehen Quiz, Aufgaben zum Selbstschreiben und Zuordnungen.</p>
      <div class="btns"><button class="btn" data-act="newtopic">+ Neues Thema</button><button class="btn alt" data-act="newvocab">+ Vokabelliste</button></div>
      ${S.custom.length ? S.custom.map(c => `<article class="card topic"><div><h3>${esc(c.name)}</h3><small>${esc(subj(c.subject).name)} · Klasse ${c.grade} · ${c.kind === 'vocab' ? c.pairs.length + ' Vokabeln' : c.rows.length + ' Fragen'}</small></div><div class="btns"><button class="btn" data-act="start" data-key="custom-${c.id}">Quiz</button>${c.kind === 'vocab' ? `<button class="btn alt" data-act="apply" data-key="custom-${c.id}">✍️ Anwenden</button>` : ''}<button class="btn ghost" data-act="edittopic" data-id="${c.id}">Bearbeiten</button><button class="btn ghost" data-act="deltopic" data-id="${c.id}">🗑️</button></div></article>`).join('') : '<div class="card empty">Noch keine eigenen Themen.</div>'}
      <section class="card"><h3>Sichern & Teilen</h3><div class="btns"><button class="btn ghost" data-act="exportfile">⬇️ Exportieren (Datei)</button><label class="btn ghost filebtn">⬆️ Importieren<input type="file" accept="application/json,.json" data-file="import" hidden></label></div></section>`;
  }
  const emptyRow = () => ['', '', '', '', '', '', ''];
  function viewVocabForm() {
    const e = view.edit;
    const subs = L.subjects.filter(s => s.id !== 'eigene').concat([{ id: 'eigene', name: 'Eigene Themen / Sonstiges' }]);
    return `<div class="bar-top no-print"><button class="back" data-act="editor" aria-label="Zurück">←</button><h2>${e.id ? 'Vokabelliste bearbeiten' : 'Neue Vokabelliste'}</h2></div>
      <form data-form="vocab" class="editor">
        <section class="card"><label>Titel<input name="name" maxlength="60" required value="${esc(e.name)}" placeholder="z. B. Unit 3 – At school"></label>
        <div class="two"><label>Fach<select name="subject">${subs.map(s => `<option value="${s.id}" ${s.id === e.subject ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select></label>
        <label>Klasse<select name="grade">${L.grades.map(g => `<option ${g === e.grade ? 'selected' : ''}>${g}</option>`).join('')}</select></label></div></section>
        <section class="card"><label>Vokabeln – eine pro Zeile: <code>deutsch = Fremdsprache</code><textarea name="list" rows="12" placeholder="die Schule = school&#10;der Lehrer = teacher&#10;lernen = to learn&#10;das Heft = exercise book">${esc(e.text)}</textarea></label>
        <p class="hint">Mindestens 4 Vokabeln. Statt <code>=</code> geht auch ein Semikolon, ein Tabulator (Kopieren aus einer Tabelle) oder „ – “. Beim Selbstschreiben wird die rechte Seite abgefragt; Artikel wie „the“, „le“ oder „la“ dürfen fehlen.</p></section>
        <div class="btns"><button class="btn">💾 Speichern</button></div></form>`;
  }
  function viewEditForm() {
    const e = view.edit;
    if (e.kind === 'vocab') return viewVocabForm();
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
    const el = f.elements;
    e.name = el.namedItem('name').value.trim(); e.subject = el.namedItem('subject').value; e.grade = +el.namedItem('grade').value;
    e.rows = e.rows.map((_, i) => [0, 1, 2, 3, 4, 5, 6].map(j => el.namedItem('r' + i + '_' + j).value.trim()));
  }

  /* ---------- Render ---------- */
  function render() {
    // Schutz vor Zuständen, die es nicht geben darf (z. B. Quest-Karte ohne angelegten Helden, Quiz ohne Sitzung)
    if (/^quest(map|prolog|level|bag|log)$/.test(view.screen) && !S.quest[S.grade]) view.screen = S.grade ? 'questhero' : 'home';
    if (view.screen === 'questhero' && !S.grade) view.screen = 'home';
    if (view.screen === 'questlevel' && !questLevels(S.grade)[view.questIdx]) view.screen = 'questmap';
    if ((view.screen === 'quiz' || view.screen === 'result') && !sess) view.screen = 'home';
    const sc = view.screen;
    const body = { home: viewHome, subject: viewSubject, quiz: viewQuiz, result: viewResult, rewards: viewRewards, report: viewReport, friends: viewFriends, challenge: viewChallenge, testsetup: viewTestSetup, sheet: viewSheet, editor: viewEditor, editform: viewEditForm, questmap: viewQuestMap, questhero: viewQuestHero, questprolog: viewQuestProlog, questlevel: viewQuestLevel, questbag: viewQuestBag, questlog: viewQuestLog }[sc]();
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
    const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
    const d = el.dataset;
    switch (d.act) {
      case 'theme': S.theme = isDark() ? 'light' : 'dark'; save(); applyTheme(); render(); break;
      case 'quest': go(S.quest[S.grade] ? 'questmap' : 'questhero'); break;
      case 'questmap': go('questmap'); break;
      case 'questprolog': go('questprolog'); break;
      case 'questbag': go('questbag'); break;
      case 'questlog': go('questlog'); break;
      case 'questgo': go('questlevel', { questIdx: +d.i, questStage: +d.s || 1 }); break;
      case 'questfight': startQuest(S.grade, +d.i, +d.s || 1); break;
      case 'questreset': if (confirm('Quest dieser Klasse wirklich neu starten? Sterne und Sammelstücke dieser Klasse gehen verloren (XP, Abzeichen und Tränke bleiben).')) { delete S.quest[S.grade]; save(); go('questhero'); } break;
      case 'joker': useJoker(); break;
      case 'heal': useHeal(); break;
      case 'key': {
        const inp = $app.querySelector('input[name=a]'); if (!inp || inp.disabled) break;
        const s = inp.selectionStart == null ? inp.value.length : inp.selectionStart, en = inp.selectionEnd == null ? s : inp.selectionEnd;
        if (d.k === 'clr') inp.value = '';
        else if (d.k === 'bs') { if (s !== en) { inp.value = inp.value.slice(0, s) + inp.value.slice(en); inp.setSelectionRange(s, s); } else if (s > 0) { inp.value = inp.value.slice(0, s - 1) + inp.value.slice(s); inp.setSelectionRange(s - 1, s - 1); } }
        else { inp.value = inp.value.slice(0, s) + d.k + inp.value.slice(en); inp.setSelectionRange(s + d.k.length, s + d.k.length); }
        // Fokus zurück ins Feld (am Handy öffnet sich wegen inputmode="none" keine System-Tastatur)
        const pos = inp.selectionStart; inp.focus({ preventScroll: true }); try { inp.setSelectionRange(pos, pos); } catch { /* egal */ }
        break;
      }
      case 'tab': go(d.id === 'tests' ? 'testsetup' : d.id); break;
      case 'home': sess = null; go('home'); break;
      case 'setgrade': S.grade = +d.g; save(); if (view.testcfg) { view.testcfg.cats = null; view.testcfg.chaps = []; } view.tset = null; render(); break;
      case 'subject': go('subject', { subject: d.id, lpOpen: false, otherOpen: false, tset: null }); break;
      case 'lptoggle': view.lpOpen = !view.lpOpen; render(); break;
      case 'othertoggle': view.otherOpen = !view.otherOpen; render(); break;
      case 'tset': view.tset = view.tset === d.key ? null : d.key; render(); break;
      case 'adopt': {
        const t = topicByKey(d.key); if (!t) break;
        if (S.grade === t.grade0) delete S.gradeOv[t.key]; else S.gradeOv[t.key] = S.grade;
        save(); rebuildCustom(); render(); toast('„' + t.name + '“ steht jetzt in Klasse ' + S.grade + '.');
        break;
      }
      case 'start': { const t = topicByKey(d.key); if (t) startQuiz(t); break; }
      case 'apply': { const t = topicByKey(d.key); if (t) startApply(t); break; }
      case 'applymix': startApplyMix(d.id); break;
      case 'duel': { const t = topicByKey(d.key); startQuiz(t, { seed: Math.floor(Math.random() * 2 ** 31), count: Math.min(QUIZ_LEN, t.qs.length) }); break; }
      case 'review': startReview(); break;
      case 'train': startTrain(genById(d.id)); break;
      case 'answer': answer(+d.i); break;
      case 'skip': answerType('', true); break;
      case 'hint': {
        const it = sess && sess.picked == null ? sess.items[sess.i] : null; if (!it) break;
        const inp = $app.querySelector('input[name=a]'); if (inp) it.draft = inp.value;     // schon Getipptes behalten
        it.hints = (it.hints || 0) + 1; render(); break;
      }
      case 'ml': matchTap('l', +d.i); break;
      case 'mr': matchTap('r', +d.i); break;
      case 'mcheck': matchCheck(); break;
      case 'oi': orderTap(+d.i); break;
      case 'ocheck': orderCheck(); break;
      case 'next': next(); break;
      case 'quit': goBack(); break;
      case 'again': startQuiz(sess.topic); break;
      case 'share': shareChallenge(); break;
      case 'accept': { const c = view.challenge; startQuiz(c.topic, { seed: c.seed, count: c.m, challenge: c }); break; }
      case 'testsetup': go('testsetup', { testcfg: newTestCfg(d.id, S.grade) }); break;
      case 'tsubject': Object.assign(view.testcfg, { subject: d.id, cats: null, chaps: [] }); render(); break;
      case 'tn': view.testcfg.n = +d.n; render(); break;
      case 'tchap': {
        // Kapitel an- oder abwählen; ausgewählt sind dann genau die Themen dieser Kapitel
        const c = view.testcfg, ts = topicsFor(c.subject, c.grade);
        if (!d.c) { c.chaps = []; c.cats = null; }
        else { c.chaps = c.chaps.includes(d.c) ? c.chaps.filter(x => x !== d.c) : c.chaps.concat([d.c]); c.cats = c.chaps.length ? ts.filter(t => c.chaps.includes(chapOf(t))).map(t => t.key) : null; }
        render(); break;
      }
      case 'starttest': { const c = view.testcfg; if (!c.cats.length) { toast('Wähle mindestens eine Kategorie.'); break; } startTest(c); break; }
      case 'sheet': go('sheet', { sheet: { key: d.key || null, subject: d.subject || null, from: view.screen } }); break;
      case 'back-subject': goBack(); break;
      case 'print': window.print(); break;
      case 'editor': go('editor'); break;
      case 'newtopic': go('editform', { edit: { id: null, subject: 'mathe', grade: S.grade || 5, name: '', rows: [emptyRow()] } }); break;
      case 'newvocab': go('editform', { edit: { kind: 'vocab', id: null, subject: 'englisch', grade: S.grade || 5, name: '', text: '' } }); break;
      case 'edittopic': { const c = S.custom.find(x => x.id === d.id); if (c.kind === 'vocab') { go('editform', { edit: { kind: 'vocab', id: c.id, subject: c.subject, grade: c.grade, name: c.name, text: c.pairs.map(p => p[0] + ' = ' + p[1]).join('\n') } }); break; } go('editform', { edit: { id: c.id, subject: c.subject, grade: c.grade, name: c.name, rows: c.rows.map(r => r.slice()) } }); break; }
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
    const k = f.dataset.form, el = f.elements;
    if (k === 'name') { S.name = f.n.value.trim().slice(0, 20); save(); toast('Name gespeichert'); render(); }
    if (k === 'paste') { const c = parseCode(f.c.value); if (c) go('challenge', { challenge: c }); else toast('Dieser Link ist ungültig.'); }
    if (k === 'num') answerNum(f.a.value);
    if (k === 'type') answerType(f.a.value, false);
    if (k === 'book') {
      const v = el.namedItem('b').value.trim().slice(0, 40), key = view.subject + '-' + S.grade;
      if (v) S.books[key] = v; else delete S.books[key];
      save(); render(); toast(v ? 'Schulbuch gespeichert ✓' : 'Schulbuch entfernt');
    }
    if (k === 'tset') {
      const t = topicByKey(f.dataset.key); if (!t) return;
      const ch = el.namedItem('chap').value.trim().slice(0, 20), gr = +el.namedItem('grade').value;
      if (ch) S.chap[t.key] = ch; else delete S.chap[t.key];
      if (L.grades.includes(gr) && gr !== t.grade0) S.gradeOv[t.key] = gr; else delete S.gradeOv[t.key];
      save(); rebuildCustom(); view.tset = null; render();
      toast(t.grade !== S.grade ? 'Gespeichert – das Thema steht jetzt in Klasse ' + t.grade + '.' : 'Gespeichert ✓');
    }
    if (k === 'hero') {
      const name = f.n.value.trim().slice(0, 20); if (!name) return;
      if (!S.name) S.name = name;
      S.quest[S.grade] = { hero: { name, emoji: (f.querySelector('input[name=e]:checked') || {}).value || '🧙' }, done: {}, s2: {}, s3: {} };
      save(); go('questprolog');
    }
    if (k === 'vocab') {
      const e = view.edit;
      Object.assign(e, { name: el.namedItem('name').value.trim(), subject: el.namedItem('subject').value, grade: +el.namedItem('grade').value, text: el.namedItem('list').value });
      const pairs = parseVocab(e.text);
      if (!e.name) { toast('Bitte einen Titel eingeben.'); return; }
      if (pairs.length < 4) { toast('Bitte mindestens 4 verschiedene Vokabeln eintragen – eine pro Zeile: deutsch = Fremdsprache.'); return; }
      const rec = { id: e.id || Date.now().toString(36), kind: 'vocab', subject: e.subject, grade: e.grade, name: e.name, pairs, rows: [] };
      const i = S.custom.findIndex(c => c.id === rec.id);
      if (i >= 0) S.custom[i] = rec; else S.custom.push(rec);
      save(); rebuildCustom(); toast(pairs.length + ' Vokabeln gespeichert ✓'); go('editor');
    }
    if (k === 'topic') { collectEditor(); if (saveTopic(view.edit)) { toast('Gespeichert ✓'); go('editor'); } }
  });
  $app.addEventListener('change', e => {
    const c = e.target.closest('[data-cat]');
    if (c && view.testcfg) { const set = new Set(view.testcfg.cats); c.checked ? set.add(c.dataset.cat) : set.delete(c.dataset.cat); view.testcfg.cats = [...set]; }
    if (e.target.matches('[data-opt=apply]') && view.testcfg) view.testcfg.apply = e.target.checked;
    if (e.target.matches('[data-file=import]')) {
      const file = e.target.files[0]; if (!file) return;
      file.text().then(txt => {
        try {
          const o = JSON.parse(txt); const list = Array.isArray(o) ? o : o.topics;
          let n = 0;
          list.forEach(t => {
            if (t && t.kind === 'vocab' && t.name && Array.isArray(t.pairs)) {
              const pairs = parseVocab(t.pairs.filter(p => Array.isArray(p) && p.length >= 2).map(p => String(p[0]).replace(/[=;\n]/g, ' ') + ' = ' + String(p[1]).replace(/\n/g, ' ')).join('\n'));
              if (pairs.length >= 4) S.custom.push({ id: Date.now().toString(36) + (n++), kind: 'vocab', subject: L.subjects.some(s => s.id === t.subject) ? t.subject : 'eigene', grade: L.grades.includes(+t.grade) ? +t.grade : (S.grade || 5), name: String(t.name).slice(0, 60), pairs, rows: [] });
              return;
            }
            if (!t || !t.name || !Array.isArray(t.rows)) return;
            // Nur vollständige Fragen mit vier verschiedenen Antworten übernehmen
            const rows = t.rows.filter(r => Array.isArray(r) && r.length >= 5 && r.slice(0, 5).every(x => typeof x === 'string' && x.trim()) && new Set(r.slice(1, 5).map(x => x.trim())).size === 4).map(r => [0, 1, 2, 3, 4, 5, 6].map(j => String(r[j] || '').trim().slice(0, 400)));
            if (!rows.length) return;
            // Unbekannte Fächer landen unter „Eigene Themen“, sonst wären sie auf der Startseite unsichtbar
            const subject = L.subjects.some(s => s.id === t.subject) ? t.subject : 'eigene';
            S.custom.push({ id: Date.now().toString(36) + (n++), subject, grade: L.grades.includes(+t.grade) ? +t.grade : (S.grade || 5), name: String(t.name).slice(0, 60), rows });
          });
          save(); rebuildCustom(); render(); toast(n + ' Thema/Themen importiert.');
        } catch { toast('Datei konnte nicht gelesen werden.'); }
      });
    }
  });
  document.addEventListener('keydown', e => {
    if (view.screen !== 'quiz' || !sess || e.target.matches('input,textarea,select') || e.metaKey || e.ctrlKey || e.altKey) return;
    const it = sess.items[sess.i];
    if (it.kind === 'mc' && sess.picked == null && /^[1-4]$/.test(e.key)) answer(+e.key - 1);
    else if (sess.picked != null && e.key === 'Enter' && !e.target.closest('button')) next();
  });
  // Folgt das Design dem Gerät, soll ein Wechsel dort (z. B. abends) sofort sichtbar werden
  if (window.matchMedia) { const mq = matchMedia('(prefers-color-scheme: dark)'), on = () => { if (!S.theme) { applyTheme(); render(); } }; if (mq.addEventListener) mq.addEventListener('change', on); }

  function fromHash() {
    const m = location.hash.match(/^#c=(.+)$/); if (!m) return;
    const c = dec(m[1]);
    history.replaceState(history.state, '', baseUrl());
    if (c) { if (!S.grade) S.grade = c.topic.grade; go('challenge', { challenge: c }); } else toast('Dieser Challenge-Link ist ungültig.');
  }
  window.addEventListener('hashchange', fromHash);

  // Prüf-Funktionen für eigene Tests (z. B. in der Browser-Konsole): LERN.util.isRight(aufgabe, 'eingabe')
  L.util = { parseNum, isRight, showAns, check: A.check };

  render();
  fromHash();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    // Wenn im Hintergrund eine neue App-Version geladen wurde, einen Hinweis zum Neuladen zeigen
    const hadWorker = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadWorker || document.querySelector('.update')) return;
      const el = document.createElement('div'); el.className = 'toast update no-print'; el.setAttribute('role', 'status');
      el.innerHTML = '<span>Neue Version von LernQuest verfügbar.</span><button class="btn">Neu laden</button>';
      el.querySelector('button').addEventListener('click', () => location.reload());
      document.body.appendChild(el);
    });
    navigator.serviceWorker.register('sw.js').catch(() => { });
  }
})();
