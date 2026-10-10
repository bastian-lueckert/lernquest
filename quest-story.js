/* Geschichte & Gegner für den Quest-Modus. {name} = Name der Heldin / des Helden, {mentor} = Begleiter. */
LERN.quest = {
  heroes: ['🧙', '🦸', '🧝', '🥷', '🧑‍🚀', '🦊', '🐉', '🤖'],
  arcs: {
    5: {
      world: 'Das Wissens-Tal', mentor: 'Eule Mina', vemoji: '🌫️', villain: 'Der Nebelfürst',
      prologue: ['Willkommen in Edukia, {name}! Dieses Tal war einmal das klügste Land der Welt – bis der Nebelfürst seinen grauen Nebel darüber legte. Seitdem haben alle ihr Wissen vergessen: Zahlen tanzen durcheinander, Wörter purzeln aus den Büchern.', '{mentor} landet auf deiner Schulter. „Nur du kannst helfen! In jedem Fach bewacht ein Gegner einen Wissenskristall. Besiege ihn mit deinem Können – dann leuchtet das Tal ein Stück heller.“', 'Sammle alle Kristalle, und der Nebelfürst muss sich dir zum Endkampf stellen. Bereit?'],
      bossIntro: 'Aus dem letzten Nebel erhebt sich der Nebelfürst. „Du hast meine Wächter besiegt, {name}? Dann beweise, dass du alles weißt!“',
      bossWin: 'Der Nebelfürst löst sich im Sonnenlicht auf. Die Kristalle fügen sich zusammen und das Wissens-Tal strahlt wieder!',
      bossLose: 'Der Nebelfürst lacht dunkel. „Noch nicht genug, kleiner Held!“ Du weichst zurück – übe noch einmal und kehre stärker wieder.',
      epilogue: '{mentor} jubelt: „Du hast Edukia gerettet, {name}! Aus allen Dörfern kommen die Menschen und danken dir. Du bist jetzt offiziell Hüterin oder Hüter des Wissens-Tals!“'
    },
    6: {
      world: 'Die Insel der verlorenen Bücher', mentor: 'Käpt\'n Kompass', vemoji: '🏴‍☠️', villain: 'Kapitän Vergessen',
      prologue: ['Ahoi, {name}! Dein Schiff läuft auf einer geheimnisvollen Insel auf Grund. Hier lag früher die größte Bibliothek der Welt – bis Kapitän Vergessen alle Bücher stahl und in seine Schatzhöhle sperrte.', '{mentor}, dein sprechender Kompass, dreht sich aufgeregt: „Auf der Insel bewacht in jedem Fach ein Wächter eine Schatzkarte. Wenn du alle Karten hast, findest du die Höhle des Kapitäns!“', 'Segel setzen – das Abenteuer beginnt!'],
      bossIntro: 'In der Höhle thront Kapitän Vergessen auf einem Berg aus Büchern. „Wer weiß schon alles? Beweise es, {name}!“',
      bossWin: 'Kapitän Vergessen kippt vom Bücherberg. Die Bücher fliegen zurück in die Regale – die Bibliothek ist gerettet!',
      bossLose: '„Hahaha, vergessen!“, ruft der Kapitän. Du rettest dich aus der Höhle – lerne noch ein bisschen und fordere ihn erneut heraus.',
      epilogue: '{mentor} dreht sich vor Freude im Kreis: „Die Insel gehört wieder den Büchern, {name}! Wo du auch segelst, alle kennen deinen Namen.“'
    },
    7: {
      world: 'Das Labyrinth der Rätsel', mentor: 'Fuchs Fidus', vemoji: '🌀', villain: 'Der Irrgarten-Meister',
      prologue: ['{name}, hier stimmt etwas nicht! Du bist in ein riesiges Labyrinth geraten, dessen Wände aus Aufgaben bestehen. Der Irrgarten-Meister hat den Ausgang verschlossen und lacht über jeden, der sich verirrt.', '{mentor}, ein schlauer Fuchs mit Laterne, führt dich: „In jedem Gang wartet ein Wächter mit einem Rätsel aus seinem Fach. Löse genug davon, dann öffnet sich die nächste Tür.“', 'Nimm die Laterne – und los!'],
      bossIntro: 'In der Mitte des Labyrinths wartet der Irrgarten-Meister. „Alle Wege führen zu mir, {name}. Löse mein letztes Rätsel!“',
      bossWin: 'Die Mauern des Labyrinths klappen auseinander wie ein Buch. Der Irrgarten-Meister verbeugt sich: „Du kennst den Weg.“',
      bossLose: 'Die Mauern verschieben sich, du stehst wieder am Eingang. „Übe noch ein wenig, {name}“, sagt {mentor}.',
      epilogue: 'Frische Luft! {mentor} wedelt mit dem Schwanz: „Du hast den Ausgang gefunden, {name}. Ab jetzt gehören dir alle Rätsel dieser Welt.“'
    },
    8: {
      world: 'Die Akademie der Schatten', mentor: 'Roboter Robi', vemoji: '🎭', villain: 'Professor Chaos',
      prologue: ['Es ist Mitternacht in der geheimen Akademie, {name}. Professor Chaos hat die Lehrpläne durcheinandergewürfelt: Formeln verwandeln sich in Fabelwesen, Jahreszahlen laufen davon.', '{mentor}, dein kleiner Helfer-Roboter, piept: „Unsere Mission: In jedem Fach steht ein Schatten-Dozent. Besiege sie mit Wissen, dann ordnen sich die Lehrpläne wieder.“', 'Das Klassenzimmer der Wahrheit wartet auf dich.'],
      bossIntro: 'Professor Chaos tritt aus dem Schatten. „Kluge Köpfe, {name}? Zeig mir, dass du Ordnung ins Chaos bringst!“',
      bossWin: 'Der Professor wirft seinen Hut in die Luft und lacht erleichtert. Die Akademie ist wieder in Ordnung!',
      bossLose: 'Das Chaos wirbelt dich durcheinander. „Sortiere dein Wissen neu“, piept {mentor}. „Dann versuchen wir es nochmal.“',
      epilogue: '{mentor} spielt eine Fanfare: „Die Akademie strahlt, {name}! Du bekommst den Ehrentitel Meisterschüler:in der Schatten.“'
    },
    9: {
      world: 'Die Zeitmaschine von Chronos', mentor: 'Chronia, die Zeitwächterin', vemoji: '⏳', villain: 'Der Zeitdieb',
      prologue: ['Ein Blitz, ein Rauschen – und {name} steht in der Halle von Chronos! Der Zeitdieb hat die Zeitmaschine gestohlen, und ohne sie geraten Gegenwart und Vergangenheit durcheinander.', '{mentor} reicht dir ein leuchtendes Amulett: „Auf deiner Reise durch die Zeitalter wartet in jedem Fach ein Hüter. Besiege sie, dann bekommst du die Bauteile der Maschine zurück.“', 'Die Uhr tickt. Wie viel Wissen hast du dabei?'],
      bossIntro: 'Der Zeitdieb erscheint zwischen den Sekunden. „Zu spät, {name}! Die Zeit gehört mir – es sei denn, du weißt mehr als ich.“',
      bossWin: 'Die Zeitmaschine springt wieder an. Der Zeitdieb stolpert in eine Sekunde, aus der er nie wieder herausfindet. Die Zeit ist gerettet!',
      bossLose: 'Der Zeitdieb dreht die Uhr zurück – du stehst wieder am Anfang des Kampfes. „Lerne mehr, {name}“, mahnt {mentor}.',
      epilogue: '{mentor} lächelt: „Ohne dich wäre die Zeit stehen geblieben, {name}. Du bist jetzt Zeitwächter:in ehrenhalber.“'
    },
    10: {
      world: 'Der Gipfel der Meister', mentor: 'Meister Lumen', vemoji: '👑', villain: 'Der Schattenkönig',
      prologue: ['Der letzte Aufstieg beginnt, {name}. Auf dem Gipfel der Meister thront der Schattenkönig und hat das Licht der Weisheit gelöscht. Nur wer auf dem Weg nach oben alle Prüfungen besteht, kann es wieder entzünden.', '{mentor}, ein uralter Lehrmeister mit leuchtendem Stab, nickt dir zu: „Jedes Fach ist eine Etappe, jeder Wächter eine Prüfung. Ich glaube an dich – du hast schon so viel gelernt.“', 'Atme tief durch. Der Gipfel wartet.'],
      bossIntro: 'Der Schattenkönig blickt auf dich herab. „Du wagst dich bis hierher, {name}? Dann zeige, was in dir steckt!“',
      bossWin: 'Das Licht der Weisheit flammt auf. Der Schattenkönig zerfällt zu Staub, und die Sonne geht über dem Gipfel auf!',
      bossLose: 'Der Schattenkönig lacht. „Noch nicht!“ Du trittst den Rückweg an – mit neuem Mut für den nächsten Versuch.',
      epilogue: '{mentor} streckt den Stab in den Himmel: „Du hast es geschafft, {name}! Du hast bewiesen, dass Wissen stärker ist als jede Dunkelheit. Auf zu neuen Gipfeln!“'
    }
  },
  /* Gegner je Fach: [Ort, Gegner, Emoji, Begrüßung, Sieg, Niederlage, Kristall] */
  enc: {
    mathe: ['Die Zahlenschlucht', 'Der Rechenriese', '🧌', 'Der Rechenriese versperrt die Brücke und brüllt: „Nur wer richtig rechnet, darf vorbei!“', 'Der Riese rechnet nach, stolpert über sein eigenes Ergebnis – und die Brücke ist frei!', 'Der Riese lacht dröhnend: „Rechne nochmal nach!“ Du ziehst dich zurück und übst.', 'Kristall der Zahlen'],
    deutsch: ['Der Wortwald', 'Der Satzdrache', '🐉', 'Im Wortwald faucht ein Drache aus Buchstaben: „Wer meine Sätze nicht versteht, kommt nicht durch!“', 'Der Drache faucht ein letztes „Punkt.“ und löst sich in Buchstabenstaub auf.', 'Der Drache wirbelt die Wörter durcheinander. Du brauchst noch etwas Übung.', 'Kristall der Sprache'],
    englisch: ['Der Hafen von London', 'Der Piraten-Papagei', '🦜', 'Ein Papagei kreischt: „Say it in English or walk the plank!“', '„Well done!“, krächzt der Papagei und öffnet dir das Tor.', '„Nope!“, kreischt der Papagei. Zeit für Vokabeln!', 'Kristall der Sprachen'],
    biologie: ['Der Urwald des Lebens', 'Der Riesenpilz', '🍄', 'Ein Riesenpilz stäubt Sporen: „Kennst du die Geheimnisse des Lebens?“', 'Der Pilz schrumpft zufrieden und gibt den Weg frei.', 'Die Sporen vernebeln dir die Sinne. Lies nochmal nach!', 'Kristall des Lebens'],
    physik: ['Das Labor der Kräfte', 'Der Blitzgolem', '⚡', 'Ein Golem aus Blitzen knistert: „Nur wer die Naturgesetze kennt, wird nicht geschockt!“', 'Du erdest den Golem – er verpufft in einem Funkenregen.', 'Der Golem gibt dir einen kleinen Schlag. Übe die Formeln noch einmal!', 'Kristall der Kräfte'],
    chemie: ['Die Alchemistenküche', 'Der Blubber-Schleim', '🧪', 'Aus einem Kessel steigt ein blubbernder Schleim: „Mische richtig – oder ich explodiere!“', 'Du mischst genau das Richtige. Der Schleim wird zu klarem Wasser.', 'Es zischt und stinkt. Das war die falsche Mischung – nochmal lernen!', 'Kristall der Elemente'],
    geschichte: ['Das Zeitmuseum', 'Der Wächter-Ritter', '🛡️', 'Ein verwunschener Ritter versperrt die Halle der Jahrhunderte: „Wer die Vergangenheit nicht kennt, kommt nicht weiter!“', 'Der Ritter verbeugt sich und öffnet das Tor in die Zukunft.', 'Der Ritter schüttelt den Helm: „Studiere die Geschichte noch einmal.“', 'Kristall der Zeit'],
    erdkunde: ['Der Kartenberg', 'Der Gipfel-Yeti', '🏔️', 'Ein Yeti brüllt vom Kartenberg: „Nur wer sich orientieren kann, findet den Weg!“', 'Der Yeti zeigt dir lächelnd den Pfad über den Gipfel.', 'Du hast dich verlaufen, und der Yeti lacht. Schau nochmal in den Atlas!', 'Kristall der Erde'],
    informatik: ['Die Bit-Stadt', 'Der Bug-Roboter', '🤖', 'Ein defekter Roboter piept: „Fehler! Fehler! Nur eine gute Programmiererin oder ein guter Programmierer kann mich reparieren!“', 'Du findest den Fehler – der Roboter piept fröhlich und lässt dich passieren.', 'Der Roboter stürzt ab und startet neu. Übe noch ein bisschen Logik!', 'Kristall des Codes'],
    politik: ['Das Rathaus der Stimmen', 'Der Schatten-Redner', '🎤', 'Ein Schatten-Redner schwätzt unaufhörlich: „Nur wer Argumente kennt, kann mich überstimmen!“', 'Mit klugen Argumenten gewinnst du die Abstimmung. Der Redner verstummt.', 'Du verlierst die Abstimmung. Informiere dich nochmal!', 'Kristall der Mitbestimmung'],
    franzoesisch: ['Das Café an der Seine', 'Der Croissant-Geist', '🥐', 'Ein Geist mit Baguette-Hut flüstert: „Parle français, ou tu ne passeras pas!“', '„Magnifique!“, ruft der Geist und weht dir ein Croissant zu.', '„Ah non!“ Der Geist verschwindet kopfschüttelnd. Übe Vokabeln!', 'Kristall der Eleganz'],
    latein: ['Das Forum Romanum', 'Der Legionärsgeist', '🏛️', 'Ein römischer Geist hebt den Speer: „Veni, vidi, vici – aber du erst nach meiner Prüfung!“', '„Bene!“ Der Geist salutiert und lässt dich durch.', '„Male!“ Der Geist schüttelt den Kopf. Vokabeln und Formen nochmal lernen!', 'Kristall des Altertums'],
    musik: ['Der Konzertsaal', 'Das Lärm-Gespenst', '👻', 'Ein Gespenst ohne Taktgefühl lärmt: „Nur wer den Rhythmus kennt, bringt mich zum Schweigen!“', 'Du gibst den Takt vor – das Gespenst tanzt und verschwindet in einer Melodie.', 'Das Gespenst kreischt falsch. Übe nochmal Noten und Begriffe!', 'Kristall der Klänge'],
    kunst: ['Die Galerie der Farben', 'Das Farbklecks-Monster', '🎨', 'Ein Klecksmonster spritzt Farbe: „Erkenne die Kunst, sonst male ich dich an!“', 'Du mischst die richtige Farbe – das Monster wird zu einem schönen Bild.', 'Du wirst bunt bespritzt. Lerne noch ein paar Künstler und Begriffe!', 'Kristall der Farben'],
    religion: ['Der Garten der Fragen', 'Die Weisheits-Sphinx', '🦁', 'Eine Sphinx stellt Fragen über Glauben und Werte: „Wer weise ist, darf eintreten.“', 'Die Sphinx lächelt und öffnet das Tor zum Garten.', 'Die Sphinx schweigt nachdenklich. Denke noch einmal darüber nach!', 'Kristall der Weisheit']
  }
};
