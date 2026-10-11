# LernQuest

Quiz-Lern-App für das Gymnasium in NRW (Klasse 5–10). Läuft komplett im Browser (PC, iPad, Smartphone), ohne Server und ohne Build-Schritt. Installierbar als PWA und offline nutzbar.

**Live:** https://bastian-lueckert.github.io/lernquest/

## Funktionen

- **Klassenfilter:** Zuerst Klasse wählen, dann werden nur die passenden Fächer und Themen angezeigt.
- **Quiz** mit Erklärung und Praxisbeispiel zu jeder Frage; falsche Antworten kommen unbemerkt später zurück („Wiederholen“).
- **Anwenden** (✍️ pro Thema, „Anwendungs-Mix“ pro Fach): Aufgaben ohne Auswahlmöglichkeiten.
  - *Selbst schreiben:* Vokabeln, Fachbegriffe, Jahreszahlen, Hauptstädte, Verbformen … Kleine Tippfehler werden je nach Fach verziehen, fehlende französische Akzente angemerkt, bei Personen genügt der Nachname.
  - *Lückentexte* zur Grammatik in Englisch, Deutsch, Französisch und Latein.
  - *Zuordnen* (Begriff ↔ Bedeutung) und *Reihenfolge* (Ereignisse nach Zeit, Brüche nach Größe).
  - *Sachaufgaben* in Mathe, Physik und Chemie (Einkauf, Tarife vergleichen, Leiter an der Wand, Stromkosten …).
- **Probetests:** Fach, Kategorien (auch nach Schulbuch-Kapitel) und Länge wählen, auf Wunsch mit Anwendungsaufgaben. Am Ende gibt es eine Schulnote (1–6), die Auswertung nach Bereichen, die Erklärung aller Fehler und einen **Übungsplan**.
- **Rechentraining** (Mathe, Physik, Chemie): zufällig erzeugte Aufgaben, die automatisch geprüft werden. Bei Fehlern wird der Rechenweg Schritt für Schritt erklärt. Mit **Zahlentastatur** (Ziffern, Komma, Minus, Bruchstrich als Buttons).
- **Lehrplan & Schulbuch:** Jedes Thema zeigt das zugehörige Inhaltsfeld des Kernlehrplans NRW. Pro Fach lässt sich das eigene Schulbuch eintragen und pro Thema das Kapitel oder die Seite – die Themen stehen dann in Buch-Reihenfolge. Themen, die die eigene Schule in einem anderen Jahr behandelt, kann man in die eigene Klasse holen.
- **Lernzettel zum Ausdrucken** (pro Thema oder pro Fach) mit Merkbild bzw. Vokabelliste.
- **Merkbilder:** selbst erzeugte SVG-Grafiken zu vielen Themen; für alle anderen Themen eine Schlüsselbegriff-Grafik.
- **Report:** Trefferquote nach Fach und Thema, Schwachstellen, Probetest-Verlauf.
- **Eigene Themen** im Editor (einzeln oder per Schnell-Import) und **eigene Vokabellisten** („deutsch = Fremdsprache“, eine pro Zeile): Aus einer Liste entstehen Quiz, Aufgaben zum Selbstschreiben und Zuordnungen. Lokal gespeichert, Export/Import als Datei.
- **Tipp vor der Lösung:** Bei Rechenaufgaben lassen sich die Rechenschritte einzeln aufdecken, beim Selbstschreiben Anfangsbuchstabe und Wortanfang (nicht im Probetest).
- **Quest-Modus** pro Klasse mit durchgehender Geschichte: Jedes Fach hat einen Gegner und **drei Stufen** (1: Auswahlfragen, 2: zur Hälfte Anwendungsaufgaben, 3: Meisterprüfung). Für jede Stufe gibt es einen Stern und ein **Sammelstück** (Kristall, Ausrüstung, Begleiter). **Joker** und **Heiltränke** helfen im Kampf. Zwischenkapitel, Chronik zum Nachlesen und ein geheimes Ende für alle Sterne.
- **Belohnungen** (XP, Level, Tagesziel, Serie, Abzeichen) und **Freunde-Challenge** per Link.
- **Hell/Dunkel-Schalter** oben rechts (ohne eigene Wahl folgt die App dem Gerät).

## Starten / Veröffentlichen

- Lokal: einen beliebigen statischen Webserver auf diesen Ordner richten (der Service Worker braucht http/https).
- GitHub Pages: *Settings → Pages → Deploy from branch → main / root*.

## Inhalte erweitern

