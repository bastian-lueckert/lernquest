(() => {
  const P = LERN.P, A = LERN.pairs, T = LERN.T;
  const fr = { q: 'Was bedeutet „{0}“?', qr: 'Wie heißt „{1}“ auf Französisch?', e: '{0} = {1}' };
  A('franzoesisch', 8, 'adjektive', 'Adjektive & Gegensätze', fr, P('grand=groß;petit=klein;beau=schön;laid=hässlich;nouveau=neu;vieux=alt;jeune=jung;bon=gut;mauvais=schlecht;long=lang;court=kurz;cher=teuer;facile=leicht;difficile=schwer;heureux=glücklich;rapide=schnell;lent=langsam;chaud=warm;froid=kalt;fort=stark'));
  A('franzoesisch', 9, 'verben-bewegung', 'Verben der Bewegung & reflexive Verben', fr, P("partir=abfahren;sortir=ausgehen;rentrer=nach Hause kommen;arriver=ankommen;rester=bleiben;monter=hinaufgehen;descendre=hinuntergehen;entrer=eintreten;tomber=fallen;naître=geboren werden;mourir=sterben;rencontrer=treffen;oublier=vergessen;se souvenir=sich erinnern;se lever=aufstehen;se coucher=zu Bett gehen;s'habiller=sich anziehen;se laver=sich waschen;se dépêcher=sich beeilen;s'amuser=sich amüsieren"));
  A('latein', 7, 'pronomen', 'Pronomen & Possessiva', T.la2de, P('ego=ich;tu=du;nos=wir;vos=ihr;is=er;ea=sie;id=es;hic=dieser;ille=jener;qui=der, welcher;quis=wer;quid=was;omnis=jeder;nullus=kein;totus=ganz;solus=allein;alius=ein anderer;ipse=selbst;idem=derselbe;noster=unser;vester=euer;meus=mein;tuus=dein;suus=sein'));
})();
