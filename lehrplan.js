/* Lehrplanbezug für jedes Thema.
   Quelle: Kernlehrpläne für das Gymnasium Sek. I in NRW (G9, ab Schuljahr 2019/20) und die dort veröffentlichten
   „Beispiele für einen schulinternen Lehrplan“ (lehrplannavigator.nrw.de, abgerufen im Oktober 2026).
   Die Inhaltsfelder (IF) sind verbindlich. In welcher Klasse ein Inhaltsfeld unterrichtet wird, legt jede Schule selbst fest –
   der Kernlehrplan trennt nur die Erprobungsstufe (5/6) von den Klassen 7–10. Die Unterrichtsvorhaben (uv) stammen aus den
   Beispiel-Lehrplänen und sind daher nur ein Anhaltspunkt. Die Zuordnung der App-Themen zu den Inhaltsfeldern stammt von uns. */
(() => {
  const E = 'e', M = 'm';   // Stufe laut Kernlehrplan: e = Erprobungsstufe (5/6), m = Klassen 7–10
  // Regeln je Fach: [Muster für die Themen-ID, Inhaltsfeld, Stufe (optional), nur für diese Klassen (optional)]
  const R = {
    mathe: [
      [/begriffe/, 'Fachbegriffe (alle Inhaltsfelder)'],
      [/flaechen|geometrie|winkel|pythagoras|trig|koerper/, 'Inhaltsfeld Geometrie'],
      [/linear|proportional|quadratisch|exponential|steigung|achsenabschnitt|nullstellen|scheitelpunkt/, 'Inhaltsfeld Funktionen'],
      [/./, 'Inhaltsfeld Arithmetik/Algebra']
    ],
    deutsch: [
      [/textarten|stilmittel|literatur|lit-begriffe|autoren|gattung|epochen|analyse/, 'Inhaltsfeld Texte'],
      [/argumentieren|rhetorik/, 'Inhaltsfelder Texte und Kommunikation'],
      [/./, 'Inhaltsfeld Sprache']
    ],
    englisch: [
      [/voc|phrasal/, 'Verfügen über sprachliche Mittel: Wortschatz'],
      [/alltag|text-skills|linking/, 'Kommunikative Kompetenzen (Sprechen, Schreiben, Sprachmittlung)'],
      [/./, 'Verfügen über sprachliche Mittel: Grammatik']
    ],
    franzoesisch: [
      [/voc|bases|adjektive|verben-bewegung/, 'Verfügen über sprachliche Mittel: Wortschatz'],
      [/alltag|kultur|redewendungen/, 'Kommunikative und interkulturelle Kompetenz'],
      [/./, 'Verfügen über sprachliche Mittel: Grammatik']
    ],
    latein: [
      [/zitate|personen|rom|literatur/, 'Kulturkompetenz und Textkompetenz'],
      [/vokabeln|voc/, 'Sprachkompetenz: Wortschatz'],
      [/./, 'Sprachkompetenz: Formenlehre und Satzlehre']
    ],
    biologie: [
      [/wirbeltiere|pflanzen|tiere-begriffe|zelle/, 'IF 1 Vielfalt und Angepasstheiten von Lebewesen', E],
      [/verdauung|skelett|kreislauf/, 'IF 2 Mensch und Gesundheit (Erprobungsstufe)', E],
      [/oeko|umwelt/, 'IF 4 Ökologie und Naturschutz', M],
      [/evolution/, 'IF 5 Evolution', M],
      [/genetik/, 'IF 6 Genetik', M],
      [/immun/, 'IF 7 Mensch und Gesundheit · IF 8 Sexualerziehung', M],
      [/nerven/, 'IF 7 Mensch und Gesundheit', M]
    ],
    physik: [
      [/waerme/, 'IF 1 Temperatur und Wärme · IF 3 Schall', E],
      [/optik/, 'IF 4 Licht · IF 5 Optische Instrumente'],
      [/astro/, 'IF 6 Sterne und Weltall', M],
      [/elektrik/, 'IF 2 Elektrischer Strom und Magnetismus · IF 9 Elektrizität'],
      [/atom/, 'IF 10 Ionisierende Strahlung und Kernenergie', M],
      [/energie/, 'IF 7 Bewegung, Kraft und Energie · IF 8 Druck und Auftrieb', M],
      [/./, 'IF 7 Bewegung, Kraft und Energie', M]
    ],
    chemie: [
      [/stoffe/, 'IF 1 Stoffe und Stoffeigenschaften', M],
      [/reaktionen/, 'IF 2 Chemische Reaktion · IF 3 Verbrennung', M],
      [/atom|elemente|pse/, 'IF 5 Elemente und ihre Ordnung', M],
      [/bindung/, 'IF 6 Salze und Ionen · IF 8 Molekülverbindungen', M],
      [/redox/, 'IF 4 Metalle und Metallgewinnung · IF 7 Chemische Reaktionen durch Elektronenübertragung', M],
      [/saeuren/, 'IF 9 Saure und alkalische Lösungen', M],
      [/./, 'IF 10 Organische Chemie', M]
    ],
    geschichte: [
      [/steinzeit|aegypten/, 'IF 1 Frühe Kulturen und erste Hochkulturen', E],
      [/antike/, 'IF 2 Antike Lebenswelten: Griechische Poleis und Imperium Romanum', E],
      [/mittelalter/, 'IF 3 Lebenswelten im Mittelalter'],
      [/neuzeit/, 'IF 4 Frühe Neuzeit: Neue Welten, neue Horizonte', M],
      [/revolution/, 'IF 5 Das „lange“ 19. Jahrhundert – politischer und wirtschaftlicher Wandel in Europa', M],
      [/kaiserreich/, 'IF 6 Imperialismus und Erster Weltkrieg', M],
      [/^ns$/, 'IF 7 Weimarer Republik · IF 8 Nationalsozialismus und Zweiter Weltkrieg', M],
      [/nachkrieg/, 'IF 9 Internationale Verflechtungen seit 1945 · IF 10 Entwicklungen in Deutschland seit 1945', M],
      [/./, 'IF 1 Frühe Kulturen · IF 2 Antike Lebenswelten', E, [5]],
      [/./, 'IF 3 Lebenswelten im Mittelalter', '', [6]],
      [/./, 'IF 4 Frühe Neuzeit: Neue Welten, neue Horizonte', M, [7]],
      [/./, 'IF 5 Das „lange“ 19. Jahrhundert', M, [8]],
      [/./, 'IF 6 Imperialismus und Erster Weltkrieg · IF 7 Weimarer Republik · IF 8 Nationalsozialismus', M, [9]],
      [/./, 'IF 9 Internationale Verflechtungen seit 1945 · IF 10 Entwicklungen in Deutschland seit 1945', M, [10]]
    ],
    erdkunde: [
      [/klima-umwelt/, 'IF 5 Wetter und Klima (Klimawandel)', M],
      [/klima|wetter/, 'IF 5 Wetter und Klima · IF 6 Landwirtschaftliche Produktion in unterschiedlichen Landschaftszonen', M],
      [/plattentektonik|geologie/, 'IF 4 Aufbau und Dynamik der Erde', M],
      [/bevoelkerung/, 'IF 8 Wachstum und Verteilung der Weltbevölkerung · IF 9 Verstädterung und Stadtentwicklung', M],
      [/wirtschaft/, 'IF 10 Räumliche Strukturen unter dem Einfluss von Globalisierung und Digitalisierung', M],
      [/eine-welt|entwicklung/, 'IF 7 Innerstaatliche und globale Disparitäten', M],
      [/./, 'Topographisches Orientierungsraster (begleitet alle Inhaltsfelder)']
    ],
    politik: [
      [/medien/, 'IF 5 Medien und Information in der digitalisierten Welt'],
      [/recht/, 'IF 8 Handeln als Verbraucherinnen und Verbraucher · IF 2 Demokratie', M],
      [/sozialstaat/, 'IF 7 Soziale Sicherung in Deutschland', M],
      [/wirtschaft/, 'IF 1 Wirtschaftliches Handeln in der marktwirtschaftlichen Ordnung · IF 6 Unternehmen und Gewerkschaften'],
      [/eu/, 'IF 9 Die Europäische Union · IF 11 Globalisierte Strukturen und Prozesse in der Politik', M],
      [/./, 'IF 2 Sicherung und Weiterentwicklung der Demokratie']
    ],
    informatik: [
      [/ki/, 'Inhaltsfeld Automaten und künstliche Intelligenz'],
      [/algorithmen|programmieren/, 'Inhaltsfeld Algorithmen'],
      [/binaer|daten/, 'Inhaltsfeld Information und Daten'],
      [/internet|digitalisierung/, 'Inhaltsfeld Informatik, Mensch und Gesellschaft'],
      [/./, 'Inhaltsfeld Informatiksysteme']
    ],
    musik: [
      [/epochen|komponisten|stile|popgeschichte/, 'Inhaltsfeld Entwicklungen von Musik'],
      [/formen/, 'Inhaltsfelder Bedeutungen und Entwicklungen von Musik'],
      [/./, 'Grundlagen: Ordnungssysteme der musikalischen Parameter']
    ],
    kunst: [
      [/kunstgeschichte|kuenstler|epochen/, 'IF 2 Bildkonzepte'],
      [/medien|plastik|druck/, 'IF 3 Gestaltungsfelder in Funktionszusammenhängen'],
      [/./, 'IF 1 Bildgestaltung']
    ],
    religion: [
      [/bibel|biblische/, 'IF 5 Zugänge zur Bibel (ev.) / Bibel als „Ur-kunde“ des Glaubens (kath.)'],
      [/weltreligionen|islam|hindu/, 'IF 6 Religionen und Weltanschauungen im Dialog (ev.) / Weltreligionen im Dialog (kath.)'],
      [/christentum|reformation/, 'IF 4 Kirche und andere Formen religiöser Gemeinschaft (ev.) / Kirche als Nachfolgegemeinschaft (kath.)'],
      [/religion-gesellschaft/, 'IF 7 Religion in Alltag und Kultur (ev.) / Religion in einer pluralen Gesellschaft (kath.)'],
      [/./, 'IF 1 Menschliches Handeln in Freiheit und Verantwortung (ev.) / Menschsein in Freiheit und Verantwortung (kath.)']
    ]
  };

  /* Beispiel-Unterrichtsvorhaben aus den veröffentlichten Beispiel-Lehrplänen (gekürzt). Schlüssel = Klasse. */
  const UV = {
    mathe: {
      5: ['Erhebung und Darstellung von Daten', 'Große Zahlen darstellen, ordnen, vergleichen', 'Rechnen mit Größen und Einheiten', 'Rechenterme (Rechnen mit System)', 'Ebene Figuren, erste Konstruktionen', 'Flächeninhalt und Umfang', 'Brüche begreifen: Anteil, Bruchteil, Ganzes', 'Körper im Raum'],
      6: ['Zerlegung natürlicher Zahlen (Teiler, Primzahlen)', 'Ganze Zahlen', 'Rauminhalt und Oberfläche', 'Rationale Zahlen (Bruch, Dezimalzahl, Prozent)', 'Addition und Subtraktion von Brüchen und Dezimalzahlen', 'Multiplikation und Division von Brüchen', 'Grundlagen der Stochastik', 'Muster, Zahlenfolgen und Terme', 'Verschiebungen und Spiegelungen'],
      7: ['Zuordnungen und ihre Darstellungen', 'Rabatte, Mehrwertsteuer und Prozente', 'Winkel und Winkelsätze', 'Rechnen mit rationalen Zahlen', 'Termumformungen', 'Terme und Gleichungen', 'Wahrscheinlichkeiten'],
      8: ['Glücksrad und Lostrommel (Stochastik)', 'Geometrische Konstruktionen und Kongruenz', 'Lineare Funktionen', 'Lineare Gleichungssysteme', 'Bruchterme und Bruchgleichungen', 'Zinseszins und Ratenkauf'],
      9: ['Satz des Pythagoras', 'Irrationale Zahlen', 'π und die Kreisberechnung', 'Quadratische Zusammenhänge', 'Nullstellen quadratischer Funktionen', 'Oberfläche und Volumen von Prismen und Pyramiden', 'Potenzen und Wurzeln', 'Maßstabsgetreue Abbildungen (Ähnlichkeit)', 'Statistik kritisch lesen'],
      10: ['Volumen und Oberfläche von Kugel, Kegel und Zylinder', 'Exponentielle Funktionen', 'Einführung in die Trigonometrie', 'Kosinussatz', 'Modellieren mit exponentiellen Funktionen', 'Bedingte Wahrscheinlichkeiten', 'Sinusfunktion', 'Modellieren mit verschiedenen Funktionstypen']
    },
    biologie: {
      5: ['Die Biologie erforscht das Leben (Kennzeichen, Mikroskop)', 'Wirbeltiere in meiner Umgebung', 'Tiergerechter Umgang mit Nutztieren', 'Bau und Funktionsweise der Pflanzen', 'Vielfalt der Blüten – Fortpflanzung von Blütenpflanzen', 'Nahrung – Energie für den Körper'],
      6: ['Atmung und Blutkreislauf', 'Bewegung – die Energie wird genutzt', 'Pubertät – erwachsen werden', 'Fortpflanzung – ein Mensch entsteht'],
      8: ['Erkunden eines Ökosystems', 'Pilze und Bodenlebewesen im Ökosystem', 'Mechanismen der Evolution', 'Der Stammbaum des Lebens', 'Evolution des Menschen', 'Energiefluss und Stoffkreisläufe', 'Biodiversität und Naturschutz', 'Menschliche Sexualität'],
      10: ['Immunbiologie – Abwehr und Schutz vor Erkrankungen', 'Hormonelle Regulation der Blutzuckerkonzentration', 'Fruchtbarkeit und Familienplanung', 'Die Erbinformation', 'Gesetzmäßigkeiten der Vererbung']
    },
    chemie: {
      7: ['Stoffe im Alltag', 'Chemische Reaktionen in unserer Umwelt', 'Facetten der Verbrennungsreaktion', 'Vom Rohstoff zum Metall'],
      8: ['Elementfamilien schaffen Ordnung'],
      9: ['Die Welt der Mineralien (Salze)', 'Energie aus chemischen Reaktionen', 'Gase in unserer Atmosphäre', 'Gase als Ausgangsstoffe für Industrierohstoffe'],
      10: ['Wasser, mehr als ein Lösemittel', 'Saure und alkalische Lösungen', 'Reaktionen von sauren mit alkalischen Lösungen', 'Alkane und Alkanole', 'Vielseitige Kunststoffe']
    },
    physik: {
      6: ['Wir messen Temperaturen', 'Leben bei verschiedenen Temperaturen', 'Elektrische Geräte im Alltag', 'Magnetismus', 'Physik und Musik (Schall)', 'Achtung Lärm!', 'Sehen und gesehen werden (Licht)', 'Licht nutzbar machen'],
      7: ['Spiegelbilder im Straßenverkehr', 'Die Welt der Farben', 'Das Auge – ein optisches System', 'Optische Instrumente', 'Licht und Schatten im Sonnensystem'],
      9: ['Objekte am Himmel', '100 m in 10 Sekunden (Bewegung)', 'Einfache Maschinen und Werkzeuge', 'Energie treibt alles an', 'Druck und Auftrieb', 'Blitze und Gewitter (Elektrizität)'],
      10: ['Sicherer Umgang mit Elektrizität', 'Gefahren und Nutzen ionisierender Strahlung', 'Energie aus Atomkernen', 'Versorgung mit elektrischer Energie', 'Energieversorgung der Zukunft']
    },
    erdkunde: {
      5: ['Arbeit mit Karte und Atlas', 'Leben in der Stadt oder auf dem Land (Siedlungen)', 'Tourismus: Voraussetzungen und Auswirkungen', 'Standortfaktoren und Strukturwandel', 'Woher kommen unsere Nahrungsmittel? (Landwirtschaft)'],
      7: ['Klima als Bedingung für Leben und Wirtschaften', 'Tropische Regenwälder in Gefahr', 'Trockene und winterfeuchte Subtropen', 'Landwirtschaft in den gemäßigten Mittelbreiten', 'Ursachen und Folgen des Klimawandels', 'Unruhige Erde (Plattentektonik)'],
      9: ['Räume unterschiedlichen Entwicklungsstandes', 'Bevölkerungswachstum und Ernährungssicherung', 'Strategien zur Entwicklung strukturschwacher Räume', 'Migration', 'Stadtentwicklung in Europa', 'Weltwirtschaft und Globalisierung', 'Digitalisierung verändert Raumstrukturen']
    },
    geschichte: {
      5: ['Frühe Kulturen und erste Hochkulturen', 'Griechische Poleis und Imperium Romanum', 'Lebenswelten im Mittelalter (Teil 1)'],
      7: ['Lebenswelten im Mittelalter (Teil 2)', 'Frühe Neuzeit – Um- und Aufbrüche', '„Sattelzeit“ ca. 1750–1870: Aufbruch in die Moderne', 'Imperialismus und Erster Weltkrieg', 'Die Weimarer Republik', 'Nationalsozialismus und Zweiter Weltkrieg'],
      10: ['Blockbildung und internationale Verflechtungen seit 1945', 'Deutsch-deutsche Beziehungen nach 1945']
    },
    informatik: {
      5: ['Wir präsentieren uns als Avatar', 'Von der Anweisung zum Algorithmus', 'Codierungen zum Austausch von Nachrichten', 'Automaten in unserer Lebenswelt'],
      6: ['Codierung und Verschlüsselung', 'Eigene Programme mit dem Calliope mini', 'Künstliche Intelligenz und maschinelles Lernen', 'Datenbewusstsein']
    }
  };
  // Welche Klassen eine Liste abdeckt (bei Fächern, deren Beispiel-Lehrplan Doppeljahrgänge nennt)
  const SPAN = { erdkunde: { 5: '5/6', 6: '5/6', 7: '7/8', 8: '7/8', 9: '9/10', 10: '9/10' }, geschichte: { 5: '5/6', 6: '5/6', 7: '7–9', 8: '7–9', 9: '7–9', 10: '10' } };
  const SPANKEY = { erdkunde: { 6: 5, 8: 7, 10: 9 }, geschichte: { 6: 5, 8: 7, 9: 7 } };

  /* Hinweise je Fach (aus den Kernlehrplänen bzw. Beispiel-Lehrplänen) */
  const NOTE = {
    franzoesisch: 'In G9 beginnt die zweite Fremdsprache in Klasse 7.',
    latein: 'In G9 beginnt die zweite Fremdsprache in Klasse 7 (an manchen Schulen Latein schon ab Klasse 5).',
    physik: 'Laut Kernlehrplan gehören Wärme, einfache Stromkreise, Schall und Licht in die Erprobungsstufe (im Beispiel-Lehrplan: Klasse 6).',
    biologie: 'Im Beispiel-Lehrplan des Landes wird Biologie in den Klassen 5, 6, 8 und 10 unterrichtet.',
    politik: 'Das Fach heißt in NRW seit 2019 „Wirtschaft-Politik“ und wird meist schon ab Klasse 5 unterrichtet.',
    informatik: 'Pflichtfach in Klasse 5/6 (seit 2021/22). In den Klassen 7–10 ist Informatik ein Wahlpflichtfach.',
    musik: 'Die App enthält bisher nur Inhalte bis Klasse 8, der Lehrplan reicht bis Klasse 10.',
    kunst: 'Die App enthält bisher nur Inhalte bis Klasse 8, der Lehrplan reicht bis Klasse 10.',
    religion: 'Zusammengefasst für evangelische und katholische Religionslehre; für Praktische Philosophie gelten eigene Fragenkreise.'
  };

  /* Häufig genutzte Schulbuch-Reihen als Vorschläge (Auswahl ohne Anspruch auf Vollständigkeit) */
  const BOOKS = {
    mathe: ['Lambacher Schweizer', 'Fundamente der Mathematik', 'Elemente der Mathematik', 'Mathematik Neue Wege'],
    deutsch: ['Deutschbuch', 'P.A.U.L. D.', 'deutsch.kompetent'],
    englisch: ['Green Line', 'Access', 'Camden Town'],
    franzoesisch: ['Découvertes', 'À plus !'],
    latein: ['Pontes', 'Cursus', 'prima', 'Adeamus!'],
    biologie: ['Natura', 'Biosphäre', 'Markl Biologie', 'bioskop'],
    physik: ['Impulse Physik', 'Fokus Physik', 'Dorn/Bader Physik', 'Spektrum Physik'],
    chemie: ['Elemente Chemie', 'Chemie heute', 'Fokus Chemie'],
    geschichte: ['Geschichte und Geschehen', 'Zeiten und Menschen', 'Forum Geschichte'],
    erdkunde: ['Terra', 'Diercke Praxis', 'Seydlitz'],
    politik: ['Politik & Co.', 'Team', 'Wirtschaft – Politik entdecken'],
    informatik: ['starkeSeiten Informatik', 'Informatik (Oldenbourg)'],
    musik: ['Musikbuch', 'Soundcheck', 'Spielpläne'],
    kunst: ['Kunst entdecken', 'Kammerlohr'],
    religion: ['Kursbuch Religion', 'Zeit der Freude', 'Leben gestalten']
  };

  const lpOf = t => {
    for (const [re, field, band, grades] of R[t.subject] || []) {
      if (grades && !grades.includes(t.grade0 || t.grade)) continue;
      if (re.test(t.id)) return { field, band: band || '' };
    }
    return null;
  };
  const uvOf = (subject, grade) => {
    const u = UV[subject]; if (!u) return null;
    const k = (SPANKEY[subject] || {})[grade] || grade;
    return u[k] ? { list: u[k], span: (SPAN[subject] || {})[grade] || String(grade) } : null;
  };

  /* Zweite Fremdsprache: In G9 beginnt sie in Klasse 7. Die Inhalte wurden ursprünglich ab Klasse 6 angelegt
     und werden hier um ein Jahr verschoben (die internen Schlüssel bleiben gleich, damit kein Fortschritt verloren geht). */
  LERN.topics.forEach(t => {
    if ((t.subject === 'franzoesisch' || t.subject === 'latein') && !t.g9) t.grade = Math.min(10, t.grade + 1);
    t.grade0 = t.grade;
  });

  LERN.lp = { lpOf, uvOf, note: NOTE, books: BOOKS, source: 'Kernlehrpläne Gymnasium Sek. I NRW (G9, ab 2019/20) und Beispiel-Lehrpläne des Landes (lehrplannavigator.nrw.de)' };
})();
