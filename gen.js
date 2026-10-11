/* Zufällige Rechenaufgaben mit Rechenweg (Mathe, Physik, Chemie).
   make(r) liefert { q, ans, unit?, steps[], fig?, tol?, dec?, show? } – r ist eine Zufallsfunktion (0..1).
   tol  = erlaubte Abweichung (Standard: nur Rundungsfehler); dec = Nachkommastellen der Musterlösung;
   show = fertiger Text für die Musterlösung (z. B. ein Bruch). */
(() => {
  const G = LERN.gens = [];
  const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const f = x => String(Math.round(x * 10000) / 10000).replace('.', ',').replace('-', '−');
  const f2 = x => (Math.round(x * 100) / 100).toFixed(2).replace('.', ',').replace('-', '−');
  const sg = x => x < 0 ? '(' + f(x) + ')' : f(x);
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const add = (id, subject, grade, name, make, sach) => G.push({ id, subject, grade, name, make, sach: !!sach });
  const PI = Math.PI;
  // Ergebnisse, die mit π ≈ 3,14 statt der π-Taste gerechnet wurden, gelten ebenfalls als richtig
  const piTol = x => Math.abs(x) * 0.0006 + 0.011;
  const sup = n => String(n).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join('');
  // Term x² + px + q ohne „+ 0x“ und ohne „1x“
  const quad = (p, q) => 'x²' + (p === 0 ? '' : (p < 0 ? ' − ' : ' + ') + (Math.abs(p) === 1 ? '' : Math.abs(p)) + 'x') + (q === 0 ? '' : (q < 0 ? ' − ' : ' + ') + Math.abs(q));

  /* --- Figuren --- */
  const rectFig = (a, b) => `<svg viewBox="0 0 270 150" class="dia" role="img" aria-label="Rechteck ${a} mal ${b}"><rect x="70" y="20" width="170" height="100" class="shape"/><text x="155" y="140" text-anchor="middle">${a} cm</text><text x="62" y="75" text-anchor="end">${b} cm</text></svg>`;
  const triFig = (la, lb, lc, hide) => `<svg viewBox="0 0 290 160" class="dia" role="img" aria-label="Rechtwinkliges Dreieck"><polygon points="80,130 240,130 80,30" class="shape"/><path d="M80 118h12v12" class="dl" fill="none"/><text x="160" y="150" text-anchor="middle">${hide === 'b' ? 'b = ?' : 'b = ' + lb}</text><text x="72" y="85" text-anchor="end">${hide === 'a' ? 'a = ?' : 'a = ' + la}</text><text x="170" y="72">${hide === 'c' ? 'c = ?' : 'c = ' + lc}</text></svg>`;
  // mode 'sin': gesucht ist die Gegenkathete a (rechte Seite), 'cos': die Ankathete b (untere Seite)
  const trigFig = (c, al, mode) => `<svg viewBox="0 0 280 170" class="dia" role="img" aria-label="Rechtwinkliges Dreieck mit Winkel Alpha"><polygon points="30,130 210,130 210,40" class="shape"/><path d="M198 130v-12h12" class="dl" fill="none"/><text x="58" y="125">${al}°</text><text x="72" y="82" transform="rotate(-27 72 82)">c = ${c} cm</text><text x="218" y="90">${mode === 'sin' ? 'a = ?' : 'a'}</text><text x="120" y="150" text-anchor="middle">${mode === 'cos' ? 'b = ?' : 'b'}</text></svg>`;

  /* ================= MATHE ================= */
  add('m5-punkt', 'mathe', 5, 'Punkt vor Strich', r => {
    const a = ri(r, 2, 20), b = ri(r, 2, 9), c = ri(r, 2, 9), d = ri(r, 1, a + b * c - 1);
    const p = b * c, s = a + p;
    return { q: `Berechne: ${a} + ${b} · ${c} − ${d}`, ans: s - d, steps: [`Punktrechnung zuerst: ${b} · ${c} = ${p}`, `Dann von links: ${a} + ${p} = ${s}`, `${s} − ${d} = ${s - d}`] };
  });
  add('m5-flaeche', 'mathe', 5, 'Umfang & Fläche vom Rechteck', r => {
    const a = ri(r, 4, 15), b = ri(r, 2, a - 1), area = r() < 0.5;
    return area ? { q: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist der Flächeninhalt?`, fig: rectFig(a, b), ans: a * b, unit: 'cm²', steps: ['Fläche = Länge · Breite', `A = ${a} cm · ${b} cm = ${a * b} cm²`] }
      : { q: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie groß ist der Umfang?`, fig: rectFig(a, b), ans: 2 * (a + b), unit: 'cm', steps: ['Umfang = 2 · (Länge + Breite)', `u = 2 · (${a} cm + ${b} cm) = 2 · ${a + b} cm = ${2 * (a + b)} cm`] };
  });
  add('m5-geschickt', 'mathe', 5, 'Geschickt rechnen', r => {
    const a = ri(r, 3, 9), k = pick(r, [99, 98, 101, 102, 199]), base = k < 150 ? 100 : 200, d = k - base;
    return { q: `Rechne geschickt: ${a} · ${k}`, ans: a * k, steps: [`Zerlege ${k} = ${base} ${d < 0 ? '−' : '+'} ${Math.abs(d)}`, `${a} · ${base} ${d < 0 ? '−' : '+'} ${a} · ${Math.abs(d)} = ${a * base} ${d < 0 ? '−' : '+'} ${a * Math.abs(d)}`, `Ergebnis: ${a * k}`] };
  });
  add('m5-runden', 'mathe', 5, 'Runden', r => {
    const n = ri(r, 1000, 99999), place = pick(r, [10, 100, 1000]), res = Math.round(n / place) * place, nm = { 10: 'Zehner', 100: 'Hunderter', 1000: 'Tausender' }[place];
    return { q: `Runde ${n} auf ${nm}.`, ans: res, steps: [`Schau auf die Ziffer rechts von der ${nm}stelle: ${Math.floor((n % place) / (place / 10))}`, 'Bei 0–4 abrunden, bei 5–9 aufrunden.', `Ergebnis: ${res}`] };
  });

  add('m6-bruchadd', 'mathe', 6, 'Brüche addieren', r => {
    const b = pick(r, [2, 3, 4, 5, 6, 8]), d = pick(r, [2, 3, 4, 6, 8, 12]);
    // Zähler so wählen, dass die Brüche in der Aufgabe schon gekürzt sind (also nicht 3/6)
    const numer = den => { let x = ri(r, 1, den - 1); while (gcd(x, den) > 1) x = x > 1 ? x - 1 : 1; return x; };
    const a = numer(b), c = numer(d), lcm = b * d / gcd(b, d), n = a * (lcm / b) + c * (lcm / d), g = gcd(n, lcm);
    const whole = lcm / g === 1, short = whole ? String(n / g) : `${n / g}/${lcm / g}`, exact = Math.abs(n / lcm * 100 - Math.round(n / lcm * 100)) < 1e-9;
    return { q: `Berechne ${a}/${b} + ${c}/${d}. Gib das Ergebnis als Bruch (z. B. 3/4) oder als Dezimalzahl mit 2 Nachkommastellen an.`, ans: n / lcm, tol: 0.006, show: whole ? short : `${short} (${exact ? '=' : '≈'} ${f2(n / lcm)})`, steps: [`Hauptnenner: ${lcm}`, `${a}/${b} = ${a * lcm / b}/${lcm} und ${c}/${d} = ${c * lcm / d}/${lcm}`, `Zähler addieren: ${a * lcm / b} + ${c * lcm / d} = ${n} → ${n}/${lcm}`, g > 1 ? `Kürzen mit ${g}: ${short}` : `${n}/${lcm} lässt sich nicht weiter kürzen.`] };
  });
  add('m6-bruchvon', 'mathe', 6, 'Bruchteile berechnen', r => {
    const b = pick(r, [3, 4, 5, 6, 8, 10]), a = ri(r, 1, b - 1), N = b * ri(r, 2, 12);
    return { q: `Wie viel sind ${a}/${b} von ${N}?`, ans: N / b * a, steps: [`Durch den Nenner teilen: ${N} : ${b} = ${N / b}`, `Mit dem Zähler multiplizieren: ${N / b} · ${a} = ${N / b * a}`] };
  });
  add('m6-dezimal', 'mathe', 6, 'Dezimalzahlen multiplizieren', r => {
    let x = ri(r, 12, 99); if (x % 10 === 0) x += 3;   // immer genau eine Nachkommastelle
    const y = ri(r, 2, 9), A = x / 10, B = y / 10;
    return { q: `Berechne: ${f(A)} · ${f(B)}`, ans: x * y / 100, steps: [`Ohne Komma rechnen: ${x} · ${y} = ${x * y}`, 'Nachkommastellen zählen: 1 + 1 = 2', `Komma so setzen, dass 2 Nachkommastellen entstehen: ${f(x * y / 100)}`] };
  });
  add('m6-winkel', 'mathe', 6, 'Winkel im Dreieck', r => {
    const a = ri(r, 25, 80), b = ri(r, 25, 80);
    return { q: `Ein Dreieck hat die Winkel α = ${a}° und β = ${b}°. Wie groß ist γ?`, ans: 180 - a - b, unit: '°', steps: ['Winkelsumme im Dreieck: 180°', `γ = 180° − ${a}° − ${b}° = ${180 - a - b}°`] };
  });

  add('m7-prozentwert', 'mathe', 7, 'Prozentwert berechnen', r => {
    const G0 = pick(r, [20, 40, 50, 60, 80, 120, 150, 200, 250, 400, 500]), p = pick(r, [5, 10, 12, 15, 20, 25, 30, 40, 60, 75]);
    return { q: `Wie viel sind ${p} % von ${G0}?`, ans: G0 * p / 100, steps: [`${p} % = ${p}/100 = ${f(p / 100)}`, `Prozentwert = Grundwert · Prozentsatz = ${G0} · ${f(p / 100)} = ${f(G0 * p / 100)}`] };
  });
  add('m7-grundwert', 'mathe', 7, 'Grundwert berechnen', r => {
    const p = pick(r, [5, 10, 20, 25, 40, 50]), Gw = pick(r, [40, 80, 120, 200, 240, 400]), P = Gw * p / 100;
    return { q: `${p} % einer Menge sind ${f(P)}. Wie groß ist die ganze Menge (100 %)?`, ans: Gw, steps: ['Grundwert = Prozentwert : Prozentsatz', `G = ${f(P)} : ${f(p / 100)} = ${Gw}`] };
  });
  add('m7-prozentsatz', 'mathe', 7, 'Prozentsatz berechnen', r => {
    const Gw = pick(r, [20, 40, 50, 80, 200, 250, 400]), p = pick(r, [5, 10, 15, 20, 25, 30, 40, 60, 75]), P = Gw * p / 100;
    return { q: `Wie viel Prozent sind ${f(P)} von ${Gw}?`, ans: p, unit: '%', steps: ['Prozentsatz = Prozentwert : Grundwert', `p = ${f(P)} : ${Gw} = ${f(P / Gw)}`, `${f(P / Gw)} = ${p} %`] };
  });
  add('m7-rabatt', 'mathe', 7, 'Rabatt & Preise', r => {
    const pr = pick(r, [20, 40, 50, 60, 80, 120, 200]), p = pick(r, [10, 20, 25, 30, 40, 50]), rab = pr * p / 100;
    return { q: `Ein Pullover kostet ${pr} €. Er wird um ${p} % reduziert. Neuer Preis?`, ans: pr - rab, unit: '€', steps: [`${p} % von ${pr} € = ${f(rab)} €`, `${pr} € − ${f(rab)} € = ${f(pr - rab)} €`, `(Kurzweg: ${100 - p} % von ${pr} € = ${f(pr - rab)} €)`] };
  });
  add('m7-dreisatz', 'mathe', 7, 'Dreisatz (proportional)', r => {
    const n1 = ri(r, 2, 8), unit = pick(r, [1.5, 2, 2.5, 3, 4]), K = n1 * unit;
    let n2 = ri(r, 3, 12); if (n2 === n1) n2++;
    return { q: `${n1} Hefte kosten ${f(K)} €. Wie viel kosten ${n2} Hefte?`, ans: n2 * unit, unit: '€', steps: [`Auf 1 Heft umrechnen: ${f(K)} € : ${n1} = ${f(unit)} €`, `Auf ${n2} Hefte hochrechnen: ${f(unit)} € · ${n2} = ${f(n2 * unit)} €`] };
  });
  add('m7-antiprop', 'mathe', 7, 'Dreisatz (antiproportional)', r => {
    const n1 = pick(r, [2, 3, 4, 6]), t1 = pick(r, [6, 8, 12, 18]), n2 = pick(r, [2, 3, 4, 6, 9, 12]), tot = n1 * t1;
    if (tot % n2 || n2 === n1) return G.find(x => x.id === 'm7-antiprop').make(r);
    return { q: `${n1} Maler brauchen ${t1} Tage für ein Haus. Wie viele Tage brauchen ${n2} Maler?`, ans: tot / n2, unit: 'Tage', steps: [`Gesamtarbeit: ${n1} · ${t1} = ${tot} Maler-Tage`, `Durch die neue Anzahl teilen: ${tot} : ${n2} = ${tot / n2} Tage`] };
  });
  add('m7-gleichung', 'mathe', 7, 'Gleichungen lösen', r => {
    const a = ri(r, 2, 9), b = ri(r, -12, 15) || 4, x = ri(r, -6, 12), c = a * x + b;
    return { q: `Löse: ${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${f(c)}`, ans: x, steps: [`${b < 0 ? '+' : '−'} ${Math.abs(b)} auf beiden Seiten: ${a}x = ${f(c - b)}`, `Durch ${a} teilen: x = ${sg(c - b)} : ${a} = ${f(x)}`, `Probe: ${a} · ${sg(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${f(c)} ✓`] };
  });
  add('m7-rational', 'mathe', 7, 'Rechnen mit negativen Zahlen', r => {
    const op = pick(r, ['+', '−', '·', ':']);
    let a = ri(r, -12, 12) || 5, b = ri(r, -9, 9) || -3;
    if (op === ':') { b = pick(r, [-6, -4, -3, -2, 2, 3, 4, 6]); a = b * (ri(r, -8, 8) || 3); }
    if (a > 0 && b > 0) a = -a;   // mindestens eine negative Zahl, sonst wäre die Aufgabe witzlos
    const res = op === '+' ? a + b : op === '−' ? a - b : op === '·' ? a * b : a / b;
    const hint = op === '+' ? 'Gleiche Vorzeichen: Beträge addieren, Vorzeichen behalten. Verschiedene Vorzeichen: Beträge subtrahieren, Vorzeichen der Zahl mit dem größeren Betrag.' : op === '−' ? `Subtrahieren heißt, die Gegenzahl addieren: ${sg(a)} + ${sg(-b)}` : 'Gleiche Vorzeichen → Ergebnis positiv, verschiedene Vorzeichen → Ergebnis negativ.';
    return { q: `Berechne: ${sg(a)} ${op} ${sg(b)}`, ans: res, steps: [hint, `${sg(a)} ${op} ${sg(b)} = ${f(res)}`] };
  });

  add('m8-steigung', 'mathe', 8, 'Steigung berechnen', r => {
    const m = pick(r, [-4, -3, -2, -1, 1, 2, 3, 4]), dx = ri(r, 1, 4), x1 = ri(r, -3, 3), y1 = ri(r, -4, 4), x2 = x1 + dx, y2 = y1 + m * dx;
    return { q: `Eine Gerade geht durch A(${f(x1)} | ${f(y1)}) und B(${f(x2)} | ${f(y2)}). Wie groß ist die Steigung m?`, ans: m, steps: ['m = (y₂ − y₁) : (x₂ − x₁)', `m = (${f(y2)} − ${sg(y1)}) : (${f(x2)} − ${sg(x1)}) = ${sg(y2 - y1)} : ${dx} = ${f(m)}`] };
  });
  add('m8-nullstelle', 'mathe', 8, 'Nullstelle linearer Funktionen', r => {
    const m = pick(r, [-5, -3, -2, 2, 3, 4, 5]), x0 = ri(r, -6, 8) || 3, b = -m * x0;
    return { q: `Berechne die Nullstelle von y = ${f(m)}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}.`, ans: x0, steps: ['Nullstelle: y = 0 setzen', `${f(m)}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = 0 → ${f(m)}x = ${f(-b)}`, `x = ${sg(-b)} : ${sg(m)} = ${f(x0)}`] };
  });
  add('m8-funktionswert', 'mathe', 8, 'Funktionswert berechnen', r => {
    const m = pick(r, [-3, -2, 2, 3, 4]), b = ri(r, -6, 8) || 2, x = ri(r, -4, 6);
    return { q: `Gegeben ist y = ${f(m)}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}. Berechne y für x = ${f(x)}.`, ans: m * x + b, steps: [`x einsetzen: y = ${sg(m)} · ${sg(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}`, `y = ${f(m * x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${f(m * x + b)}`] };
  });
  add('m8-binom', 'mathe', 8, 'Binomische Formeln im Kopf', r => {
    const t = ri(r, 2, 9) * 10, d = pick(r, [1, 2, 3]), plus = r() < 0.5, n = plus ? t + d : t - d;
    return { q: `Berechne mit einer binomischen Formel im Kopf: ${n}²`, ans: n * n, steps: [`${n} = ${t} ${plus ? '+' : '−'} ${d}`, `(${t} ${plus ? '+' : '−'} ${d})² = ${t}² ${plus ? '+' : '−'} 2 · ${t} · ${d} + ${d}²`, `= ${t * t} ${plus ? '+' : '−'} ${2 * t * d} + ${d * d} = ${n * n}`] };
  });
  add('m8-gls', 'mathe', 8, 'Gleichungssystem (Additionsverfahren)', r => {
    const x = ri(r, 1, 9), y = ri(r, 1, 8), s = x + y, dd = x - y;
    return { q: `Löse das System und gib x an:  x + y = ${s}  und  x − y = ${f(dd)}`, ans: x, steps: [`Beide Gleichungen addieren: 2x = ${s} + ${sg(dd)} = ${s + dd}`, `x = ${s + dd} : 2 = ${x}`, `y = ${s} − ${x} = ${y}`] };
  });
  add('m8-kreis', 'mathe', 9, 'Kreis: Umfang & Fläche', r => {
    const rad = ri(r, 2, 12), area = r() < 0.5;
    return area ? { q: `Ein Kreis hat den Radius ${rad} cm. Berechne die Fläche (auf 2 Nachkommastellen runden).`, ans: PI * rad * rad, dec: 2, tol: piTol(PI * rad * rad), unit: 'cm²', steps: ['A = π · r²', `A = π · ${rad}² = π · ${rad * rad}`, `A ≈ ${f2(PI * rad * rad)} cm² (mit der π-Taste; mit π ≈ 3,14 sind es ${f2(3.14 * rad * rad)} cm²)`] }
      : { q: `Ein Kreis hat den Radius ${rad} cm. Berechne den Umfang (auf 2 Nachkommastellen runden).`, ans: 2 * PI * rad, dec: 2, tol: piTol(2 * PI * rad), unit: 'cm', steps: ['u = 2 · π · r', `u = 2 · π · ${rad}`, `u ≈ ${f2(2 * PI * rad)} cm (mit der π-Taste; mit π ≈ 3,14 sind es ${f2(2 * 3.14 * rad)} cm)`] };
  });

  add('m9-pyth-c', 'mathe', 9, 'Pythagoras: Hypotenuse', r => {
    const a = ri(r, 3, 15), b = ri(r, 3, 15), c = Math.sqrt(a * a + b * b);
    return { q: `Ein rechtwinkliges Dreieck hat die Katheten a = ${a} cm und b = ${b} cm. Berechne die Hypotenuse c (auf 2 Nachkommastellen runden).`, fig: triFig(a, b, '?', 'c'), ans: c, dec: 2, tol: 0.011, unit: 'cm', steps: ['c² = a² + b²', `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`, `c = √${a * a + b * b} ≈ ${f2(c)} cm`] };
  });
  add('m9-pyth-a', 'mathe', 9, 'Pythagoras: Kathete', r => {
    const [a, b, c] = pick(r, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25], [20, 21, 29], [12, 16, 20]]);
    const [k, o] = r() < 0.5 ? [a, b] : [b, a];
    return { q: `Die Hypotenuse eines rechtwinkligen Dreiecks ist c = ${c} cm lang, eine Kathete a = ${k} cm. Berechne die andere Kathete b.`, fig: triFig(k, '?', c, 'b'), ans: o, unit: 'cm', steps: ['b² = c² − a²', `b² = ${c}² − ${k}² = ${c * c} − ${k * k} = ${o * o}`, `b = √${o * o} = ${o} cm`] };
  });
  add('m9-pq', 'mathe', 9, 'Quadratische Gleichungen (pq-Formel)', r => {
    let x1 = ri(r, -8, 8), x2 = ri(r, -8, 8); if (x1 === x2) x2 = x1 + 3;
    const p = -(x1 + x2), q = x1 * x2, big = Math.max(x1, x2), small = Math.min(x1, x2);
    const D = (p / 2) * (p / 2) - q;
    return { q: `Löse ${quad(p, q)} = 0. Gib die größere der beiden Lösungen an.`, ans: big, steps: [`pq-Formel: x = −p/2 ± √((p/2)² − q) mit p = ${f(p)} und q = ${f(q)}`, `x = ${f(-p / 2)} ± √(${f(p / 2 * p / 2)} − ${sg(q)}) = ${f(-p / 2)} ± √${f(D)} = ${f(-p / 2)} ± ${f(Math.sqrt(D))}`, `x₁ = ${f(big)}, x₂ = ${f(small)} → größere Lösung: ${f(big)}`] };
  });

  add('m10-sinus', 'mathe', 10, 'Trigonometrie: Seite berechnen', r => {
    const c = ri(r, 5, 20), al = pick(r, [20, 25, 30, 35, 40, 50, 55, 60, 65]), mode = pick(r, ['sin', 'cos']);
    const rad = al * PI / 180, v = mode === 'sin' ? Math.sin(rad) : Math.cos(rad);
    return { q: `In einem rechtwinkligen Dreieck ist die Hypotenuse c = ${c} cm und der Winkel α = ${al}°. Berechne die ${mode === 'sin' ? 'Gegenkathete a' : 'Ankathete b'} (auf 2 Nachkommastellen runden).`, fig: trigFig(c, al, mode), ans: c * v, dec: 2, tol: 0.02, unit: 'cm', steps: [mode === 'sin' ? 'sin α = Gegenkathete : Hypotenuse → a = c · sin α' : 'cos α = Ankathete : Hypotenuse → b = c · cos α', `${mode === 'sin' ? 'a' : 'b'} = ${c} · ${mode} ${al}° ≈ ${c} · ${f(Math.round(v * 10000) / 10000)}`, `≈ ${f2(c * v)} cm`] };
  });
  add('m10-tanwinkel', 'mathe', 10, 'Trigonometrie: Winkel berechnen', r => {
    const a = ri(r, 2, 12), b = ri(r, 2, 12), al = Math.atan(a / b) * 180 / PI;
    return { q: `In einem rechtwinkligen Dreieck ist die Gegenkathete a = ${a} cm und die Ankathete b = ${b} cm. Berechne α in Grad (auf 1 Nachkommastelle runden).`, ans: al, dec: 1, tol: 0.15, unit: '°', steps: ['tan α = Gegenkathete : Ankathete', `tan α = ${a} : ${b} ≈ ${f(Math.round(a / b * 10000) / 10000)}`, `α = tan⁻¹(${f(Math.round(a / b * 10000) / 10000)}) ≈ ${f(Math.round(al * 10) / 10)}°`] };
  });
  add('m10-zins', 'mathe', 10, 'Zinseszins', r => {
    const K = ri(r, 2, 16) * 500, p = pick(r, [2, 3, 4, 5]), n = ri(r, 2, 5), Kn = K * Math.pow(1 + p / 100, n);
    return { q: `${K} € werden ${n} Jahre lang mit ${p} % pro Jahr verzinst (mit Zinseszins). Wie hoch ist das Guthaben am Ende (auf Cent runden)?`, ans: Kn, dec: 2, tol: Kn * 0.00005 + 0.011, unit: '€', steps: [`Wachstumsfaktor: q = 1 + ${p}/100 = ${f(1 + p / 100)}`, `Kₙ = K₀ · qⁿ = ${K} · ${f(1 + p / 100)}${sup(n)}`, `Kₙ ≈ ${f2(Kn)} €`] };
  });
  add('m10-zylinder', 'mathe', 10, 'Körper: Zylinder, Kegel, Kugel', r => {
    const rad = ri(r, 2, 10), h = ri(r, 3, 15), k = pick(r, ['Zylinder', 'Kegel', 'Kugel']);
    if (k === 'Kugel') { const V = 4 / 3 * PI * rad ** 3; return { q: `Berechne das Volumen einer Kugel mit Radius ${rad} cm (auf 2 Nachkommastellen runden).`, ans: V, dec: 2, tol: piTol(V), unit: 'cm³', steps: ['V = 4/3 · π · r³', `V = 4/3 · π · ${rad}³ = 4/3 · π · ${rad ** 3}`, `V ≈ ${f2(V)} cm³ (mit der π-Taste gerechnet)`] }; }
    const fac = k === 'Kegel' ? 1 / 3 : 1, V = fac * PI * rad * rad * h;
    return { q: `Berechne das Volumen eines ${k}s mit Radius ${rad} cm und Höhe ${h} cm (auf 2 Nachkommastellen runden).`, ans: V, dec: 2, tol: piTol(V), unit: 'cm³', steps: [k === 'Kegel' ? 'V = 1/3 · π · r² · h' : 'V = π · r² · h', `V = ${k === 'Kegel' ? '1/3 · ' : ''}π · ${rad}² · ${h} = ${k === 'Kegel' ? '1/3 · ' : ''}π · ${rad * rad * h}`, `V ≈ ${f2(V)} cm³ (mit der π-Taste gerechnet)`] };
  });
  add('m10-wachstum', 'mathe', 10, 'Exponentielles Wachstum', r => {
    const N0 = pick(r, [100, 200, 500, 800]), pc = pick(r, [10, 20, 50, 100]), n = ri(r, 2, 4), q = 1 + pc / 100, N = N0 * Math.pow(q, n);
    return { q: `Eine Bakterienkultur hat ${N0} Bakterien und wächst pro Stunde um ${pc} %. Wie viele sind es nach ${n} Stunden? (Runde auf ganze Bakterien.)`, ans: Math.round(N), tol: 0.6, steps: [`Wachstumsfaktor q = 1 + ${pc}/100 = ${f(q)}`, `N = N₀ · qⁿ = ${N0} · ${f(q)}${sup(n)} = ${f(N)}`].concat(Math.abs(N - Math.round(N)) > 1e-6 ? [`Gerundet: ${Math.round(N)} Bakterien`] : []) };
  });

  /* ================= PHYSIK ================= */
  add('p7-geschw', 'physik', 7, 'Geschwindigkeit, Weg & Zeit', r => {
    const v = ri(r, 2, 25), t = ri(r, 2, 20), m = pick(r, ['v', 's', 't']);
    if (m === 'v') return { q: `Ein Läufer legt ${v * t} m in ${t} s zurück. Wie groß ist seine Geschwindigkeit?`, ans: v, unit: 'm/s', steps: ['v = s : t', `v = ${v * t} m : ${t} s = ${v} m/s`] };
    if (m === 's') return { q: `Ein Fahrrad fährt mit ${v} m/s. Welche Strecke legt es in ${t} s zurück?`, ans: v * t, unit: 'm', steps: ['s = v · t', `s = ${v} m/s · ${t} s = ${v * t} m`] };
    return { q: `Ein Auto fährt ${v * t} m mit konstant ${v} m/s. Wie lange dauert das?`, ans: t, unit: 's', steps: ['t = s : v', `t = ${v * t} m : ${v} m/s = ${t} s`] };
  });
  add('p7-kmh', 'physik', 7, 'km/h in m/s umrechnen', r => {
    const k = pick(r, [5, 10, 15, 20, 25, 30]), kmh = k * 3.6;
    return { q: `Ein Zug fährt ${f(kmh)} km/h. Wie viele m/s sind das?`, ans: k, unit: 'm/s', steps: ['1 m/s = 3,6 km/h → durch 3,6 teilen', `${f(kmh)} : 3,6 = ${k} m/s`] };
  });
  add('p7-gewicht', 'physik', 7, 'Gewichtskraft', r => {
    const m = ri(r, 2, 80);
    return { q: `Wie groß ist die Gewichtskraft einer Masse von ${m} kg? (Rechne mit g = 10 N/kg)`, ans: m * 10, unit: 'N', steps: ['F = m · g', `F = ${m} kg · 10 N/kg = ${m * 10} N`] };
  });
  add('p8-ohm', 'physik', 8, 'Ohmsches Gesetz', r => {
    const R = pick(r, [2, 4, 5, 10, 20, 50, 100]), I = pick(r, [0.1, 0.2, 0.5, 1, 2, 3]), U = R * I, m = pick(r, ['I', 'R', 'U']);
    if (m === 'U') return { q: `Durch einen Widerstand von ${R} Ω fließt ein Strom von ${f(I)} A. Welche Spannung liegt an?`, ans: U, unit: 'V', steps: ['U = R · I', `U = ${R} Ω · ${f(I)} A = ${f(U)} V`] };
    if (m === 'I') return { q: `An einem Widerstand von ${R} Ω liegen ${f(U)} V. Wie groß ist die Stromstärke?`, ans: I, unit: 'A', steps: ['I = U : R', `I = ${f(U)} V : ${R} Ω = ${f(I)} A`] };
    return { q: `An einem Bauteil liegen ${f(U)} V und es fließen ${f(I)} A. Wie groß ist der Widerstand?`, ans: R, unit: 'Ω', steps: ['R = U : I', `R = ${f(U)} V : ${f(I)} A = ${R} Ω`] };
  });
  add('p8-reihe-parallel', 'physik', 8, 'Reihen- & Parallelschaltung', r => {
    const par = r() < 0.5, pairs = [[6, 3, 2], [12, 4, 3], [10, 10, 5], [20, 5, 4], [30, 6, 5], [4, 4, 2], [12, 6, 4], [15, 10, 6], [20, 20, 10]];
    if (!par) { const a = ri(r, 2, 40), b = ri(r, 2, 40); return { q: `Zwei Widerstände (${a} Ω und ${b} Ω) sind in Reihe geschaltet. Wie groß ist der Gesamtwiderstand?`, ans: a + b, unit: 'Ω', steps: ['In Reihe addieren sich die Widerstände: R = R₁ + R₂', `R = ${a} Ω + ${b} Ω = ${a + b} Ω`] }; }
    const [a, b, res] = pick(r, pairs);
    return { q: `Zwei Widerstände (${a} Ω und ${b} Ω) sind parallel geschaltet. Wie groß ist der Gesamtwiderstand?`, ans: res, unit: 'Ω', steps: ['Parallel: 1/R = 1/R₁ + 1/R₂', `1/R = 1/${a} + 1/${b} = ${(a + b) / gcd(a + b, a * b)}/${a * b / gcd(a + b, a * b)}`, `Kehrwert bilden: R = ${res} Ω`] };
  });
  add('p8-leistung-el', 'physik', 8, 'Elektrische Leistung & Energie', r => {
    const U = pick(r, [230, 12, 9, 5]), I = pick(r, [0.5, 1, 2, 4]), P = U * I, h = ri(r, 2, 10);
    return r() < 0.5 ? { q: `Ein Gerät liegt an ${U} V und zieht ${f(I)} A. Welche Leistung hat es?`, ans: P, unit: 'W', steps: ['P = U · I', `P = ${U} V · ${f(I)} A = ${f(P)} W`] }
      : { q: `Eine Lampe mit ${f(P)} W leuchtet ${h} Stunden. Wie viel Energie verbraucht sie in Wattstunden?`, ans: P * h, unit: 'Wh', steps: ['E = P · t', `E = ${f(P)} W · ${h} h = ${f(P * h)} Wh`] };
  });
  add('p8-waerme', 'physik', 8, 'Wärmemenge (Wasser erwärmen)', r => {
    const m = pick(r, [0.5, 1, 2, 3]), dT = pick(r, [10, 20, 30, 40, 50, 60, 80]), Q = 4.19 * m * dT;
    return { q: `Wie viel Wärme (in kJ) braucht man, um ${f(m)} kg Wasser um ${dT} K zu erwärmen? (c = 4,19 kJ/(kg·K), auf 2 Nachkommastellen runden)`, ans: Q, dec: 2, tol: 0.011, unit: 'kJ', steps: ['Q = c · m · ΔT', `Q = 4,19 · ${f(m)} · ${dT}`, `Q = ${f2(Q)} kJ`] };
  });
  add('p8-hebel', 'physik', 8, 'Hebelgesetz', r => {
    const F1 = ri(r, 2, 20) * 10, l1 = ri(r, 2, 6) * 10, F2 = pick(r, [10, 20, 40, 50]), tot = F1 * l1;
    if (tot % F2 || F2 === F1) return G.find(x => x.id === 'p8-hebel').make(r);
    return { q: `Ein Hebel ist im Gleichgewicht: Links wirkt F₁ = ${F1} N im Abstand l₁ = ${l1} cm. Rechts wirkt F₂ = ${F2} N. Wie groß ist l₂?`, ans: tot / F2, unit: 'cm', steps: ['Hebelgesetz: F₁ · l₁ = F₂ · l₂', `${F1} · ${l1} = ${F2} · l₂ → l₂ = ${tot} : ${F2}`, `l₂ = ${tot / F2} cm`] };
  });
  add('p9-arbeit', 'physik', 9, 'Arbeit & Leistung', r => {
    const F = ri(r, 2, 40) * 5, s = ri(r, 2, 12), t = pick(r, [2, 4, 5, 10]), W = F * s, m = pick(r, ['W', 'P']);
    return m === 'W' ? { q: `Mit einer Kraft von ${F} N wird ein Körper ${s} m weit verschoben. Wie groß ist die verrichtete Arbeit?`, ans: W, unit: 'J', steps: ['W = F · s', `W = ${F} N · ${s} m = ${W} J`] }
      : { q: `Eine Maschine verrichtet ${W * t} J Arbeit in ${t} s. Welche Leistung hat sie?`, ans: W, unit: 'W', steps: ['P = W : t', `P = ${W * t} J : ${t} s = ${W} W`] };
  });
  add('p9-energie', 'physik', 9, 'Kinetische & potenzielle Energie', r => {
    const m = ri(r, 2, 20), v = ri(r, 2, 15), h = ri(r, 2, 30);
    return r() < 0.5 ? { q: `Ein Körper mit ${m} kg bewegt sich mit ${v} m/s. Wie groß ist seine kinetische Energie?`, ans: 0.5 * m * v * v, unit: 'J', steps: ['E_kin = ½ · m · v²', `E_kin = 0,5 · ${m} · ${v}² = 0,5 · ${m} · ${v * v}`, `E_kin = ${f(0.5 * m * v * v)} J`] }
      : { q: `Ein Körper mit ${m} kg wird ${h} m hochgehoben. Wie groß ist seine Lageenergie? (g = 10 N/kg)`, ans: m * 10 * h, unit: 'J', steps: ['E_pot = m · g · h', `E_pot = ${m} · 10 · ${h} = ${m * 10 * h} J`] };
  });
  add('p9-druck', 'physik', 9, 'Druck', r => {
    const F = ri(r, 2, 40) * 50, A = pick(r, [0.1, 0.2, 0.25, 0.5, 2]), p = F / A;
    return { q: `Eine Kraft von ${F} N wirkt senkrecht auf eine Fläche von ${f(A)} m². Wie groß ist der Druck?`, ans: p, unit: 'Pa', steps: ['p = F : A', `p = ${F} N : ${f(A)} m² = ${f(p)} Pa`] };
  });
  add('p9-wirkungsgrad', 'physik', 9, 'Wirkungsgrad', r => {
    const zu = pick(r, [100, 200, 400, 500, 1000]), eta = pick(r, [20, 25, 40, 50, 60, 80]), nutz = zu * eta / 100;
    return { q: `Einer Maschine werden ${zu} J zugeführt, sie liefert ${f(nutz)} J nutzbare Energie. Wie groß ist der Wirkungsgrad in Prozent?`, ans: eta, unit: '%', steps: ['η = Nutzenergie : zugeführte Energie', `η = ${f(nutz)} : ${zu} = ${f(nutz / zu)} = ${eta} %`] };
  });
  add('p10-halbwert', 'physik', 10, 'Radioaktiver Zerfall', r => {
    const N0 = pick(r, [800, 1600, 2000, 4800]), n = ri(r, 1, 4), T = pick(r, [2, 5, 8, 12]);
    return { q: `Ein Präparat enthält anfangs ${N0} radioaktive Kerne. Die Halbwertszeit beträgt ${T} Tage. Wie viele Kerne sind nach ${n * T} Tagen noch übrig?`, ans: N0 / Math.pow(2, n), steps: [`${n * T} Tage : ${T} Tage = ${n} Halbwertszeit${n > 1 ? 'en' : ''}`, `Nach jeder Halbwertszeit halbiert sich die Zahl: ${N0} · (1/2)${sup(n)}`, `${N0} : ${Math.pow(2, n)} = ${f(N0 / Math.pow(2, n))}`] };
  });

  /* ================= CHEMIE ================= */
  add('c7-dichte', 'chemie', 7, 'Dichte, Masse & Volumen', r => {
    const rho = pick(r, [0.8, 2.7, 5, 7.9, 8.9, 11.3]), V = pick(r, [10, 20, 25, 50, 100]), m = rho * V, md = pick(r, ['rho', 'm']);
    return md === 'rho' ? { q: `Ein Körper hat die Masse ${f(m)} g und das Volumen ${V} cm³. Wie groß ist die Dichte?`, ans: rho, unit: 'g/cm³', steps: ['ρ = m : V', `ρ = ${f(m)} g : ${V} cm³ = ${f(rho)} g/cm³`] }
      : { q: `Ein Stoff hat die Dichte ${f(rho)} g/cm³. Welche Masse hat ein Stück mit ${V} cm³?`, ans: m, unit: 'g', steps: ['m = ρ · V', `m = ${f(rho)} g/cm³ · ${V} cm³ = ${f(m)} g`] };
  });
  add('c8-massenanteil', 'chemie', 8, 'Massenanteil einer Lösung', r => {
    const ms = pick(r, [5, 10, 20, 25, 40]), w = pick(r, [20, 40, 50, 80, 90, 100, 150, 200]), tot = ms + w;
    return { q: `${ms} g Salz werden in ${w} g Wasser gelöst. Wie groß ist der Massenanteil des Salzes in der Lösung (in %, auf 1 Nachkommastelle runden)?`, ans: ms / tot * 100, dec: 1, tol: 0.06, unit: '%', steps: ['w = m(Stoff) : m(Lösung) · 100 %', `m(Lösung) = ${ms} g + ${w} g = ${tot} g`, `w = ${ms} : ${tot} · 100 % ≈ ${f(Math.round(ms / tot * 1000) / 10)} %`] };
  });
  const M = [['H₂O', 18, 'H₂O: 2 · 1 + 16'], ['CO₂', 44, 'CO₂: 12 + 2 · 16'], ['NH₃', 17, 'NH₃: 14 + 3 · 1'], ['NaOH', 40, 'NaOH: 23 + 16 + 1'], ['CaCO₃', 100, 'CaCO₃: 40 + 12 + 3 · 16'], ['H₂SO₄', 98, 'H₂SO₄: 2 · 1 + 32 + 4 · 16'], ['CH₄', 16, 'CH₄: 12 + 4 · 1'], ['HCl', 36.5, 'HCl: 1 + 35,5']];
  add('c9-molmasse', 'chemie', 9, 'Molare Masse berechnen', r => {
    const [fo, m, calc] = pick(r, M);
    return { q: `Berechne die molare Masse von ${fo}. (Atommassen: H = 1, C = 12, N = 14, O = 16, Na = 23, S = 32, Cl = 35,5, Ca = 40)`, ans: m, unit: 'g/mol', steps: ['Atommassen der Atome addieren (mit Anzahl multiplizieren)', calc, `M(${fo}) = ${f(m)} g/mol`] };
  });
  add('c9-stoffmenge', 'chemie', 9, 'Stoffmenge & Masse (n = m : M)', r => {
    const [fo, m] = pick(r, M.slice(0, 7)), n = pick(r, [0.25, 0.5, 1, 2, 3, 4]), mass = n * m;
    return r() < 0.5 ? { q: `Wie viel mol sind ${f(mass)} g ${fo}? (M = ${f(m)} g/mol)`, ans: n, unit: 'mol', steps: ['n = m : M', `n = ${f(mass)} g : ${f(m)} g/mol = ${f(n)} mol`] }
      : { q: `Welche Masse haben ${f(n)} mol ${fo}? (M = ${f(m)} g/mol)`, ans: mass, unit: 'g', steps: ['m = n · M', `m = ${f(n)} mol · ${f(m)} g/mol = ${f(mass)} g`] };
  });
  add('c10-konzentration', 'chemie', 10, 'Stoffmengenkonzentration', r => {
    const n = pick(r, [0.1, 0.2, 0.5, 1, 2, 3]), V = pick(r, [0.1, 0.2, 0.25, 0.5, 1, 2]), c = n / V;
    return { q: `In ${f(V)} L Lösung sind ${f(n)} mol eines Stoffes gelöst. Wie groß ist die Konzentration?`, ans: c, unit: 'mol/L', steps: ['c = n : V', `c = ${f(n)} mol : ${f(V)} L = ${f(c)} mol/L`] };
  });
  add('c10-ph', 'chemie', 10, 'pH-Wert starker Säuren', r => {
    const k = ri(r, 1, 5);
    return { q: `Berechne den pH-Wert einer starken einprotonigen Säure mit c = 10⁻${sup(k)} mol/L.`, ans: k, steps: ['pH = −lg c(H₃O⁺)', `c(H₃O⁺) = 10⁻${sup(k)} mol/L`, `pH = −lg 10⁻${sup(k)} = ${k}`] };
  });
  /* ================= SACHAUFGABEN (Textaufgaben aus dem Alltag) ================= */
  const S = (id, subject, grade, name, make) => add(id, subject, grade, 'Sachaufgabe: ' + name, make, true);
  S('m5-einkauf', 'mathe', 5, 'Einkaufen & Rückgeld', r => {
    const n = ri(r, 2, 5), p = pick(r, [80, 90, 120, 150]), fu = pick(r, [450, 520, 650, 790]), tot = n * p + fu, back = 2000 - tot, kid = pick(r, ['Mia', 'Ben', 'Lea', 'Yusuf']);
    return { q: `${kid} kauft ${n} Hefte zu je ${f2(p / 100)} € und einen Füller für ${f2(fu / 100)} €. Bezahlt wird mit einem 20-€-Schein. Wie viel Geld gibt es zurück?`, ans: back / 100, unit: '€', show: f2(back / 100), steps: [`Hefte: ${n} · ${f2(p / 100)} € = ${f2(n * p / 100)} €`, `Zusammen: ${f2(n * p / 100)} € + ${f2(fu / 100)} € = ${f2(tot / 100)} €`, `Rückgeld: 20,00 € − ${f2(tot / 100)} € = ${f2(back / 100)} €`] };
  });
  S('m5-fahrzeit', 'mathe', 5, 'Fahrzeiten', r => {
    const h1 = ri(r, 7, 17), m1 = ri(r, 1, 11) * 5, dur = ri(r, 7, 35) * 5, end = h1 * 60 + m1 + dur, h2 = Math.floor(end / 60), m2 = end % 60, z = x => String(x).padStart(2, '0');
    const toFull = 60 - m1, rest = dur - toFull;
    return { q: `Ein Zug fährt um ${h1}:${z(m1)} Uhr ab und kommt um ${h2}:${z(m2)} Uhr an. Wie viele Minuten dauert die Fahrt?`, ans: dur, unit: 'min', steps: rest >= 0 ? [`Bis zur vollen Stunde (${h1 + 1}:00 Uhr): ${toFull} min`, `Von ${h1 + 1}:00 Uhr bis ${h2}:${z(m2)} Uhr: ${rest} min`, `Zusammen: ${toFull} min + ${rest} min = ${dur} min`] : ['Beide Zeiten liegen in derselben Stunde.', `${m2} min − ${m1} min = ${dur} min`] };
  });
  S('m6-anteil', 'mathe', 6, 'Anteile im Alltag', r => {
    const b = pick(r, [3, 4, 5, 6]), a = ri(r, 1, b - 1), N = b * ri(r, 3, 6), part = N / b * a, what = pick(r, [['kommen mit dem Fahrrad zur Schule', 'kommen nicht mit dem Fahrrad'], ['spielen ein Instrument', 'spielen kein Instrument'], ['haben ein Haustier', 'haben kein Haustier']]);
    return { q: `In einer Klasse sind ${N} Kinder. ${a}/${b} davon ${what[0]}. Wie viele Kinder ${what[1]}?`, ans: N - part, unit: 'Kinder', steps: [`${a}/${b} von ${N}: ${N} : ${b} · ${a} = ${part} Kinder`, `Der Rest: ${N} − ${part} = ${N - part} Kinder`, `(Oder direkt: ${b - a}/${b} von ${N} = ${N - part})`] };
  });
  S('m6-durchschnitt', 'mathe', 6, 'Durchschnitt berechnen', r => {
    const v = Array.from({ length: 5 }, () => ri(r, 0, 6)), sum = v.reduce((x, y) => x + y, 0);
    return { q: `Ein Fußballer hat in fünf Spielen ${v.slice(0, 4).join(', ')} und ${v[4]} Tore geschossen. Wie viele Tore sind das im Durchschnitt pro Spiel?`, ans: sum / 5, unit: 'Tore', steps: [`Alle Werte addieren: ${v.join(' + ')} = ${sum}`, `Durch die Anzahl der Spiele teilen: ${sum} : 5 = ${f(sum / 5)}`] };
  });
  S('m7-mwst', 'mathe', 7, 'Mehrwertsteuer', r => {
    const netto = pick(r, [50, 100, 150, 200, 300, 400, 500, 800]), st = netto * 19 / 100, what = pick(r, ['Ein Fahrrad', 'Ein Tablet', 'Eine Jacke', 'Ein Schreibtisch']);
    return { q: `${what} kostet ohne Mehrwertsteuer ${netto} €. Dazu kommen 19 % Mehrwertsteuer. Wie hoch ist der Endpreis?`, ans: netto + st, unit: '€', show: f2(netto + st), steps: [`19 % von ${netto} € = ${netto} € · 0,19 = ${f2(st)} €`, `Endpreis: ${netto} € + ${f2(st)} € = ${f2(netto + st)} €`, `(Kurzweg: ${netto} € · 1,19 = ${f2(netto + st)} €)`] };
  });
  S('m7-sparen', 'mathe', 7, 'Gleichung aus dem Alltag', r => {
    const s = ri(r, 2, 12) * 5, w = pick(r, [4, 5, 6, 8, 10]), n = ri(r, 3, 12), Z = s + w * n, kid = pick(r, ['Lena', 'Tom', 'Aylin', 'Jonas']);
    return { q: `${kid} hat ${s} € gespart und legt jede Woche ${w} € dazu. Nach wie vielen Wochen sind es ${Z} €?`, ans: n, unit: 'Wochen', steps: [`Gleichung aufstellen (x = Anzahl der Wochen): ${s} + ${w} · x = ${Z}`, `${s} abziehen: ${w} · x = ${Z - s}`, `Durch ${w} teilen: x = ${n}`] };
  });
  S('m8-tarife', 'mathe', 8, 'Tarife vergleichen', r => {
    const pB = pick(r, [10, 15, 20, 25]), d = pick(r, [5, 10]), pA = pB + d, x = ri(r, 3, 12), gA = pick(r, [0, 10, 20]), gB = gA + d * x;
    return { q: `Studio A kostet ${gA} € Anmeldegebühr und ${pA} € pro Monat. Studio B kostet ${gB} € Anmeldegebühr und ${pB} € pro Monat. Nach wie vielen Monaten haben beide gleich viel gekostet?`, ans: x, unit: 'Monate', steps: [`Kosten als Funktionen: A(x) = ${pA}x + ${gA} und B(x) = ${pB}x + ${gB}`, `Gleichsetzen: ${pA}x + ${gA} = ${pB}x + ${gB}`, `${pA - pB}x = ${gB - gA} → x = ${x}`, 'Danach ist Studio B günstiger, davor Studio A.'] };
  });
  S('m8-jahreszins', 'mathe', 8, 'Zinsen für ein Jahr', r => {
    const K = ri(r, 2, 20) * 100, p = pick(r, [1.5, 2, 2.5, 3, 4]), Z = K * p / 100;
    return { q: `Du legst ${K} € ein Jahr lang zu ${f(p)} % Zinsen an. Wie viele Euro Zinsen bekommst du?`, ans: Z, unit: '€', steps: ['Zinsen = Kapital · Zinssatz', `Z = ${K} € · ${f(p)}/100 = ${K} € · ${f(p / 100)}`, `Z = ${f(Z)} €`] };
  });
  S('m9-leiter', 'mathe', 9, 'Pythagoras im Alltag', r => {
    const [a, h, c] = pick(r, [[3, 4, 5], [1.5, 2, 2.5], [1.8, 2.4, 3], [2.4, 3.2, 4], [2.5, 6, 6.5], [1.4, 4.8, 5]]);
    return { q: `Eine ${f(c)} m lange Leiter lehnt an einer Hauswand. Ihr Fuß steht ${f(a)} m von der Wand entfernt. In welcher Höhe berührt die Leiter die Wand?`, ans: h, unit: 'm', steps: ['Leiter, Boden und Wand bilden ein rechtwinkliges Dreieck – die Leiter ist die Hypotenuse.', `h² = ${f(c)}² − ${f(a)}² = ${f(c * c)} − ${f(a * a)} = ${f(h * h)}`, `h = √${f(h * h)} = ${f(h)} m`] };
  });
  S('m9-wurf', 'mathe', 9, 'Wurfparabel', r => {
    const a = pick(r, [0.05, 0.1, 0.2, 0.25, 0.5]), w = pick(r, [4, 6, 8, 10, 12, 20]), b = a * w, top = a * w * w / 4, land = r() < 0.5;
    const term = `h(x) = −${f(a)}x² + ${f(b)}x`;
    return land ? { q: `Die Flugbahn eines Balls wird durch ${term} beschrieben (x und h in Metern). Nach wie vielen Metern landet der Ball wieder auf dem Boden?`, ans: w, unit: 'm', steps: ['Am Boden ist die Höhe 0: h(x) = 0', `Ausklammern: x · (−${f(a)}x + ${f(b)}) = 0`, `x = 0 (Abwurf) oder x = ${f(b)} : ${f(a)} = ${w}`, `Der Ball landet nach ${w} m.`] }
      : { q: `Die Flugbahn eines Balls wird durch ${term} beschrieben (x und h in Metern). Wie hoch fliegt der Ball höchstens?`, ans: top, unit: 'm', steps: [`Nullstellen: x = 0 und x = ${w}`, `Der höchste Punkt (Scheitel) liegt genau in der Mitte: x = ${f(w / 2)}`, `h(${f(w / 2)}) = −${f(a)} · ${f(w / 2)}² + ${f(b)} · ${f(w / 2)} = ${f(top)} m`] };
  });
  S('m10-turm', 'mathe', 10, 'Höhen bestimmen', r => {
    const d = ri(r, 2, 12) * 10, al = pick(r, [20, 25, 30, 35, 40, 50, 55, 60]), h = d * Math.tan(al * PI / 180);
    return { q: `Du stehst ${d} m von einem Turm entfernt und siehst seine Spitze unter einem Höhenwinkel von ${al}°. Wie hoch ist der Turm? (Augenhöhe vernachlässigen, auf 1 Nachkommastelle runden)`, ans: h, dec: 1, tol: 0.06, unit: 'm', steps: ['Entfernung = Ankathete, Turmhöhe = Gegenkathete → Tangens', `tan ${al}° = h : ${d} → h = ${d} · tan ${al}°`, `h ≈ ${d} · ${f(Math.round(Math.tan(al * PI / 180) * 10000) / 10000)} ≈ ${f(Math.round(h * 10) / 10)} m`] };
  });
  S('m10-wertverlust', 'mathe', 10, 'Wertverlust (exponentielle Abnahme)', r => {
    const K = ri(r, 10, 40) * 1000, p = pick(r, [10, 15, 20, 25]), n = ri(r, 2, 4), q = 1 - p / 100, W = K * Math.pow(q, n);
    return { q: `Ein Auto kostet neu ${K} €. Es verliert jedes Jahr ${p} % seines Wertes. Wie viel ist es nach ${n} Jahren noch wert? (auf ganze Euro runden)`, ans: Math.round(W), tol: 0.6, unit: '€', steps: [`Abnahmefaktor: q = 1 − ${p}/100 = ${f(q)}`, `W = ${K} € · ${f(q)}${sup(n)}`, `W ≈ ${Math.round(W)} €`] };
  });
  S('p7-gewitter', 'physik', 7, 'Wie weit ist das Gewitter?', r => {
    const t = ri(r, 2, 12);
    return { q: `Du siehst einen Blitz und hörst den Donner ${t} s später. Wie weit ist das Gewitter entfernt? (Schallgeschwindigkeit: 340 m/s)`, ans: 340 * t, unit: 'm', steps: ['Das Licht ist praktisch sofort da – der Schall braucht Zeit.', 's = v · t', `s = 340 m/s · ${t} s = ${340 * t} m`] };
  });
  S('p8-stromkosten', 'physik', 8, 'Stromkosten', r => {
    const P = pick(r, [500, 1000, 1500, 2000, 2500]), h = ri(r, 2, 8), pr = pick(r, [30, 40]), E = P * h / 1000, cost = P * h * pr / 100000, what = pick(r, ['Ein Heizlüfter', 'Ein Backofen', 'Ein Wäschetrockner']);
    return { q: `${what} mit ${P} W läuft ${h} Stunden. Eine Kilowattstunde kostet ${f2(pr / 100)} €. Wie viel kostet das?`, ans: cost, unit: '€', show: f2(cost), steps: [`Leistung in kW: ${P} W = ${f(P / 1000)} kW`, `Energie: E = P · t = ${f(P / 1000)} kW · ${h} h = ${f(E)} kWh`, `Kosten: ${f(E)} kWh · ${f2(pr / 100)} € = ${f2(cost)} €`] };
  });
  S('p9-kran', 'physik', 9, 'Leistung eines Krans', r => {
    const m = ri(r, 1, 10) * 100, h = ri(r, 2, 15), t = pick(r, [5, 10, 20, 25]), W = m * 10 * h;
    return { q: `Ein Kran hebt eine Last von ${m} kg in ${t} s um ${h} m an. Welche Leistung bringt er dabei auf? (g = 10 N/kg)`, ans: W / t, unit: 'W', steps: [`Gewichtskraft: F = m · g = ${m} kg · 10 N/kg = ${m * 10} N`, `Hubarbeit: W = F · h = ${m * 10} N · ${h} m = ${W} J`, `Leistung: P = W : t = ${W} J : ${t} s = ${f(W / t)} W`] };
  });
  S('c8-ansetzen', 'chemie', 8, 'Lösung ansetzen', r => {
    const m = pick(r, [100, 200, 250, 400, 500]), w = pick(r, [2, 4, 5, 8, 10, 20]), s = m * w / 100;
    return { q: `Du brauchst ${m} g einer Salzlösung mit einem Massenanteil von ${w} %. Wie viel Gramm Salz musst du abwiegen?`, ans: s, unit: 'g', steps: ['m(Salz) = Massenanteil · m(Lösung)', `m(Salz) = ${w}/100 · ${m} g = ${f(s)} g`, `Dazu kommen ${f(m - s)} g Wasser.`] };
  });
})();
