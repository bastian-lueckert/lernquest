/* Baukasten: erzeugt aus Paaren [Begriff, Antwort, (Beispiel)] viele Multiple-Choice-Fragen.
   Falsche Antworten werden deterministisch aus den anderen Paaren gewählt (wichtig für Challenge-Links).
   tpl = { q: 'Was bedeutet „{0}“?', e: '„{0}“ heißt „{1}“.', ex: 'Merke: {0} = {1}', qr: 'Wie heißt „{1}“?' (optional: Gegenrichtung) } */
LERN.pairs = function (subject, grade, id, name, tpl, pairs) {
  const n = pairs.length;
  const fill = (s, p) => String(s).replace(/\{0\}/g, p[0]).replace(/\{1\}/g, p[1]);
  const wrongs = (i, col) => {
    const right = pairs[i][col], out = [];
    for (let k = 1, j = i; out.length < 3 && k < n * 4; k++) {
      j = (j + 5 + (k % 3) * 4 + Math.floor(n / 7)) % n;
      const c = pairs[j][col];
      if (c !== right && !out.includes(c)) out.push(c);
    }
    return out;
  };
  const rows = [];
  pairs.forEach((p, i) => {
    const w = wrongs(i, 1);
    if (w.length === 3) rows.push([fill(tpl.q, p), p[1], w[0], w[1], w[2], fill(tpl.e, p), p[2] || fill(tpl.ex || tpl.e, p)]);
    if (tpl.qr) { const v = wrongs(i, 0); if (v.length === 3) rows.push([fill(tpl.qr, p), p[0], v[0], v[1], v[2], fill(tpl.e, p), p[2] || fill(tpl.ex || tpl.e, p)]); }
  });
  LERN.add(subject, grade, id, name, rows);
  LERN.topics[LERN.topics.length - 1].pairs = pairs.map(p => [p[0], p[1]]);
};
