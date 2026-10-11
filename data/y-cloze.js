/* Lückentexte: Im Quiz als Auswahl, unter „Anwenden“ zum Selbst-Eintippen.
   Zeile: [Satz mit ___, richtig (Alternativen mit |), falsch1, falsch2, falsch3, Erklärung, tippbar? (0 = nur Auswahl), Modus ('exact' = Groß-/Kleinschreibung zählt)]
   Französisch und Latein sind bereits nach G9 eingeordnet (Beginn in Klasse 7). */
(() => {
  const C = LERN.cloze, N = 'Lückentexte: Grammatik anwenden';

  /* ================= ENGLISCH ================= */
  C('englisch', 5, 'luecken', N, [
    ['My sister ___ (to be) eleven years old.', 'is', 'are', 'am', 'be', 'Bei he/she/it heißt die Form von „to be“: is.'],
    ['Tom and I ___ (to be) in class 5b.', 'are', 'is', 'am', 'be', '„Tom and I“ = we → we are.'],
    ['She ___ (to play) football every Saturday.', 'plays', 'play', 'playing', 'is play', 'Simple present: Bei he/she/it muss das „s“ mit.'],
    ['___ you like pizza? – Yes, I do.', 'Do', 'Does', 'Are', 'Is', 'Fragen im simple present bildet man mit do (I/you/we/they) oder does (he/she/it).'],
    ['He ___ (not / to like) spinach.', "doesn't like|does not like", "don't like", "isn't like", 'not likes', 'Verneinung bei he/she/it: doesn’t + Grundform.'],
    ['There ___ two books on the table.', 'are', 'is', 'be', 'has', 'Mehrzahl: there are. Einzahl: there is.'],
    ['I have got two ___ (child).', 'children', 'childs', 'childrens', 'childes', 'Unregelmäßiger Plural: one child – two children.'],
    ['This is Emma. ___ bike is red.', 'Her', 'His', 'She', 'Hers', 'Besitz bei einem Mädchen: her (ihr). his = sein.'],
    ["I ___ swim, but I can't dive.", 'can', 'can to', 'cans', 'am', 'can bleibt in allen Personen gleich; danach steht die Grundform ohne „to“.'],
    ["The lesson starts ___ eight o'clock.", 'at', 'on', 'in', 'to', 'Uhrzeiten stehen mit at: at eight o’clock.']
  ]);
  C('englisch', 6, 'luecken', N, [
    ['Yesterday we ___ (to go) to the zoo.', 'went', 'goed', 'gone', 'go', 'Unregelmäßiges Verb: go – went – gone. Mit „yesterday“ steht das simple past.'],
    ['Look! The dog ___ (to run) after the cat.', 'is running', 'runs', 'run', 'running', 'Was gerade jetzt passiert (Look!), steht im present progressive: is + -ing. Achtung: running mit Doppel-n.'],
    ['Last week I ___ (to buy) a new game.', 'bought', 'buyed', 'buy', 'have bought', 'buy – bought – bought. „Last week“ verlangt das simple past.'],
    ['An elephant is ___ (big) than a horse.', 'bigger', 'more big', 'biger', 'biggest', 'Kurze Adjektive steigert man mit -er; nach kurzem Vokal wird der Konsonant verdoppelt: bigger.'],
    ['This is the ___ (good) film of the year.', 'best', 'goodest', 'better', 'most good', 'good – better – best (unregelmäßig).'],
    ["___ you see Tom yesterday? – No, I didn't.", 'Did', 'Do', 'Were', 'Have', 'Fragen im simple past bildet man mit did + Grundform.'],
    ["We haven't got ___ milk. Can you buy some?", 'any', 'some', 'many', 'a', 'In verneinten Sätzen steht meistens any, in bejahten some.'],
    ['How ___ apples do we need?', 'many', 'much', 'lot', 'any', 'many bei zählbaren Dingen (apples), much bei nicht zählbaren (water).'],
    ['I ___ (to be) at home last night.', 'was', 'were', 'am', 'been', 'Simple past von to be: I/he/she/it was, you/we/they were.'],
    ['She sings very ___ (beautiful).', 'beautifully', 'beautiful', 'beautifuly', 'more beautiful', 'Adverbien der Art und Weise bildet man mit -ly: beautiful → beautifully.']
  ]);
  C('englisch', 7, 'luecken', N, [
    ['I have never ___ (to be) to London.', 'been', 'was', 'be', 'were', 'Present perfect: have + past participle. be – was/were – been.'],
    ['She has ___ (to write) three e-mails today.', 'written', 'wrote', 'writed', 'writing', 'write – wrote – written.'],
    ['We have lived here ___ 2019.', 'since', 'for', 'ago', 'from', 'since + Zeitpunkt (since 2019), for + Zeitraum (for five years).'],
    ['If it rains tomorrow, we ___ (to stay) at home.', 'will stay', 'stay', 'would stay', 'stayed', 'If-Satz Typ I: if + simple present, im Hauptsatz will-future.'],
    ['The girl ___ lives next door is my friend.', 'who|that', 'which', 'whose', 'what', 'who (oder that) für Personen, which für Dinge.'],
    ['You are from Spain, ___ you?', "aren't", "don't", "isn't", 'are', 'Question tag: positiver Satz → verneintes Anhängsel mit demselben Hilfsverb.'],
    ['I think it ___ (to snow) tomorrow.', 'will snow', 'snows', 'is snow', 'snowed', 'Vorhersagen und Vermutungen stehen im will-future.'],
    ['Last year I ___ to wear a school uniform. (müssen)', 'had', 'must', 'musted', 'have', 'must hat keine Vergangenheitsform – man nimmt had to.'],
    ['This is the book ___ I bought yesterday.', 'which|that', 'who', 'whose', 'where', 'which oder that für Dinge.'],
    ['Have you ___ (to finish) your homework yet?', 'finished', 'finish', 'finishing', 'finishes', 'Present perfect: have + past participle (regelmäßig: -ed).']
  ]);
  C('englisch', 8, 'luecken', N, [
    ['The Eiffel Tower ___ (to build) in 1889.', 'was built', 'built', 'is built', 'has built', 'Passiv im simple past: was/were + past participle.'],
    ['If I ___ (to have) more money, I would buy a new phone.', 'had', 'have', 'would have', 'has', 'If-Satz Typ II: if + simple past, im Hauptsatz would + Grundform.'],
    ['If I were you, I ___ (to talk) to her.', 'would talk', 'will talk', 'talked', 'talk', 'Typ II: Im Hauptsatz steht would + Grundform.'],
    ['English ___ (to speak) all over the world.', 'is spoken', 'speaks', 'is speaking', 'spoke', 'Passiv im simple present: am/is/are + past participle.'],
    ['When we arrived, the film had already ___ (to start).', 'started', 'start', 'starts', 'starting', 'Past perfect: had + past participle – für das, was vorher schon passiert war.'],
    ['I enjoy ___ (to read) comics.', 'reading', 'to read', 'read', 'reads', 'Nach enjoy steht das Gerund (-ing-Form).'],
    ['She is good at ___ (to draw).', 'drawing', 'draw', 'to draw', 'draws', 'Nach Präpositionen (at, in, of …) steht das Gerund.'],
    ['He hurt ___ when he fell off his bike.', 'himself', 'him', 'hisself', 'he', 'Reflexivpronomen: he → himself.'],
    ['Tom said that he ___ (to be) tired.', 'was', 'is', 'were', 'has been', 'Indirekte Rede: Nach said rückt die Zeit eine Stufe zurück (is → was).'],
    ["I'm looking forward to ___ (to see) you.", 'seeing', 'see', 'saw', 'seen', 'look forward to + -ing: „to“ ist hier eine Präposition.']
  ]);
  C('englisch', 9, 'luecken', N, [
    ['If I had studied harder, I ___ have passed the test.', 'would', 'will', 'had', 'did', 'If-Satz Typ III: if + past perfect, im Hauptsatz would have + past participle.'],
    ['If she had known, she would have ___ (to come).', 'come', 'came', 'comes', 'coming', 'come – came – come: Nach would have steht das past participle.'],
    ['She asked me where I ___ (to live).', 'lived', 'live', 'do live', 'am living', 'Indirekte Frage: Die Zeit rückt zurück, es gibt keine Umschreibung mit do.'],
    ['The bridge is being ___ (to repair) at the moment.', 'repaired', 'repair', 'repairing', 'repairs', 'Passiv in der Verlaufsform: is being + past participle.'],
    ['My parents want me ___ (to study) medicine.', 'to study', 'study', 'studying', 'that I study', 'want + Objekt + to-Infinitiv – kein that-Satz wie im Deutschen.'],
    ['He told us ___ (not / to be) late.', 'not to be', "don't be", 'not be', 'not being', 'Verneinter Infinitiv: not to + Grundform.'],
    ['___ it was raining, we went for a walk.', 'Although|Though|Even though', 'Because', 'Despite', 'However', 'although = obwohl. despite steht nur vor einem Nomen oder Gerund.'],
    ['The man ___ car was stolen called the police.', 'whose', 'who', 'which', "who's", 'whose = dessen/deren.'],
    ['I wish I ___ (to have) more time.', 'had', 'have', 'would have', 'has', 'Nach I wish steht das simple past für einen Wunsch in der Gegenwart.'],
    ['By the time we got there, the train had already ___ (to leave).', 'left', 'leave', 'leaved', 'leaving', 'leave – left – left. Past perfect: had + past participle.']
  ]);
  C('englisch', 10, 'luecken', N, [
    ['By next June I will have ___ (to finish) school.', 'finished', 'finish', 'finishing', 'finishes', 'Future perfect: will have + past participle.'],
    ['___ (to walk) through the park, I met an old friend.', 'Walking', 'Walked', 'Walk', 'To walk', 'Partizipialsatz: Das present participle ersetzt „While I was walking“.'],
    ['Not only ___ he sing, he also plays the guitar.', 'does', 'do', 'is', 'has', 'Nach „Not only“ am Satzanfang folgt Inversion: Hilfsverb vor Subjekt.'],
    ['The film, ___ was directed by Christopher Nolan, won several awards.', 'which', 'that', 'who', 'what', 'In nicht notwendigen Relativsätzen (mit Kommas) steht which, nicht that.'],
    ['She is used to ___ (to get) up early.', 'getting', 'get', 'got', 'gets', 'be used to + -ing = an etwas gewöhnt sein.'],
    ['I used to ___ (to play) tennis when I was a child.', 'play', 'playing', 'played', 'plays', 'used to + Grundform = etwas früher regelmäßig getan haben.'],
    ['He denied ___ (to take) the money.', 'taking|having taken', 'to take', 'take', 'took', 'Nach deny steht das Gerund.'],
    ['___ the bad weather, the match took place.', 'Despite|In spite of', 'Although', 'However', 'Because', 'despite + Nomen = trotz; although leitet einen Nebensatz ein.'],
    ['It is high time we ___ (to leave).', 'left', 'leave', 'will leave', 'are leaving', 'Nach „it is (high) time“ steht das simple past.'],
    ['Hardly had I arrived ___ the phone rang.', 'when', 'than', 'that', 'then', 'hardly … when, aber: no sooner … than.']
  ]);

  /* ================= DEUTSCH ================= */
  C('deutsch', 5, 'luecken', N, [
    ['Gestern ___ (gehen, Präteritum) wir ins Schwimmbad.', 'gingen', 'gehen', 'gegangen', 'gingten', 'Präteritum von gehen: wir gingen.'],
    ['Ich helfe ___ (der Nachbar).', 'dem Nachbarn', 'den Nachbarn', 'der Nachbar', 'des Nachbarn', 'helfen verlangt den Dativ (Wem?). „Nachbar“ bekommt im Dativ ein -n.'],
    ['Das ist das Fahrrad ___ (mein Bruder).', 'meines Bruders', 'meinem Bruder', 'mein Bruder', 'meinen Bruder', 'Wessen Fahrrad? → Genitiv: meines Bruders.'],
    ['Der Hund ist ___ (groß) als die Katze.', 'größer', 'großer', 'mehr groß', 'am größten', 'Vergleichsstufe (Komparativ) mit -er, oft mit Umlaut: groß – größer – am größten.'],
    ['In unserem Garten stehen drei ___ (Baum).', 'Bäume', 'Baums', 'Bäumen', 'Baume', 'Plural im Nominativ: die Bäume.'],
    ['Morgen ___ (werden) ich meine Oma besuchen.', 'werde', 'wird', 'werden', 'wurde', 'Futur I: werden + Infinitiv – ich werde besuchen.'],
    ['Wir haben gestern einen Kuchen ___ (backen).', 'gebacken', 'gebackt', 'backen', 'gebäckt', 'Perfekt: haben + Partizip II. backen – gebacken.'],
    ['Lisa gibt ___ (ihre Freundin) ein Geschenk.', 'ihrer Freundin', 'ihre Freundin', 'ihren Freundin', 'ihrem Freundin', 'Wem gibt sie etwas? → Dativ: ihrer Freundin.']
  ]);
  C('deutsch', 6, 'luecken', N, [
    ['Ich glaube, ___ es morgen regnet.', 'dass', 'das', 'daß', 'dast', 'dass ist eine Konjunktion und leitet einen Nebensatz ein. Probe: Lässt sich „dieses“ oder „welches“ einsetzen? Nein → dass.'],
    ['Das Buch, ___ ich gerade lese, ist spannend.', 'das|welches', 'dass', 'daß', 'dem', 'Relativpronomen: „welches“ lässt sich einsetzen → das mit einem s.'],
    ['Nachdem wir gegessen ___, gingen wir spazieren.', 'hatten', 'haben', 'hätten', 'waren', 'Plusquamperfekt (Vorvergangenheit): hatten + Partizip II.'],
    ['Der Brief ___ (werden) gestern vom Postboten gebracht.', 'wurde', 'wird', 'würde', 'worden', 'Passiv im Präteritum: wurde + Partizip II.'],
    ['Wir bleiben zu Hause, ___ es regnet.', 'weil', 'denn', 'deshalb', 'dass', 'weil leitet einen Nebensatz ein – das Verb steht am Ende. Nach denn stünde das Verb an zweiter Stelle.', 0],
    ['Er kam zu spät, ___ er hatte den Bus verpasst.', 'denn', 'weil', 'dass', 'obwohl', 'denn verbindet zwei Hauptsätze – das Verb steht an zweiter Stelle (er hatte …).', 0],
    ['Das Mädchen, ___ Fahrrad gestohlen wurde, weinte.', 'dessen', 'deren', 'dem', 'das', 'Relativpronomen im Genitiv: das Mädchen (Neutrum) → dessen.'],
    ['Tim fragte: „Kommst du mit?“ → Tim fragte, ___ ich mitkomme.', 'ob', 'dass', 'wenn', 'weil', 'Eine indirekte Entscheidungsfrage (ja/nein) wird mit ob eingeleitet.']
  ]);
  C('deutsch', 7, 'luecken', N, [
    ['Sie sagt, sie ___ (haben, Konjunktiv I) keine Zeit.', 'habe', 'hat', 'hätte', 'haben', 'Indirekte Rede steht im Konjunktiv I: sie habe.'],
    ['Er behauptet, er ___ (sein, Konjunktiv I) unschuldig.', 'sei', 'ist', 'wäre', 'sein', 'Konjunktiv I von sein: er sei.'],
    ['Beim ___ (laufen) habe ich mir den Fuß verletzt.', 'Laufen', 'laufen', 'Läufen', 'gelaufen', 'Nominalisierung: Nach „beim“ (= bei dem) wird das Verb zum Nomen und großgeschrieben.', 1, 'exact'],
    ['Ich wünsche dir alles ___ (gut).', 'Gute', 'gute', 'Guten', 'gutes', 'Nach alles, etwas, nichts, viel wird das Adjektiv zum Nomen: alles Gute.', 1, 'exact'],
    ['Jeden Morgen ___ (werden, Präsens) das Fenster geputzt.', 'wird', 'werden', 'wirst', 'worden', 'Passiv im Präsens: wird + Partizip II.'],
    ['___ des schlechten Wetters fand das Spiel statt.', 'Trotz|Ungeachtet', 'Wegen', 'Obwohl', 'Trotzdem', 'trotz + Genitiv nennt einen Gegengrund. obwohl leitet einen Nebensatz ein.'],
    ['Wenn ich Zeit ___ (haben, Konjunktiv II), würde ich dir helfen.', 'hätte', 'habe', 'hatte', 'hat', 'Unwirkliche Bedingung: Konjunktiv II – hätte.'],
    ['Der Zug hat Verspätung, ___ kommen wir zu spät.', 'deshalb|deswegen|darum|daher|also|folglich', 'weil', 'denn', 'obwohl', 'Wörter wie deshalb stehen an erster Stelle, danach folgt direkt das Verb.']
  ]);
  C('deutsch', 8, 'luecken', N, [
    ['Wenn er früher losgefahren ___ (sein, Konjunktiv II), hätte er den Zug erreicht.', 'wäre', 'war', 'sei', 'würde', 'Unwirkliches in der Vergangenheit: wäre/hätte + Partizip II.'],
    ['Das Auto ___ (können, Präsens) nicht mehr repariert werden.', 'kann', 'können', 'kannst', 'gekonnt', 'Passiv mit Modalverb: Modalverb + Partizip II + werden.'],
    ['Er versprach, pünktlich ___ kommen.', 'zu', 'um', 'für', 'dass', 'Infinitivgruppe mit zu: Er versprach, pünktlich zu kommen.'],
    ['Sie lernt viel, ___ die Prüfung zu bestehen.', 'um', 'ohne', 'damit', 'weil', 'Zweck (Finalsatz): um … zu + Infinitiv.'],
    ['Das ist das ___ (schön, Superlativ) Bild der Ausstellung.', 'schönste', 'schönere', 'am schönsten', 'schönst', 'Superlativ vor einem Nomen: das schönste Bild.'],
    ['Ich habe ___ Angst noch Sorgen.', 'weder', 'entweder', 'sowohl', 'nicht nur', 'weder … noch = keins von beiden.'],
    ['Je mehr ich übe, ___ besser werde ich.', 'desto|umso', 'als', 'so', 'dann', 'Feste Verbindung: je … desto (oder umso).'],
    ['Er tat so, als ___ er nichts gehört hätte.', 'ob|wenn', 'dass', 'wie', 'weil', 'als ob + Konjunktiv II drückt einen unwirklichen Vergleich aus.']
  ]);
  C('deutsch', 9, 'luecken', N, [
    ['Der Autor ___ (verwenden) in diesem Text viele Metaphern.', 'verwendet', 'verwendete', 'verwenden', 'verwand', 'Textanalysen schreibt man im Präsens.'],
    ['Der Minister sagte, die Lage ___ (sein, Konjunktiv I) ernst.', 'sei', 'ist', 'wäre', 'war', 'Indirekte Rede: Konjunktiv I.'],
    ['Die Reporter berichten, die Fans ___ (haben) lange gewartet.', 'hätten', 'haben', 'habe', 'hatten', 'Ist der Konjunktiv I nicht vom Indikativ zu unterscheiden (sie haben), nimmt man den Konjunktiv II: hätten.'],
    ['Das Gedicht besteht ___ vier Strophen.', 'aus', 'von', 'in', 'mit', 'bestehen aus + Dativ.'],
    ['Im Gegensatz ___ ihrem Bruder ist sie sehr ruhig.', 'zu', 'von', 'mit', 'gegen', 'Feste Verbindung: im Gegensatz zu + Dativ.'],
    ['Die Überschrift weist ___ das Thema des Textes hin.', 'auf', 'an', 'zu', 'über', 'hinweisen auf + Akkusativ.'],
    ['Der Text lässt sich ___ drei Abschnitte gliedern.', 'in', 'auf', 'zu', 'mit', 'gliedern in + Akkusativ.'],
    ['___ der Sprecher zunächst zögert, entscheidet er sich am Ende doch.', 'Obwohl', 'Trotz', 'Dennoch', 'Aber', 'Einen Gegengrund im Nebensatz leitet obwohl ein; trotz steht nur vor einem Nomen.', 0]
  ]);
  C('deutsch', 10, 'luecken', N, [
    ['Einerseits spart das Auto Zeit, ___ belastet es die Umwelt.', 'andererseits', 'einerseits', 'außerdem', 'deshalb', 'einerseits … andererseits stellt zwei Seiten gegenüber.'],
    ['Der Autor stellt die ___ auf, dass Lesen klüger macht.', 'These|Behauptung|Hypothese', 'Synthese', 'Strophe', 'Pointe', 'Eine These ist eine Behauptung, die mit Argumenten gestützt werden muss.'],
    ['Ein Argument besteht aus Behauptung, Begründung und ___.', 'Beispiel|Beleg', 'Einleitung', 'Überschrift', 'Fazit', 'Die drei B: Behauptung – Begründung – Beispiel (Beleg).'],
    ['Wörtlich übernommene Textstellen kennzeichnet man mit ___.', 'Anführungszeichen', 'Klammern', 'Gedankenstrichen', 'Ausrufezeichen', 'Zitate stehen in Anführungszeichen, dazu kommt die Zeilenangabe.'],
    ['Er hätte kommen können, wenn er rechtzeitig informiert worden ___.', 'wäre', 'war', 'würde', 'sei', 'Konjunktiv II im Passiv der Vergangenheit: informiert worden wäre.'],
    ['Die Kurzgeschichte beginnt ___ Einleitung, also unvermittelt.', 'ohne', 'mit', 'durch', 'nach', 'Typisch für Kurzgeschichten: der unvermittelte Einstieg ohne Einleitung.'],
    ['Das lyrische ___ ist der Sprecher in einem Gedicht.', 'Ich', 'Du', 'Wir', 'Subjekt', 'Das lyrische Ich darf man nicht mit der Autorin oder dem Autor gleichsetzen.'],
    ['Am Ende einer Erörterung steht das ___, in dem man die eigene Position zusammenfasst.', 'Fazit|Schlusswort|Resümee', 'Argument', 'Zitat', 'Exposé', 'Das Fazit fasst zusammen und nennt die eigene, begründete Meinung.']
  ]);

  /* ================= FRANZÖSISCH (1. Lernjahr = Klasse 7) ================= */
  C('franzoesisch', 7, 'luecken', N, [
    ['Je ___ (être) élève.', 'suis', 'es', 'est', 'sommes', 'être: je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont.'],
    ['Nous ___ (avoir) un chien.', 'avons', 'avez', 'ont', 'sommes', 'avoir: j’ai, tu as, il a, nous avons, vous avez, ils ont.'],
    ['Tu ___ (parler) français ?', 'parles', 'parle', 'parlez', 'parlent', 'Verben auf -er: je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent.'],
    ['Elle ___ (habiter) à Paris.', 'habite', 'habites', 'habitent', 'habitez', 'il/elle + -e: elle habite.'],
    ['Voilà ___ amie de Léa. (unbestimmter Artikel)', 'une', 'un', 'des', 'le', 'amie ist weiblich → une amie.'],
    ['Je ne parle ___ anglais.', 'pas', 'ne', 'non', 'rien', 'Verneinung: ne … pas umschließt das Verb.'],
    ['Ils ___ (aller) au collège.', 'vont', 'allent', 'va', 'allons', 'aller ist unregelmäßig: je vais, tu vas, il va, nous allons, vous allez, ils vont.'],
    ['C’est ___ frère. (mein)', 'mon', 'ma', 'mes', 'me', 'mon steht vor männlichen Nomen im Singular.']
  ]);
  C('franzoesisch', 8, 'luecken', N, [
    ['Demain, je ___ regarder un film. (futur composé)', 'vais', 'va', 'suis', 'ai', 'Futur composé: aller + Infinitiv – je vais regarder.'],
    ['Qu’est-ce que vous ___ (faire) ce soir ?', 'faites', 'faisez', 'font', 'faisons', 'faire: vous faites (unregelmäßig!).'],
    ['Elle a une robe ___ (vert).', 'verte', 'vert', 'verts', 'vertes', 'Das Adjektiv richtet sich nach dem Nomen: une robe verte.'],
    ['Je voudrais ___ eau, s’il vous plaît. (Teilungsartikel)', "de l'", 'du', 'de la', 'des', 'Vor einem Vokal heißt der Teilungsartikel de l’: de l’eau.'],
    ['Tu ___ (pouvoir) m’aider ?', 'peux', 'peut', 'pouvez', 'peus', 'pouvoir: je peux, tu peux, il peut.'],
    ['Hier, j’___ mangé une pizza. (passé composé)', 'ai', 'suis', 'a', 'as', 'Passé composé der meisten Verben: avoir + participe passé – j’ai mangé.'],
    ['Nous ___ (vouloir) aller à la plage.', 'voulons', 'voulez', 'veulent', 'voulions', 'vouloir: je veux, tu veux, il veut, nous voulons, vous voulez, ils veulent.'],
    ['Il n’y a pas ___ lait dans le frigo.', 'de', 'du', 'le', 'des', 'Nach der Verneinung wird der Teilungsartikel zu de: pas de lait.']
  ]);
  C('franzoesisch', 9, 'luecken', N, [
    ['Hier, elle est ___ (aller) au cinéma.', 'allée', 'allé', 'allés', 'aller', 'Passé composé mit être: Das Partizip wird angeglichen – elle est allée.'],
    ['Quand j’étais petit, je ___ (jouer) souvent au foot. (imparfait)', 'jouais', 'jouait', 'ai joué', 'jouerai', 'Imparfait für Gewohnheiten: Stamm der nous-Form + -ais.'],
    ['C’est le garçon ___ habite à côté.', 'qui', 'que', 'où', 'dont', 'qui ist Subjekt des Relativsatzes (danach folgt direkt das Verb).'],
    ['C’est le livre ___ j’ai acheté hier.', 'que', 'qui', 'où', 'quoi', 'que ist direktes Objekt des Relativsatzes.'],
    ['Paul est ___ grand que Marc. (größer)', 'plus', 'moins', 'aussi', 'très', 'Komparativ: plus … que (mehr), moins … que (weniger), aussi … que (genauso).'],
    ['Tu connais Marie ? – Oui, je ___ connais.', 'la', 'le', 'lui', 'elle', 'Direktes Objektpronomen für eine weibliche Person: la.'],
    ['Demain, il ___ (faire) beau. (futur simple)', 'fera', 'fait', 'faisait', 'ferait', 'Futur simple von faire: je ferai, il fera.'],
    ['Nous nous sommes ___ (lever) à six heures.', 'levés|levées', 'levé', 'lever', 'levons', 'Reflexive Verben bilden das passé composé mit être – das Partizip wird angeglichen.']
  ]);
  C('franzoesisch', 10, 'luecken', N, [
    ['Si j’avais le temps, je ___ (voyager) plus. (conditionnel)', 'voyagerais', 'voyagerai', 'voyageais', 'voyage', 'Irrealer si-Satz: si + imparfait, im Hauptsatz conditionnel présent.'],
    ['Il faut que tu ___ (faire) tes devoirs. (subjonctif)', 'fasses', 'fais', 'feras', 'faisais', 'Nach il faut que steht der subjonctif: que tu fasses.'],
    ['S’il pleut demain, nous ___ (rester) à la maison. (futur simple)', 'resterons', 'resterions', 'restions', 'resteront', 'Realer si-Satz: si + présent, im Hauptsatz futur simple.'],
    ['Tu vas à Paris ? – Oui, j’___ vais demain.', 'y', 'en', 'le', 'lui', 'y ersetzt Ortsangaben mit à: J’y vais.'],
    ['Tu veux du gâteau ? – Oui, j’___ veux bien.', 'en', 'y', 'le', 'du', 'en ersetzt Ergänzungen mit de und den Teilungsartikel.'],
    ['Quand je suis arrivé, le train était déjà ___ (partir).', 'parti', 'partir', 'partait', 'partira', 'Plus-que-parfait: imparfait von être/avoir + participe passé.'],
    ['Elle écoute de la musique en ___ (travailler).', 'travaillant', 'travaille', 'travaillé', 'travailler', 'Gérondif: en + Stamm der nous-Form + -ant – drückt Gleichzeitigkeit aus.'],
    ['Je voudrais que vous ___ (être) à l’heure. (subjonctif)', 'soyez', 'êtes', 'serez', 'étiez', 'Subjonctif von être: que vous soyez.']
  ]);

  /* ================= LATEIN (1. Lernjahr = Klasse 7) ================= */
  C('latein', 7, 'luecken', N, [
    ['Marcus amicum ___ (vocare, 3. Person Singular Präsens).', 'vocat', 'vocant', 'vocas', 'vocare', 'a-Konjugation: voco, vocas, vocat, vocamus, vocatis, vocant.'],
    ['Servi in villa ___ (laborare, 3. Person Plural Präsens).', 'laborant', 'laborat', 'laboramus', 'laboratis', 'Die 3. Person Plural endet auf -nt.'],
    ['Puella ___ (rosa, Akkusativ Singular) videt.', 'rosam', 'rosa', 'rosae', 'rosas', 'Akkusativ Singular der a-Deklination: -am (Wen oder was sieht sie?).'],
    ['Ego discipulus ___ (esse).', 'sum', 'es', 'est', 'sumus', 'esse: sum, es, est, sumus, estis, sunt.'],
    ['Dominus ___ (servus, Akkusativ Plural) vocat.', 'servos', 'servi', 'servis', 'servum', 'Akkusativ Plural der o-Deklination: -os.'],
    ['Liberi in horto ___ (esse).', 'sunt', 'est', 'sumus', 'estis', 'liberi (die Kinder) = sie → sunt.']
  ]);
  C('latein', 8, 'luecken', N, [
    ['Caesar Galliam ___ (vincere, 3. Person Singular Perfekt).', 'vicit', 'vincit', 'vincebat', 'vicerunt', 'vincere, vinco, vici, victum – Perfekt, 3. Person Singular: vicit.'],
    ['Romani diu ___ (pugnare, 3. Person Plural Imperfekt).', 'pugnabant', 'pugnant', 'pugnaverunt', 'pugnabunt', 'Imperfekt: Kennzeichen -ba-.'],
    ['Pater ___ (filius, Dativ Singular) librum dat.', 'filio', 'filium', 'filii', 'filius', 'Wem gibt er das Buch? → Dativ: filio.'],
    ['Cras amicos ___ (visitare, 1. Person Plural Futur I).', 'visitabimus', 'visitamus', 'visitabamus', 'visitavimus', 'Futur I der a-Konjugation: -bo, -bis, -bit, -bimus, -bitis, -bunt.'],
    ['Milites cum ___ (dux, Ablativ Singular) veniunt.', 'duce', 'ducem', 'duci', 'dux', 'cum steht mit Ablativ; 3. Deklination: dux, ducis → duce.'],
    ['Veni, vidi, ___ (vincere, 1. Person Singular Perfekt).', 'vici', 'vinco', 'vicit', 'vincam', 'Caesars berühmter Ausspruch: „Ich kam, sah und siegte.“']
  ]);
  C('latein', 9, 'luecken', N, [
    ['Urbs a Romanis ___ (capere, PPP) est.', 'capta', 'captus', 'captum', 'capit', 'Perfekt Passiv: PPP + est. Das PPP richtet sich nach dem Subjekt (urbs ist feminin → capta).'],
    ['Scio te amicum bonum ___ (esse, Infinitiv).', 'esse', 'es', 'est', 'sis', 'AcI: Akkusativ (te) + Infinitiv (esse) nach scio – „Ich weiß, dass du ein guter Freund bist.“'],
    ['Puer a patre ___ (laudare, 3. Person Singular Präsens Passiv).', 'laudatur', 'laudat', 'laudantur', 'laudari', 'Präsens Passiv: -tur in der 3. Person Singular.'],
    ['Femina, ___ in via stat, pulchra est. (Relativpronomen)', 'quae', 'qui', 'quod', 'quam', 'Das Relativpronomen richtet sich in Genus und Numerus nach dem Bezugswort (femina: feminin, Singular); als Subjekt des Relativsatzes steht es im Nominativ.'],
    ['Troia ___ (delere, PPP im Ablativ) Graeci domum navigaverunt.', 'deleta', 'deletam', 'deletae', 'delet', 'Ablativus absolutus: Troia deleta = „nachdem Troja zerstört worden war“.'],
    ['Dicit se venire non ___ (posse, Infinitiv).', 'posse', 'potest', 'possit', 'potuit', 'AcI: Das Prädikat des abhängigen Satzes steht im Infinitiv.']
  ]);
  C('latein', 10, 'luecken', N, [
    ['Venerunt, ut urbem ___ (videre, 3. Person Plural Konjunktiv Imperfekt).', 'viderent', 'vident', 'videbant', 'videant', 'Finalsatz mit ut + Konjunktiv; nach einem Vergangenheitstempus steht der Konjunktiv Imperfekt.'],
    ['Si tacuisses, philosophus ___ (manere, 2. Person Singular Konjunktiv Plusquamperfekt).', 'mansisses', 'manes', 'manebas', 'maneres', '„Hättest du geschwiegen, wärst du ein Philosoph geblieben.“ Irrealis der Vergangenheit: Konjunktiv Plusquamperfekt.'],
    ['Ars ___ (scribere, Gerundium im Genitiv) difficilis est.', 'scribendi', 'scribere', 'scribendo', 'scriptum', 'Gerundium im Genitiv: ars scribendi = die Kunst des Schreibens.'],
    ['Cum Caesar in Galliam ___ (venire, 3. Person Singular Konjunktiv Plusquamperfekt), bellum paravit.', 'venisset', 'venit', 'veniret', 'veniebat', 'cum mit Konjunktiv Plusquamperfekt: „Als/Nachdem Caesar nach Gallien gekommen war …“'],
    ['Carthago ___ (delere, Gerundivum) est.', 'delenda', 'deleta', 'delere', 'delendi', '„Karthago muss zerstört werden.“ Gerundivum + esse drückt eine Notwendigkeit aus.'],
    ['Milites hostes ___ (sequi, 3. Person Plural Präsens).', 'sequuntur', 'sequunt', 'sequitur', 'sequi', 'sequi ist ein Deponens: passive Form, aktive Bedeutung.']
  ]);
})();
