/* Zufällige Rechenaufgaben mit Rechenweg (Mathe, Physik, Chemie).
   make(r) liefert { q, ans, unit?, steps[], fig?, tol? } – r ist eine Zufallsfunktion (0..1). */
(() => {
  const G = LERN.gens = [];
  const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const f = x => String(Math.round(x * 10000) / 10000).replace('.', ',');
  const f2 = x => (Math.round(x * 100) / 100).toFixed(2).replace('.', ',');
  const sg = x => x < 0 ? '(' + f(x) + ')' : f(x);
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const add = (id, subject, grade, name, make) => G.push({ id, subject, grade, name, make });
  const PI = Math.PI;

  /* --- Figuren --- */
  const rectFig = (a, b) => `<svg viewBox="0 0 240 150" class="dia" role="img" aria-label="Rechteck ${a} mal ${b}"><rect x="40" y="20" width="170" height="100" class="shape"/><text x="125" y="140" text-anchor="middle">${a} cm</text><text x="32" y="75" text-anchor="end">${b} cm</text></svg>`;
  const triFig = (la, lb, lc, hide) => `<svg viewBox="0 0 240 160" class="dia" role="img" aria-label="Rechtwinkliges Dreieck"><polygon points="40,130 200,130 40,30" class="shape"/><path d="M40 118h12v12" class="dl" fill="none"/><text x="120" y="150" text-anchor="middle">${hide === 'b' ? 'b = ?' : 'b = ' + lb}</text><text x="32" y="85" text-anchor="end">${hide === 'a' ? 'a = ?' : 'a = ' + la}</text><text x="130" y="72">${hide === 'c' ? 'c = ?' : 'c = ' + lc}</text></svg>`;
  const trigFig = (c, al, ask) => `<svg viewBox="0 0 240 160" class="dia" role="img" aria-label="Dreieck mit Winkel"><polygon points="30,130 210,130 210,40" class="shape"/><path d="M198 130v-12h12" class="dl" fill="none" transform="translate(0,0)"/><text x="52" y="124">${al}°</text><text x="110" y="68" transform="rotate(-27 110 68)">${c} cm</text><text x="218" y="90">${ask}</text></svg>`;

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
    return { q: `Runde ${n} auf ${nm}.`, ans: res, steps: [`Schau auf die Stelle rechts vom ${nm}: ${Math.floor((n % place) / (place / 10))}`, 'Bei 0–4 abrunden, bei 5–9 aufrunden.', `Ergebnis: ${res}`] };
  });

  add('m6-bruchadd', 'mathe', 6, 'Brüche addieren', r => {
    const b = pick(r, [2, 3, 4, 5, 6, 8]), d = pick(r, [2, 3, 4, 6, 8, 12]);
    const a = ri(r, 1, b - 1), c = ri(r, 1, d - 1), lcm = b * d / gcd(b, d), n = a * (lcm / b) + c * (lcm / d), g = gcd(n, lcm);
    return { q: `Berechne ${a}/${b} + ${c}/${d}. Gib das Ergebnis als Bruch (z. B. 3/4) oder Dezimalzahl an.`, ans: n / lcm, steps: [`Hauptnenner: ${lcm}`, `${a}/${b} = ${a * lcm / b}/${lcm} und ${c}/${d} = ${c * lcm / d}/${lcm}`, `Zähler addieren: ${a * lcm / b} + ${c * lcm / d} = ${n} → ${n}/${lcm}`, `Gekürzt: ${n / g}/${lcm / g} = ${f(n / lcm)}`] };
  });
  add('m6-bruchvon', 'mathe', 6, 'Bruchteile berechnen', r => {
    const b = pick(r, [3, 4, 5, 6, 8, 10]), a = ri(r, 1, b - 1), N = b * ri(r, 2, 12);
    return { q: `Wie viel sind ${a}/${b} von ${N}?`, ans: N / b * a, steps: [`Durch den Nenner teilen: ${N} : ${b} = ${N / b}`, `Mit dem Zähler multiplizieren: ${N / b} · ${a} = ${N / b * a}`] };
  });
  add('m6-dezimal', 'mathe', 6, 'Dezimalzahlen multiplizieren', r => {
    const x = ri(r, 12, 99), y = ri(r, 2, 9), A = x / 10, B = y / 10;
    return { q: `Berechne: ${f(A)} · ${f(B)}`, ans: x * y / 100, steps: [`Ohne Komma rechnen: ${x} · ${y} = ${x * y}`, 'Nachkommastellen zählen: 1 + 1 = 2', `Komma um 2 Stellen setzen: ${f(x * y / 100)}`] };
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
    const n1 = ri(r, 2, 8), unit = pick(r, [1.5, 2, 2.5, 3, 4]), n2 = ri(r, 3, 12), K = n1 * unit;
    return { q: `${n1} Hefte kosten ${f(K)} €. Wie viel kosten ${n2} Hefte?`, ans: n2 * unit, unit: '€', steps: [`Auf 1 Heft umrechnen: ${f(K)} € : ${n1} = ${f(unit)} €`, `Auf ${n2} Hefte hochrechnen: ${f(unit)} € · ${n2} = ${f(n2 * unit)} €`] };
  });
  add('m7-antiprop', 'mathe', 7, 'Dreisatz (antiproportional)', r => {
    const n1 = pick(r, [2, 3, 4, 6]), t1 = pick(r, [6, 8, 12, 18]), n2 = pick(r, [2, 3, 4, 6, 9, 12]), tot = n1 * t1;
    if (tot % n2) return G.find(x => x.id === 'm7-antiprop').make(r);
    return { q: `${n1} Maler brauchen ${t1} Tage für ein Haus. Wie viele Tage brauchen ${n2} Maler?`, ans: tot / n2, unit: 'Tage', steps: [`Gesamtarbeit: ${n1} · ${t1} = ${tot} Maler-Tage`, `Durch die neue Anzahl teilen: ${tot} : ${n2} = ${tot / n2} Tage`] };
  });
  add('m7-gleichung', 'mathe', 7, 'Gleichungen lösen', r => {
    const a = ri(r, 2, 9), b = ri(r, -12, 15) || 4, x = ri(r, -6, 12), c = a * x + b;
    return { q: `Löse: ${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${c}`, ans: x, steps: [`${b < 0 ? '+' : '−'} ${Math.abs(b)} auf beiden Seiten: ${a}x = ${c - b}`, `Durch ${a} teilen: x = ${c - b} : ${a} = ${x}`, `Probe: ${a} · ${sg(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${c} ✓`] };
  });
  add('m7-rational', 'mathe', 7, 'Rechnen mit negativen Zahlen', r => {
    const op = pick(r, ['+', '−', '·', ':']);
    let a = ri(r, -12, 12) || 5, b = ri(r, -9, 9) || -3, res, hint;
    if (op === ':') { b = pick(r, [-6, -4, -3, -2, 2, 3, 4, 6]); a = b * ri(r, -8, 8) || b * 3; }
    res = op === '+' ? a + b : op === '−' ? a - b : op === '·' ? a * b : a / b;
    hint = op === '+' ? 'Gleiche Vorzeichen: addieren, Vorzeichen behalten. Verschiedene: subtrahieren, Vorzeichen der größeren Zahl.' : op === '−' ? `Subtrahieren heißt, die Gegenzahl addieren: ${sg(a)} + ${sg(-b)}` : 'Gleiche Vorzeichen → Ergebnis positiv, verschiedene → negativ.';
    return { q: `Berechne: ${sg(a)} ${op} ${sg(b)}`, ans: res, steps: [hint, `${sg(a)} ${op} ${sg(b)} = ${f(res)}`] };
  });

  add('m8-steigung', 'mathe', 8, 'Steigung berechnen', r => {
    const m = pick(r, [-4, -3, -2, -1, 1, 2, 3, 4]), dx = ri(r, 1, 4), x1 = ri(r, -3, 3), y1 = ri(r, -4, 4), x2 = x1 + dx, y2 = y1 + m * dx;
    return { q: `Eine Gerade geht durch A(${x1}|${y1}) und B(${x2}|${y2}). Wie groß ist die Steigung m?`, ans: m, steps: ['m = (y₂ − y₁) : (x₂ − x₁)', `m = (${y2} − ${sg(y1)}) : (${x2} − ${sg(x1)}) = ${y2 - y1} : ${dx} = ${m}`] };
  });
  add('m8-nullstelle', 'mathe', 8, 'Nullstelle linearer Funktionen', r => {
    const m = pick(r, [-5, -3, -2, 2, 3, 4, 5]), x0 = ri(r, -6, 8) || 3, b = -m * x0;
    return { q: `Berechne die Nullstelle von y = ${m}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}.`, ans: x0, steps: ['Nullstelle: y = 0 setzen', `${m}x ${b < 0 ? '−' : '+'} ${Math.abs(b)} = 0 → ${m}x = ${-b}`, `x = ${-b} : ${sg(m)} = ${x0}`] };
  });
  add('m8-funktionswert', 'mathe', 8, 'Funktionswert berechnen', r => {
    const m = pick(r, [-3, -2, 2, 3, 4]), b = ri(r, -6, 8) || 2, x = ri(r, -4, 6);
    return { q: `Gegeben ist y = ${m}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}. Berechne y für x = ${x}.`, ans: m * x + b, steps: [`x einsetzen: y = ${m} · ${sg(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}`, `y = ${m * x} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${m * x + b}`] };
  });
  add('m8-binom', 'mathe', 8, 'Binomische Formeln im Kopf', r => {
    const t = ri(r, 2, 9) * 10, d = pick(r, [1, 2, 3]), plus = r() < 0.5, n = plus ? t + d : t - d;
    return { q: `Berechne mit einer binomischen Formel im Kopf: ${n}²`, ans: n * n, steps: [`${n} = ${t} ${plus ? '+' : '−'} ${d}`, `(${t} ${plus ? '+' : '−'} ${d})² = ${t}² ${plus ? '+' : '−'} 2 · ${t} · ${d} + ${d}²`, `= ${t * t} ${plus ? '+' : '−'} ${2 * t * d} + ${d * d} = ${n * n}`] };
  });
  add('m8-gls', 'mathe', 8, 'Gleichungssystem (Additionsverfahren)', r => {
    const x = ri(r, 1, 9), y = ri(r, 1, 8), s = x + y, dd = x - y;
    return { q: `Löse das System und gib x an:  x + y = ${s}  und  x − y = ${dd}`, ans: x, steps: [`Beide Gleichungen addieren: 2x = ${s} + ${sg(dd)} = ${s + dd}`, `x = ${s + dd} : 2 = ${x}`, `y = ${s} − ${x} = ${y}`] };
  });
  add('m8-kreis', 'mathe', 8, 'Kreis: Umfang & Fläche', r => {
    const rad = ri(r, 2, 12), area = r() < 0.5;
    return area ? { q: `Ein Kreis hat den Radius ${rad} cm. Berechne die Fläche (π ≈ 3,1416, auf 2 Stellen runden).`, ans: PI * rad * rad, unit: 'cm²', steps: ['A = π · r²', `A = π · ${rad}² = π · ${rad * rad} = ${f2(PI * rad * rad)} cm²`] }
      : { q: `Ein Kreis hat den Radius ${rad} cm. Berechne den Umfang (π ≈ 3,1416, auf 2 Stellen runden).`, ans: 2 * PI * rad, unit: 'cm', steps: ['u = 2 · π · r', `u = 2 · π · ${rad} = ${f2(2 * PI * rad)} cm`] };
  });

  add('m9-pyth-c', 'mathe', 9, 'Pythagoras: Hypotenuse', r => {
    const a = ri(r, 3, 15), b = ri(r, 3, 15), c = Math.sqrt(a * a + b * b);
    return { q: `Ein rechtwinkliges Dreieck hat die Katheten a = ${a} cm und b = ${b} cm. Berechne die Hypotenuse c (auf 2 Stellen runden).`, fig: triFig(a, b, '?', 'c'), ans: c, unit: 'cm', steps: ['c² = a² + b²', `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`, `c = √${a * a + b * b} ≈ ${f2(c)} cm`] };
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
    return { q: `Löse x² ${p < 0 ? '−' : '+'} ${Math.abs(p)}x ${q < 0 ? '−' : '+'} ${Math.abs(q)} = 0. Gib die größere der beiden Lösungen an.`, ans: big, steps: ['pq-Formel: x = −p/2 ± √((p/2)² − q)', `x = ${f(-p / 2)} ± √(${f(p / 2 * p / 2)} − ${sg(q)}) = ${f(-p / 2)} ± √${f(D)} = ${f(-p / 2)} ± ${f(Math.sqrt(D))}`, `x₁ = ${big}, x₂ = ${small} → größere Lösung: ${big}`] };
  });

  add('m10-sinus', 'mathe', 10, 'Trigonometrie: Seite berechnen', r => {
    const c = ri(r, 5, 20), al = pick(r, [20, 25, 30, 35, 40, 50, 55, 60, 65]), mode = pick(r, ['sin', 'cos']);
    const rad = al * PI / 180, v = mode === 'sin' ? Math.sin(rad) : Math.cos(rad);
    return { q: `In einem rechtwinkligen Dreieck ist die Hypotenuse c = ${c} cm und der Winkel α = ${al}°. Berechne die ${mode === 'sin' ? 'Gegenkathete a' : 'Ankathete b'} (auf 2 Stellen runden).`, fig: trigFig(c, al, mode === 'sin' ? 'a = ?' : 'b = ?'), ans: c * v, unit: 'cm', steps: [mode === 'sin' ? 'sin α = Gegenkathete : Hypotenuse → a = c · sin α' : 'cos α = Ankathete : Hypotenuse → b = c · cos α', `${mode === 'sin' ? 'a' : 'b'} = ${c} · ${mode} ${al}° ≈ ${c} · ${f(Math.round(v * 10000) / 10000)}`, `≈ ${f2(c * v)} cm`] };
  });
  add('m10-tanwinkel', 'mathe', 10, 'Trigonometrie: Winkel berechnen', r => {
    const a = ri(r, 2, 12), b = ri(r, 2, 12), al = Math.atan(a / b) * 180 / PI;
    return { q: `In einem rechtwinkligen Dreieck ist die Gegenkathete a = ${a} cm und die Ankathete b = ${b} cm. Berechne α in Grad (auf 1 Stelle runden).`, ans: al, unit: '°', tol: 0.15, steps: ['tan α = Gegenkathete : Ankathete', `tan α = ${a} : ${b} ≈ ${f(Math.round(a / b * 10000) / 10000)}`, `α = tan⁻¹(${f(Math.round(a / b * 10000) / 10000)}) ≈ ${f(Math.round(al * 10) / 10)}°`] };
  });
  add('m10-zins', 'mathe', 10, 'Zinseszins', r => {
    const K = ri(r, 2, 16) * 500, p = pick(r, [2, 3, 4, 5]), n = ri(r, 2, 5), Kn = K * Math.pow(1 + p / 100, n);
    return { q: `${K} € werden ${n} Jahre lang mit ${p} % pro Jahr verzinst (mit Zinseszins). Wie hoch ist das Guthaben am Ende (auf Cent runden)?`, ans: Kn, unit: '€', steps: [`Wachstumsfaktor: 1 + ${p}/100 = ${f(1 + p / 100)}`, `Kₙ = K₀ · q^n = ${K} · ${f(1 + p / 100)}^${n}`, `Kₙ ≈ ${f2(Kn)} €`] };
  });
  add('m10-zylinder', 'mathe', 10, 'Körper: Zylinder, Kegel, Kugel', r => {
    const rad = ri(r, 2, 10), h = ri(r, 3, 15), k = pick(r, ['Zylinder', 'Kegel', 'Kugel']);
    if (k === 'Kugel') return { q: `Berechne das Volumen einer Kugel mit Radius ${rad} cm (auf 2 Stellen runden).`, ans: 4 / 3 * PI * rad ** 3, unit: 'cm³', steps: ['V = 4/3 · π · r³', `V = 4/3 · π · ${rad}³ = 4/3 · π · ${rad ** 3}`, `V ≈ ${f2(4 / 3 * PI * rad ** 3)} cm³`] };
    const fac = k === 'Kegel' ? 1 / 3 : 1;
    return { q: `Berechne das Volumen eines ${k}s mit Radius ${rad} cm und Höhe ${h} cm (auf 2 Stellen runden).`, ans: fac * PI * rad * rad * h, unit: 'cm³', steps: [k === 'Kegel' ? 'V = 1/3 · π · r² · h' : 'V = π · r² · h', `V = ${k === 'Kegel' ? '1/3 · ' : ''}π · ${rad}² · ${h} = ${k === 'Kegel' ? '1/3 · ' : ''}π · ${rad * rad * h}`, `V ≈ ${f2(fac * PI * rad * rad * h)} cm³`] };
  });
  add('m10-wachstum', 'mathe', 10, 'Exponentielles Wachstum', r => {
    const N0 = pick(r, [100, 200, 500, 800]), pc = pick(r, [10, 20, 50, 100]), n = ri(r, 2, 4), q = 1 + pc / 100, N = N0 * Math.pow(q, n);
    return { q: `Eine Bakterienkultur hat ${N0} Bakterien und wächst pro Stunde um ${pc} %. Wie viele sind es nach ${n} Stunden?`, ans: N, steps: [`Wachstumsfaktor q = ${f(q)}`, `N = ${N0} · ${f(q)}^${n}`, `N = ${f(N)}`] };
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
    return { q: `Zwei Widerstände (${a} Ω und ${b} Ω) sind parallel geschaltet. Wie groß ist der Gesamtwiderstand?`, ans: res, unit: 'Ω', steps: ['Parallel: 1/R = 1/R₁ + 1/R₂', `1/R = 1/${a} + 1/${b} = ${f(1 / a + 1 / b)}`, `R = 1 : ${f(1 / a + 1 / b)} = ${res} Ω`] };
  });
  add('p8-leistung-el', 'physik', 8, 'Elektrische Leistung & Energie', r => {
    const U = pick(r, [230, 12, 9, 5]), I = pick(r, [0.5, 1, 2, 4]), P = U * I, h = ri(r, 2, 10);
    return r() < 0.5 ? { q: `Ein Gerät liegt an ${U} V und zieht ${f(I)} A. Welche Leistung hat es?`, ans: P, unit: 'W', steps: ['P = U · I', `P = ${U} V · ${f(I)} A = ${f(P)} W`] }
      : { q: `Eine Lampe mit ${f(P)} W leuchtet ${h} Stunden. Wie viel Energie verbraucht sie in Wattstunden?`, ans: P * h, unit: 'Wh', steps: ['E = P · t', `E = ${f(P)} W · ${h} h = ${f(P * h)} Wh`] };
  });
  add('p8-waerme', 'physik', 8, 'Wärmemenge (Wasser erwärmen)', r => {
    const m = pick(r, [0.5, 1, 2, 3]), dT = pick(r, [10, 20, 30, 40, 50, 60, 80]), Q = 4.19 * m * dT;
    return { q: `Wie viel Wärme (in kJ) braucht man, um ${f(m)} kg Wasser um ${dT} K zu erwärmen? (c = 4,19 kJ/(kg·K), auf 2 Stellen runden)`, ans: Q, unit: 'kJ', steps: ['Q = c · m · ΔT', `Q = 4,19 · ${f(m)} · ${dT}`, `Q ≈ ${f2(Q)} kJ`] };
  });
  add('p8-hebel', 'physik', 8, 'Hebelgesetz', r => {
    const F1 = ri(r, 2, 20) * 10, l1 = ri(r, 2, 6) * 10, F2 = pick(r, [10, 20, 40, 50]), tot = F1 * l1;
    if (tot % F2) return G.find(x => x.id === 'p8-hebel').make(r);
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
    return { q: `Ein Präparat enthält anfangs ${N0} radioaktive Kerne. Die Halbwertszeit beträgt ${T} Tage. Wie viele Kerne sind nach ${n * T} Tagen noch übrig?`, ans: N0 / Math.pow(2, n), steps: [`${n * T} Tage : ${T} Tage = ${n} Halbwertszeiten`, `Nach jeder Halbwertszeit halbiert sich die Zahl: ${N0} · (1/2)^${n}`, `${N0} : ${Math.pow(2, n)} = ${f(N0 / Math.pow(2, n))}`] };
  });

  /* ================= CHEMIE ================= */
  add('c7-dichte', 'chemie', 7, 'Dichte, Masse & Volumen', r => {
    const rho = pick(r, [0.8, 1, 2.7, 5, 7.9, 8.9, 11.3]), V = pick(r, [10, 20, 25, 50, 100]), m = rho * V, md = pick(r, ['rho', 'm']);
    return md === 'rho' ? { q: `Ein Körper hat die Masse ${f(m)} g und das Volumen ${V} cm³. Wie groß ist die Dichte?`, ans: rho, unit: 'g/cm³', steps: ['ρ = m : V', `ρ = ${f(m)} g : ${V} cm³ = ${f(rho)} g/cm³`] }
      : { q: `Ein Stoff hat die Dichte ${f(rho)} g/cm³. Welche Masse hat ein Stück mit ${V} cm³?`, ans: m, unit: 'g', steps: ['m = ρ · V', `m = ${f(rho)} g/cm³ · ${V} cm³ = ${f(m)} g`] };
  });
  add('c8-massenanteil', 'chemie', 8, 'Massenanteil einer Lösung', r => {
    const ms = pick(r, [5, 10, 20, 25, 40]), w = pick(r, [20, 40, 50, 80, 90, 100, 150, 200]), tot = ms + w;
    return { q: `${ms} g Salz werden in ${w} g Wasser gelöst. Wie groß ist der Massenanteil des Salzes in der Lösung (in %, auf 1 Stelle runden)?`, ans: ms / tot * 100, unit: '%', tol: 0.06, steps: ['w = m(Stoff) : m(Lösung) · 100 %', `m(Lösung) = ${ms} g + ${w} g = ${tot} g`, `w = ${ms} : ${tot} · 100 % ≈ ${f(Math.round(ms / tot * 1000) / 10)} %`] };
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
    return { q: `Berechne den pH-Wert einer starken einprotonigen Säure mit c = 10⁻${k} mol/L.`, ans: k, steps: ['pH = −lg c(H₃O⁺)', `c(H₃O⁺) = 10⁻${k} mol/L`, `pH = −lg 10⁻${k} = ${k}`] };
  });
})();
