/* Baukasten: erzeugt aus Paaren [Begriff, Antwort, (Beispiel)] viele Multiple-Choice-Fragen.
   Falsche Antworten werden deterministisch aus den anderen Paaren gewählt (wichtig für Challenge-Links).
   tpl = { q: 'Was bedeutet „{0}“?', e: '„{0}“ heißt „{1}“.', ex: '…' (optional), qr: 'Wie heißt „{1}“?' (optional: Gegenrichtung) } */
LERN.pairs = function (subject, grade, id, name, tpl, pairs) {
  const n = pairs.length;
  const fill = (s, p) => String(s).replace(/\{0\}/g, p[0]).replace(/\{1\}/g, p[1]);
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  // Schrittweite, die teilerfremd zu n ist: so werden garantiert alle anderen Paare besucht.
  const step = [7, 11, 13, 5, 3, 2, 1].find(s => s < n && gcd(s, n) === 1) || 1;
  const wrongs = (i, col) => {
    const right = pairs[i][col], other = pairs[i][1 - col], out = [];
    for (let k = 1; out.length < 3 && k < n; k++) {
      const p = pairs[(i + k * step) % n], c = p[col];
      // Nicht als falsche Antwort nehmen, was ebenfalls richtig wäre (gleicher Begriff oder gleiche Erklärung).
      if (c === right || p[1 - col] === other || out.includes(c)) continue;
      out.push(c);
    }
    return out;
  };
  const rows = [], grp = [];
  pairs.forEach((p, i) => {
    const w = wrongs(i, 1), ex = p[2] || (tpl.ex ? fill(tpl.ex, p) : '–');
    if (w.length === 3) { rows.push([fill(tpl.q, p), p[1], w[0], w[1], w[2], fill(tpl.e, p), ex]); grp.push(i); }
    if (tpl.qr) { const v = wrongs(i, 0); if (v.length === 3) { rows.push([fill(tpl.qr, p), p[0], v[0], v[1], v[2], fill(tpl.e, p), ex]); grp.push(i); } }
  });
  LERN.add(subject, grade, id, name, rows);
  const t = LERN.topics[LERN.topics.length - 1];
  t.pairs = pairs.map(p => [p[0], p[1]]);
  // grp: Hin- und Rückfrage desselben Paares gehören zusammen und sollen nicht im selben Quiz landen.
  t.qs.forEach((q, k) => { q.grp = grp[k]; });
};

/* Wiederverwendbare Vorlagen */
LERN.T = {
  term: { q: 'Was bedeutet der Begriff „{0}“?', qr: 'Welcher Begriff ist gemeint: „{1}“?', e: '{0}: {1}' },
  was: { q: 'Was ist {0}?', qr: 'Wie heißt: „{1}“?', e: '{0} = {1}' },
  de2en: { q: 'Wie heißt „{0}“ auf Englisch?', qr: 'Was bedeutet „{1}“ auf Deutsch?', e: '{0} heißt auf Englisch „{1}“.' },
  de2fr: { q: 'Wie heißt „{0}“ auf Französisch?', qr: 'Was bedeutet „{1}“ auf Deutsch?', e: '{0} heißt auf Französisch „{1}“.' },
  la2de: { q: 'Was bedeutet das lateinische Wort „{0}“?', qr: 'Wie heißt „{1}“ auf Latein?', e: '{0} = {1}' },
  hauptstadt: { q: 'Wie heißt die Hauptstadt des Landes „{0}“?', qr: 'Zu welchem Land gehört die Hauptstadt „{1}“?', e: '{1} ist die Hauptstadt von {0}.' },
  jahr: { q: 'Wann war das? {0}', e: '{0} – das war {1}.' },
  formel: { q: 'Wie lautet die Formel für {0}?', qr: 'Wofür steht die Formel {1}?', e: '{0}: {1}' },
  einheit: { q: 'In welcher Einheit misst man {0}?', qr: 'Welche Größe misst man in {1}?', e: '{0} misst man in {1}.' },
  symbol: { q: 'Welches Zeichen hat das Element {0}?', qr: 'Welches Element hat das Zeichen {1}?', e: '{0} hat das Zeichen {1}.' },
  rechne: { q: 'Berechne: {0}', e: '{0} = {1}' },
  umrechnen: { q: '{0} =', e: '{0} = {1}' },
  verb: { q: 'Wie lautet das Präteritum von „{0}“ (er/sie/es)?', e: '{0} – {1}' },
  partizip: { q: 'Wie lautet das Partizip II von „{0}“?', e: '{0} – {1}' }
};

/* Rechtschreib-Fragen: 'richtig>falsch1>falsch2>falsch3;…' – die erste Schreibweise ist die richtige. */
LERN.spell = function (subject, grade, id, name, str) {
  const rows = str.split(';').map(x => x.trim()).filter(Boolean).map(x => x.split('>').map(y => y.trim())).filter(r => r.length === 4 && new Set(r).size === 4)
    .map(r => ['Welche Schreibweise ist richtig?', r[0], r[1], r[2], r[3], 'Richtig geschrieben wird: „' + r[0] + '“.', 'Tipp: Schreibe schwierige Wörter mehrmals auf und präge dir die Stelle ein.']);
  LERN.add(subject, grade, id, name, rows);
};

/* Kurzschreibweise: LERN.P('Haus=house;Auto=car') → [['Haus','house'],['Auto','car']] */
LERN.P = (s, a = ';', b = '=') => s.split(a).map(x => x.trim()).filter(Boolean).map(x => { const i = x.indexOf(b); return i < 0 ? [x] : [x.slice(0, i).trim(), x.slice(i + b.length).trim()]; });