Dateien in `data/`. Nach dem Anlegen einer neuen Datei einmal `sh tools/sync-files.sh` ausführen (trägt sie in `index.html` und `sw.js` ein) und in `sw.js` den `CACHE`-Namen hochzählen.

```js
// einzelne Frage: [Frage, richtig, falsch1, falsch2, falsch3, Erklärung, Beispiel]
LERN.add('mathe', 8, 'thema-id', 'Titel', [ ['Frage?', 'richtig', 'f1', 'f2', 'f3', 'Erklärung', 'Beispiel'] ]);

// viele Fragen aus Begriffspaaren (je Paar eine oder zwei Fragen, falsche Antworten automatisch).
// Daraus entstehen auch Tipp- und Zuordnungsaufgaben; mit order: 'zeit' | 'groesse' zusätzlich Reihenfolge-Aufgaben.
LERN.pairs('biologie', 7, 'zelle', 'Zelle: Begriffe', LERN.T.term, LERN.P('Zellkern=enthält die Erbinformation;Mitochondrium=Kraftwerk der Zelle'));

// Rechtschreibung: erste Variante ist die richtige
LERN.spell('deutsch', 6, 'spell', 'Rechtschreibung', 'Bibliothek>Biblitohek>Bibliotek>Bibliothehk;…');

// Lückentext: [Satz mit ___, richtig (Alternativen mit |), falsch1, falsch2, falsch3, Erklärung]
LERN.cloze('englisch', 6, 'luecken', 'Lückentexte', [ ['Yesterday we ___ (to go) to the zoo.', 'went', 'goed', 'gone', 'go', 'go – went – gone'] ]);
```

Weitere Dateien: `gen.js` (Rechen- und Sachaufgaben), `diagrams.js` (Merkbilder, Schlüssel = Themen-Key), `apply.js` (Prüfen getippter Antworten, Zuordnen, Reihenfolge), `lehrplan.js` (Inhaltsfelder, Beispiel-Unterrichtsvorhaben, Schulbuch-Vorschläge), `quest-story.js` (Geschichte, Gegner, Sammelstücke).

## Lehrplanbezug

- Quelle: Kernlehrpläne für das Gymnasium Sek. I in NRW (G9, ab 2019/20) und die „Beispiele für einen schulinternen Lehrplan“ des Landes (lehrplannavigator.nrw.de).
- Verbindlich sind nur die **Inhaltsfelder** und die Trennung Klasse 5/6 ↔ 7–10. In welcher Klasse ein Thema drankommt, legt jede Schule selbst fest. Die Klassen-Einteilung der App ist deshalb ein Vorschlag und lässt sich pro Thema ändern (⚙️).
- Französisch und Latein beginnen in der App in Klasse 7 (zweite Fremdsprache in G9).
- Bekannte Abweichungen vom Kernlehrplan: Physik beginnt laut Kernlehrplan in der Erprobungsstufe (Wärme, Schall, Licht, einfache Stromkreise), in der App erst in Klasse 7; Zelle und Blutkreislauf (Biologie) gehören zur Erprobungsstufe; Wirtschaft-Politik gibt es meist schon ab Klasse 5; Musik und Kunst reichen bis Klasse 10, die App hat Inhalte bis Klasse 8. Die App weist bei den betroffenen Themen darauf hin.
- **Schulbuch-Kapitel** kennt die App nicht von sich aus – Kapitelnummern unterscheiden sich je Verlag, Ausgabe und Auflage. Sie werden deshalb einmal von Hand eingetragen.

## Stand und Grenzen

- Rund 10 700 Fragen in 15 Fächern, 330 Themen. Für jedes Fach und jede Klasse, in der es Inhalte gibt, sind es mindestens 100 Fragen. Etwa 5 700 Fragen lassen sich auch selbst schreiben; dazu kommen 164 Lückentext-Sätze und 65 Rechengeneratoren (davon 16 Sachaufgaben).
- Die Anwendungsaufgaben prüfen Wissen und einfache Anwendung. Längere Texte, Begründungen und Aufsätze kann die App nicht bewerten.
- Die Inhalte wurden KI-gestützt erstellt und nicht von Lehrkräften geprüft. Bitte stichprobenartig fachlich gegenlesen.
- Die Schulnote im Probetest folgt einem üblichen Richtwert (ab 92 % = 1 … unter 30 % = 6). Schulen können abweichen.
- Online-Rangliste und Konten brauchen später ein Backend. Die Challenge-Links funktionieren bewusst ohne.
