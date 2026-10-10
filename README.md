# LernQuest

Quiz-Lern-App für das Gymnasium in NRW (Klasse 5–10). Läuft komplett im Browser (PC, iPad, Smartphone), ohne Server und ohne Build-Schritt. Installierbar als PWA und offline nutzbar.

## Starten

- **Lokal:** `index.html` über einen beliebigen statischen Webserver ausliefern (Service Worker braucht http/https).
- **GitHub Pages:** Repo pushen → *Settings → Pages → Deploy from branch → main / root*. Die App ist dann unter `https://<user>.github.io/<repo>/` erreichbar.

## Funktionen

- Auswahl nach Fach → Klasse → Thema
- Quiz (8 Fragen, zufällige Antwortreihenfolge); bei jeder Antwort Erklärung plus Praxisbeispiel, bei falschen Antworten wird die richtige Lösung hervorgehoben
- Falsch beantwortete Fragen kommen später unbemerkt in andere Quizze desselben Fachs zurück, dazu gibt es den Modus „Wiederholen“
- Belohnungen: XP, Level, Tagesziel, Tage-Serie, 10 Abzeichen
- Freunde-Challenge: Quiz spielen, Link teilen, der Freund spielt dieselben Fragen und sieht dein Ergebnis. Die Duell-Bilanz wird lokal gespeichert.
- Alle Daten liegen im `localStorage` des Browsers

## Inhalte ergänzen

Neue Themen kommen in `data/*.js` (Format in `data/content.js`):

```js
LERN.add('mathe', 8, 'pythagoras', 'Satz des Pythagoras', [
  ['Frage', 'richtige Antwort', 'falsch 1', 'falsch 2', 'falsch 3', 'Erklärung', 'Praxisbeispiel'],
]);
```

Neue Dateien in `index.html` und in die Liste `FILES` in `sw.js` eintragen. Bei Änderungen `CACHE` in `sw.js` hochzählen. Neue Fächer ergänzt man in `LERN.subjects` (`soon: true` entfernen).

## Stand und Grenzen

- Prototyp mit 13 Themen / 77 Fragen in Mathe, Deutsch, Englisch, Biologie, Physik. Die übrigen Fächer sind als „bald verfügbar“ angelegt.
- Die Zuordnung zu Klassenstufen ist exemplarisch und sollte gegen den aktuellen Kernlehrplan NRW (G9) geprüft werden.
- Online-Rangliste und Konten brauchen später ein Backend (z. B. Supabase/Firebase). Die Challenge-Links funktionieren bewusst ohne.
