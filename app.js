(() => {
  'use strict';
  const $app = document.getElementById('app');
  const L = window.LERN;
  const KEY = 'lernapp.v1';
  const QUIZ_LEN = 8;

  /* ---------- Helfer ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rng = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const shuffle = (arr, r = Math.random) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pad = n => String(n).padStart(2, '0');
  const dayStr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = () => dayStr(new Date());
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); };
  const subj = id => L.subjects.find(s => s.id === id);
  const topicByKey = k => L.topics.find(t => t.key === k);
  const qById = (() => { let m = null; return id => { if (!m) { m = {}; L.topics.forEach(t => t.qs.forEach(q => m[q.id] = q)); } return m[id]; }; })();

  /* ---------- Speicher ---------- */
  const defaults = () => ({ name: '', xp: 0, streak: 0, bestStreak: 0, lastDay: '', quizzes: 0, correct: 0, answered: 0, perfect: 0, duels: 0, wins: 0, best: {}, wrong: {}, badges: {}, friends: {}, played: {}, daily: { day: '', n: 0 } });
  const load = () => { try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { return defaults(); } };
  let S = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* privater Modus */ } };

  /* ---------- Level & Abzeichen ---------- */
  const TITLES = ['Neuling', 'Entdecker', 'Lernfuchs', 'Wissenssucher', 'Streber', 'Profi', 'Meister', 'Genie', 'Legende'];
  const levelOf = xp => 1 + Math.floor(Math.sqrt(xp / 40));
  const levelStart = l => 40 * (l - 1) * (l - 1);
  const titleOf = l => TITLES[Math.min(l - 1, TITLES.length - 1)];
  const DAILY_GOAL = 10;
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
    { id: 'lvl5', icon: '⭐', name: 'Level 5', desc: 'Erreiche Level 5.', ok: s => levelOf(s.xp) >= 5 }
  ];

  /* ---------- Navigation ---------- */
  const view = { screen: 'home', subject: null, grade: null, challenge: null };
  let sess = null;
  const go = (screen, extra) => { Object.assign(view, { screen }, extra); render(); window.scrollTo(0, 0); };
  const tabOf = sc => ({ home: 'home', subject: 'home', rewards: 'rewards', friends: 'friends', challenge: 'friends' }[sc]);

  /* ---------- Quiz-Logik ---------- */
  const prep = (q, r, review) => ({ q, review, opts: shuffle([{ t: q.a, ok: true }, ...q.w.map(t => ({ t, ok: false }))], r) });

  function startQuiz(t, o = {}) {
    const seeded = o.seed != null;
    const r = seeded ? rng(o.seed) : Math.random;
    const n = o.count || QUIZ_LEN;
    let items = shuffle(t.qs, r).slice(0, n).map(q => prep(q, r, false));
    if (!seeded) {
      const extra = shuffle(Object.keys(S.wrong).map(qById).filter(q => q && q.subject === t.subject && q.topicKey !== t.key)).slice(0, 2);
      items = shuffle(items.concat(extra.map(q => prep(q, r, true))));
    }
    sess = { topic: t, title: t.name, items, i: 0, correct: 0, picked: null, seed: seeded ? o.seed : null, ch: o.challenge || null, log: [] };
    go('quiz');
  }

  function startReview() {
    const qs = shuffle(Object.keys(S.wrong).map(qById).filter(Boolean)).slice(0, QUIZ_LEN);
    if (!qs.length) return;
    sess = { topic: null, title: 'Wiederholung', items: qs.map(q => prep(q, Math.random, true)), i: 0, correct: 0, picked: null, seed: null, ch: null, log: [] };
    go('quiz');
  }

  function answer(i) {
    if (!sess || sess.picked != null) return;
    const it = sess.items[sess.i];
    sess.picked = i;
    const ok = it.opts[i].ok;
    sess.log.push({ it, ok });
    if (ok) { sess.correct++; delete S.wrong[it.q.id]; } else { S.wrong[it.q.id] = (S.wrong[it.q.id] || 0) + 1; }
    S.answered++; if (ok) S.correct++;
    save(); render();
    const nx = $app.querySelector('[data-act=next]'); if (nx) nx.focus({ preventScroll: true });
  }

  function next() {
    if (!sess || sess.picked == null) return;
    sess.picked = null;
    if (++sess.i >= sess.items.length) finish(); else render();
  }

  function finish() {
    const n = sess.items.length, c = sess.correct, perfect = c === n;
    const lvBefore = levelOf(S.xp);
    let xp = c * 10 + (perfect ? 25 : 0);
    const t = today();
    if (S.lastDay !== t) { S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1; S.lastDay = t; S.bestStreak = Math.max(S.bestStreak, S.streak); }
    if (S.daily.day !== t) S.daily = { day: t, n: 0 };
    S.daily.n += c;
    S.quizzes++; if (perfect) S.perfect++;
    if (sess.topic) {
      S.played[sess.topic.subject] = 1;
      const pct = Math.round(c / n * 100);
      if (pct > (S.best[sess.topic.key] || 0)) S.best[sess.topic.key] = pct;
    }
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
    S.xp += xp;
    const fresh = BADGES.filter(b => !S.badges[b.id] && b.ok(S));
    fresh.forEach(b => S.badges[b.id] = t);
    save();
    sess.result = { xp, perfect, duel, fresh, levelUp: levelOf(S.xp) > lvBefore };
    go('result');
  }

  /* ---------- Challenge-Links ---------- */
  const baseUrl = () => location.href.split('#')[0];
  const enc = o => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  function dec(code) {
    try {
      const o = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
      const t = L.topics.find(x => x.subject === o.s && x.grade === o.g && x.id === o.t);
      if (!t || !Number.isInteger(o.d) || !Number.isInteger(o.p) || !Number.isInteger(o.m) || o.p < 0 || o.m < 1 || o.p > o.m || o.m > t.qs.length) return null;
      return { topic: t, seed: o.d, p: o.p, m: o.m, n: String(o.n || 'Freund').slice(0, 20) };
    } catch { return null; }
  }
  const parseCode = txt => { const m = String(txt).match(/#c=([^\s&]+)/); return dec(m ? m[1] : txt); };

  function toast(msg) {
    const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; el.setAttribute('role', 'status');
    document.body.appendChild(el); setTimeout(() => el.remove(), 2600);
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
    try {
      if (navigator.share) { await navigator.share({ title: 'Lern-Challenge', text, url }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text + '\n' + url); toast('Link kopiert – jetzt an deine Freunde schicken!'); }
    catch { prompt('Kopiere diesen Link und schicke ihn an deine Freunde:', url); }
  }

  /* ---------- Ansichten ---------- */
  function header() {
    const lv = levelOf(S.xp), a = levelStart(lv), b = levelStart(lv + 1);
    const pct = Math.round((S.xp - a) / (b - a) * 100);
    return `<header class="top">
      <div class="brand"><span class="logo">🎓</span><div><h1>LernQuest</h1><p>${S.name ? 'Hallo ' + esc(S.name) + '!' : 'Gymnasium NRW · Klasse 5–10'}</p></div></div>
      <div class="chips"><span class="chip" title="Tage in Folge">🔥 ${S.lastDay === today() || S.lastDay === yesterday() ? S.streak : 0}</span><span class="chip" title="Erfahrungspunkte">⭐ ${S.xp}</span></div>
      <div class="lvl"><span>Level ${lv} · ${titleOf(lv)}</span><div class="bar"><i style="width:${pct}%"></i></div></div>
    </header>`;
  }

  function viewHome() {
    const t = today(), dn = S.daily.day === t ? S.daily.n : 0, dp = Math.min(100, Math.round(dn / DAILY_GOAL * 100));
    const wrongN = Object.keys(S.wrong).filter(qById).length;
    return `${header()}
      <section class="card goal"><div class="row"><b>Tagesziel</b><span>${Math.min(dn, DAILY_GOAL)} / ${DAILY_GOAL} richtige Antworten ${dn >= DAILY_GOAL ? '✅' : ''}</span></div><div class="bar big"><i style="width:${dp}%"></i></div></section>
      ${wrongN ? `<button class="card review" data-act="review"><span class="ic">🔁</span><span><b>Wiederholen</b><small>${wrongN} Frage${wrongN > 1 ? 'n' : ''}, die du noch festigen kannst</small></span></button>` : ''}
      <h2>Wähle dein Fach</h2>
      <div class="grid">${L.subjects.map(s => {
        const n = L.topics.filter(t => t.subject === s.id).length;
        return s.soon
          ? `<div class="subj soon" style="--c:${s.color}"><span class="ic">${s.icon}</span><b>${esc(s.name)}</b><small>bald verfügbar</small></div>`
          : `<button class="subj" style="--c:${s.color}" data-act="subject" data-id="${s.id}"><span class="ic">${s.icon}</span><b>${esc(s.name)}</b><small>${n} Themen</small></button>`;
      }).join('')}</div>`;
  }

  function viewSubject() {
    const s = subj(view.subject);
    const gradesWith = g => L.topics.some(t => t.subject === s.id && t.grade === g);
    if (!view.grade || !L.grades.includes(view.grade)) view.grade = L.grades.find(gradesWith) || 5;
    const ts = L.topics.filter(t => t.subject === s.id && t.grade === view.grade);
    return `<div class="bar-top"><button class="back" data-act="home" aria-label="Zurück">←</button><h2 style="--c:${s.color}">${s.icon} ${esc(s.name)}</h2></div>
      <div class="chips-row" role="tablist" aria-label="Klassenstufe">${L.grades.map(g => `<button role="tab" aria-selected="${g === view.grade}" class="gchip ${g === view.grade ? 'on' : ''} ${gradesWith(g) ? '' : 'empty'}" data-act="grade" data-g="${g}">Klasse ${g}</button>`).join('')}</div>
      ${ts.length ? ts.map(t => {
        const best = S.best[t.key];
        return `<article class="card topic" style="--c:${s.color}"><div><h3>${esc(t.name)}</h3><small>${t.qs.length} Fragen · ${best != null ? 'Bestleistung ' + best + ' %' + (best === 100 ? ' 🌟' : '') : 'noch nicht gespielt'}</small>${best != null ? `<div class="bar"><i style="width:${best}%"></i></div>` : ''}</div>
          <div class="btns"><button class="btn" data-act="start" data-key="${t.key}">Quiz starten</button><button class="btn ghost" data-act="duel" data-key="${t.key}" title="Freund herausfordern">⚔️ Challenge</button></div></article>`;
      }).join('') : `<div class="card empty">Für Klasse ${view.grade} sind in diesem Fach noch keine Themen hinterlegt. 🚧<br><small>Der Ausbau läuft – siehe README, um eigene Inhalte zu ergänzen.</small></div>`}`;
  }

  function viewQuiz() {
    const it = sess.items[sess.i], p = sess.picked, answered = p != null;
    const total = sess.items.length, ok = answered && it.opts[p].ok;
    const right = it.opts.find(o => o.ok).t;
    return `<div class="bar-top"><button class="back" data-act="quit" aria-label="Quiz abbrechen">✕</button>
        <div class="prog"><div class="bar big"><i style="width:${Math.round((sess.i + (answered ? 1 : 0)) / total * 100)}%"></i></div><small>Frage ${sess.i + 1} von ${total} · ${esc(sess.title)}${sess.ch ? ' · ⚔️ gegen ' + esc(sess.ch.n) : ''}</small></div></div>
      <section class="card q">
        ${it.review ? '<span class="tag">🔁 Wiederholung</span>' : ''}
        <h2 class="qtext">${esc(it.q.q)}</h2>
        <div class="opts" role="group" aria-label="Antworten">${it.opts.map((o, i) => {
          let cls = ''; if (answered) cls = o.ok ? 'right' : i === p ? 'wrong' : 'dim';
          return `<button class="opt ${cls}" data-act="answer" data-i="${i}" ${answered ? 'disabled' : ''}><kbd>${i + 1}</kbd><span>${esc(o.t)}</span>${answered && o.ok ? '<em>✓</em>' : answered && i === p ? '<em>✗</em>' : ''}</button>`;
        }).join('')}</div>
        ${answered ? `<div class="fb ${ok ? 'good' : 'bad'}" aria-live="polite">
          <b>${ok ? '🎉 Richtig! +10 XP' : '💡 Leider falsch'}</b>
          ${ok ? '' : `<p>Richtig ist: <strong>${esc(right)}</strong></p>`}
          <p>${esc(it.q.e)}</p>
          <p class="ex"><span>Zum Beispiel</span> ${esc(it.q.ex)}</p>
          <button class="btn" data-act="next">${sess.i + 1 >= total ? 'Ergebnis ansehen' : 'Weiter'} →</button></div>` : ''}
      </section>`;
  }

  function viewResult() {
    const n = sess.items.length, c = sess.correct, r = sess.result, pct = Math.round(c / n * 100);
    const msg = pct === 100 ? 'Perfekt! Fehlerfrei! 🌟' : pct >= 70 ? 'Stark gemacht! 💪' : pct >= 40 ? 'Gut dran – bleib dabei! 🙂' : 'Übung macht den Meister – probier es nochmal! 🌱';
    const lv = levelOf(S.xp);
    const wrong = sess.log.filter(x => !x.ok);
    return `<section class="card result">
        <div class="ring" style="--p:${pct}"><b>${c}/${n}</b><small>${pct} %</small></div>
        <h2>${msg}</h2>
        <p class="xp">+${r.xp} XP ${r.perfect ? '· Perfekt-Bonus +25' : ''}</p>
        ${r.levelUp ? `<div class="pop">🎊 Level-Up! Du bist jetzt Level ${lv} – ${titleOf(lv)}</div>` : ''}
        ${r.duel ? `<div class="pop ${r.duel.res}">${r.duel.res === 'win' ? '🏆 Du hast gewonnen' : r.duel.res === 'draw' ? '🤝 Unentschieden' : '😅 Knapp verloren'} gegen ${esc(r.duel.name)}: ${c} zu ${r.duel.them}${r.duel.res === 'win' ? ' (+20 XP)' : ''}</div>` : ''}
        ${r.fresh.map(b => `<div class="pop badge">${b.icon} Neues Abzeichen: <b>${esc(b.name)}</b></div>`).join('')}
        <div class="btns col">
          ${sess.topic ? `<button class="btn" data-act="again">Nochmal spielen</button>` : ''}
          ${sess.topic && sess.seed != null ? `<button class="btn alt" data-act="share">⚔️ ${sess.ch ? 'Ergebnis zurückschicken' : 'Freund herausfordern'}</button>` : ''}
          ${sess.topic && sess.seed == null ? `<button class="btn alt" data-act="duel" data-key="${sess.topic.key}">⚔️ Mit diesem Thema herausfordern</button>` : ''}
          <button class="btn ghost" data-act="home">Zur Übersicht</button>
        </div>
      </section>
      ${wrong.length ? `<h2>Das schauen wir uns nochmal an</h2>${wrong.map(x => `<article class="card rev"><b>${esc(x.it.q.q)}</b><p>Richtig: <strong>${esc(x.it.opts.find(o => o.ok).t)}</strong></p><p>${esc(x.it.q.e)}</p><p class="ex"><span>Zum Beispiel</span> ${esc(x.it.q.ex)}</p></article>`).join('')}` : ''}`;
  }

  function viewRewards() {
    const lv = levelOf(S.xp), a = levelStart(lv), b = levelStart(lv + 1), pct = Math.round((S.xp - a) / (b - a) * 100);
    const acc = S.answered ? Math.round(S.correct / S.answered * 100) : 0;
    return `${header()}
      <section class="card"><h3>Level ${lv} – ${titleOf(lv)}</h3><div class="bar big"><i style="width:${pct}%"></i></div><small>${b - S.xp} XP bis Level ${lv + 1}</small></section>
      <div class="stats">
        <div><b>${S.streak && (S.lastDay === today() || S.lastDay === yesterday()) ? S.streak : 0}</b><small>Tage-Serie</small></div>
        <div><b>${S.bestStreak}</b><small>Rekord-Serie</small></div>
        <div><b>${S.quizzes}</b><small>Quizze</small></div>
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
      <section class="card"><h3>So funktioniert die Challenge</h3><ol class="how"><li>Wähle bei einem Thema <b>⚔️ Challenge</b> und spiele das Quiz.</li><li>Schicke deinen <b>Link</b> an einen Freund (WhatsApp, Mail …).</li><li>Dein Freund spielt <b>dieselben Fragen</b> und sieht dein Ergebnis. Wer mehr Punkte hat, gewinnt.</li></ol></section>
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

  function render() {
    const sc = view.screen;
    const body = { home: viewHome, subject: viewSubject, quiz: viewQuiz, result: viewResult, rewards: viewRewards, friends: viewFriends, challenge: viewChallenge }[sc]();
    const tab = tabOf(sc);
    const tabs = sc === 'quiz' ? '' : `<nav class="tabs" aria-label="Hauptnavigation">${[['home', '📚', 'Lernen'], ['rewards', '🏆', 'Belohnungen'], ['friends', '👥', 'Freunde']].map(([id, ic, lb]) => `<button class="${tab === id ? 'on' : ''}" data-act="tab" data-id="${id}" ${tab === id ? 'aria-current="page"' : ''}><span>${ic}</span>${lb}</button>`).join('')}</nav>`;
    $app.innerHTML = `<main class="wrap">${body}</main>${tabs}`;
  }

  /* ---------- Events ---------- */
  $app.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const d = el.dataset;
    switch (d.act) {
      case 'tab': go(d.id === 'home' ? 'home' : d.id); break;
      case 'home': sess = null; go('home'); break;
      case 'subject': go('subject', { subject: d.id, grade: null }); break;
      case 'grade': view.grade = +d.g; render(); break;
      case 'start': startQuiz(topicByKey(d.key)); break;
      case 'duel': { const t = topicByKey(d.key); startQuiz(t, { seed: Math.floor(Math.random() * 2 ** 31), count: Math.min(QUIZ_LEN, t.qs.length) }); break; }
      case 'review': startReview(); break;
      case 'answer': answer(+d.i); break;
      case 'next': next(); break;
      case 'quit': if (confirm('Quiz wirklich abbrechen? Dein Fortschritt in diesem Quiz geht verloren.')) { sess = null; go('home'); } break;
      case 'again': { const t = sess.topic; startQuiz(t); break; }
      case 'share': shareChallenge(); break;
      case 'accept': { const c = view.challenge; startQuiz(c.topic, { seed: c.seed, count: c.m, challenge: c }); break; }
    }
  });
  $app.addEventListener('submit', e => {
    const f = e.target.closest('[data-form]'); if (!f) return;
    e.preventDefault();
    if (f.dataset.form === 'name') { S.name = f.n.value.trim().slice(0, 20); save(); toast('Name gespeichert'); render(); }
    if (f.dataset.form === 'paste') {
      const c = parseCode(f.c.value);
      if (c) go('challenge', { challenge: c }); else toast('Dieser Link ist ungültig.');
    }
  });
  document.addEventListener('keydown', e => {
    if (view.screen !== 'quiz' || !sess || e.target.matches('input,textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
    const it = sess.items[sess.i];
    if (sess.picked == null && /^[1-4]$/.test(e.key) && it.opts[+e.key - 1]) answer(+e.key - 1);
    else if (sess.picked != null && e.key === 'Enter' && !e.target.closest('button')) next();
  });

  function fromHash() {
    const m = location.hash.match(/^#c=(.+)$/); if (!m) return;
    const c = dec(m[1]);
    history.replaceState(null, '', baseUrl());
    if (c) go('challenge', { challenge: c }); else toast('Dieser Challenge-Link ist ungültig.');
  }
  window.addEventListener('hashchange', fromHash);

  render();
  fromHash();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
