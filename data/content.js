/* Inhalts-Registry. Neue Themen legst du in data/<fach>.js an (siehe README). */
window.LERN = {
  grades: [5, 6, 7, 8, 9, 10],
  subjects: [
    { id: 'mathe', name: 'Mathematik', icon: '➗', color: '#4f7cff' },
    { id: 'deutsch', name: 'Deutsch', icon: '📖', color: '#e8590c' },
    { id: 'englisch', name: 'Englisch', icon: '🇬🇧', color: '#d6336c' },
    { id: 'biologie', name: 'Biologie', icon: '🌱', color: '#2f9e44' },
    { id: 'physik', name: 'Physik', icon: '🔭', color: '#7048e8' },
    { id: 'chemie', name: 'Chemie', icon: '⚗️', color: '#0c8599', soon: true },
    { id: 'geschichte', name: 'Geschichte', icon: '🏛️', color: '#a0722a', soon: true },
    { id: 'erdkunde', name: 'Erdkunde', icon: '🌍', color: '#1c7ed6', soon: true },
    { id: 'informatik', name: 'Informatik', icon: '💻', color: '#495057', soon: true },
    { id: 'politik', name: 'Politik', icon: '🗳️', color: '#c2255c', soon: true },
    { id: 'franzoesisch', name: 'Französisch', icon: '🥐', color: '#364fc7', soon: true },
    { id: 'latein', name: 'Latein', icon: '🏺', color: '#862e9c', soon: true },
    { id: 'musik', name: 'Musik', icon: '🎵', color: '#f08c00', soon: true },
    { id: 'kunst', name: 'Kunst', icon: '🎨', color: '#e03131', soon: true },
    { id: 'religion', name: 'Religion/Ethik', icon: '🕊️', color: '#5c940d', soon: true }
  ],
  topics: [],
  /* rows: [Frage, richtige Antwort, falsch1, falsch2, falsch3, Erklärung, Praxisbeispiel] */
  add(subject, grade, id, name, rows) {
    const key = subject + '-' + grade + '-' + id;
    this.topics.push({
      key, subject, grade, id, name,
      qs: rows.map((r, i) => ({
        id: key + '-' + i, subject, topicKey: key,
        q: r[0], a: r[1], w: [r[2], r[3], r[4]], e: r[5], ex: r[6]
      }))
    });
  }
};
