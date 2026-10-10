# LernQuest

Quiz-Lern-App für das Gymnasium in NRW (Klasse 5–10). Läuft komplett im Browser (PC, iPad, Smartphone), ohne Server und ohne Build-Schritt. Installierbar als PWA und offline nutzbar.

**Live:** https://bastian-lueckert.github.io/lernquest/

## Funktionen

- **Klassenfilter:** Zuerst Klasse wählen, dann werden nur die passenden Fächer und Themen angezeigt.
- **Quiz** mit Erklärung und Praxisbeispiel zu jeder Frage; falsche Antworten kommen unbemerkt später zurück („Wiederholen“).
- **Probetests:** Fach, Kategorien und Länge wählen. Am Ende gibt es eine Schulnote (1–6), die Auswertung nach Bereichen, die Erklärung aller Fehler und einen **Übungsplan**.
- **Rechentraining** (Mathe, Physik, Chemie): zufällig erzeugte Aufgaben, die automatisch geprüft werden. Bei Fehlern wird der Rechenweg Schritt für Schritt erklärt.
- **Lernzettel zum Ausdrucken** (pro Thema oder pro Fach) mit Merkbild bzw. Vokabelliste.
- **Merkbilder:** selbst erzeugte SVG-Grafiken zu vielen Themen (Diagramme, Zeitleisten, Schaltbilder, Zellen …); für alle anderen Themen eine Schlüsselbegriff-Grafik.
- **Report:** Trefferquote nach Fach und Thema, Schwachstellen, Probetest-Verlauf.
- **Eigene Themen** im Editor (einzeln oder per Schnell-Import), lokal gespeichert, Export/Import als Datei.
- **Zahlentastatur** bei allen Rechenaufgaben: Ziffern, Komma, Minus und Bruchstrich als Buttons (am Handy ohne System-Tastatur).
- **Quest-Modus** pro Klasse: Du wählst einen Charakter und kämpfst dich mit einer Story durch alle Fächer. Pro Fach ein Gegner (Quiz, mindestens 70 % richtig), am Ende ein Endkampf (80 %).
- **Belohnungen** (XP, Level, Tagesziel, Serie, Abzeichen) und **Freunde-Challenge** per Link.

## Starten / Veröffentlichen

- Lokal: einen beliebigen statischen Webserver auf diesen Ordner richten (der Service Worker braucht http/https).
- GitHub Pages: *Settings → Pages → Deploy from branch → main / root*.

## Inhalte erweitern

Dateien in `data/`. Nach dem Anlegen einer neuen Datei einmal `sh tools/sync-files.sh` ausführen (trägt sie in `index.html` und `sw.js` ein) und in `sw.js` den `CACHE`-Namen hochzählen.

```js
// einzelne Frage: [Frage, richtig, falsch1, falsch2, falsch3, Erklärung, Beispiel]
LERN.add('mathe', 8, 'thema-id', 'Titel', [ ['Frage?', 'richtig', 'f1', 'f2', 'f3', 'Erklärung', 'Beispiel'] ]);

// viele Fragen aus Begriffspaaren (je Paar eine oder zwei Fragen, falsche Antworten automatisch)
LERN.pairs('biologie', 7, 'zelle', 'Zelle: Begriffe', LERN.T.term, LERN.P('Zellkern=enthält die Erbinformation;Mitochondrium=Kraftwerk der Zelle'));

// Rechtschreibung: erste Variante ist die richtige
LERN.spell('deutsch', 6, 'spell', 'Rechtschreibung', 'Bibliothek>Biblitohek>Bibliotek>Bibliothehk;…');
```

Rechengeneratoren stehen in `gen.js`, Merkbilder in `diagrams.js` (Schlüssel = Themen-Key).

## Stand und Grenzen

- Rund 10 500 Fragen in 15 Fächern, 300+ Themen. Für jedes Fach und jede Klasse, in der es unterrichtet wird, gibt es mindestens 100 Fragen. Außerdem ca. 50 Rechengeneratoren.
- Nicht in allen Klassen gibt es jedes Fach (Physik/Chemie ab Klasse 7, Politik ab 7, Musik/Kunst bis Klasse 8, Latein/Französisch ab 6). Die Zuordnung ist nicht gegen den Kernlehrplan NRW (G9) geprüft.
- Viele Fragen sind Begriffs- und Vokabelfragen („Was bedeutet …?“). Sie trainieren Wissen, ersetzen aber keine Aufgaben zum Anwenden und Begründen.
- Die Inhalte wurden KI-gestützt erstellt und nicht von Lehrkräften geprüft. Bitte stichprobenartig fachlich gegenlesen.
- Die Schulnote im Probetest folgt einem üblichen Richtwert (ab 92 % = 1 … unter 30 % = 6). Schulen können abweichen.
- Online-Rangliste und Konten brauchen später ein Backend. Die Challenge-Links funktionieren bewusst ohne.
