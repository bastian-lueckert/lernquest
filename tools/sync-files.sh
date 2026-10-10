#!/bin/sh
# Schreibt die Liste der data/*.js-Dateien in index.html und sw.js (Marker DATA:START / DATA:END).
cd "$(dirname "$0")/.." || exit 1
FILES=$(ls data/*.js | grep -v -e data/content.js -e data/cards.js | sort)
{ echo '  <!-- DATA:START -->'; echo '  <script src="data/content.js"></script>'; echo '  <script src="data/cards.js"></script>'; for f in $FILES; do echo "  <script src=\"$f\"></script>"; done; echo '  <!-- DATA:END -->'; } > /tmp/lq_html.txt
awk 'BEGIN{skip=0} /DATA:START/{while((getline l < "/tmp/lq_html.txt")>0) print l; skip=1} !skip{print} /DATA:END/{skip=0}' index.html > /tmp/lq_index && mv /tmp/lq_index index.html
JS=$(for f in $FILES; do printf "'%s', " "$f"; done)
awk -v js="$JS" 'BEGIN{skip=0} /DATA:START/{print "/*DATA:START*/ const DATA = [\x27data/content.js\x27, \x27data/cards.js\x27, " js "]; /*DATA:END*/"; skip=1} !skip{print} /DATA:END/{skip=0}' sw.js > /tmp/lq_sw && mv /tmp/lq_sw sw.js
