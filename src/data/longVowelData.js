const longVowelData = {
  title: '장모음 & Magic E',
  icon: '✨',
  description: '마법의 E가 모음을 바꿔요',
  lessons: [
    // Magic E 패턴 (단모음 → 장모음 비교)
    { pattern: 'a_e', sound: '/eɪ/', shortWord: 'cap', longWord: 'cape', words: [
      { word: 'cake', emoji: '🎂' }, { word: 'lake', emoji: '🏞️' }, { word: 'make', emoji: '🔨' }, { word: 'name', emoji: '📛' },
      { word: 'game', emoji: '🎮' }, { word: 'late', emoji: '⏰' },
    ]},
    { pattern: 'i_e', sound: '/aɪ/', shortWord: 'kit', longWord: 'kite', words: [
      { word: 'bike', emoji: '🚲' }, { word: 'like', emoji: '❤️' }, { word: 'time', emoji: '⏰' }, { word: 'five', emoji: '5️⃣' },
      { word: 'ride', emoji: '🏇' }, { word: 'line', emoji: '📏' },
    ]},
    { pattern: 'o_e', sound: '/oʊ/', shortWord: 'hop', longWord: 'hope', words: [
      { word: 'home', emoji: '🏠' }, { word: 'bone', emoji: '🦴' }, { word: 'note', emoji: '📝' }, { word: 'rose', emoji: '🌹' },
      { word: 'nose', emoji: '👃' }, { word: 'hole', emoji: '🕳️' },
    ]},
    { pattern: 'u_e', sound: '/juː/', shortWord: 'cub', longWord: 'cube', words: [
      { word: 'cute', emoji: '🥰' }, { word: 'huge', emoji: '🐘' }, { word: 'mule', emoji: '🫏' }, { word: 'tune', emoji: '🎵' },
      { word: 'rule', emoji: '📐' }, { word: 'flute', emoji: '🎶' },
    ]},
    // 모음팀 패턴 (단모음 → 장모음 비교 추가!)
    { pattern: 'ee', sound: '/iː/', shortWord: 'bed', longWord: 'beet', words: [
      { word: 'bee', emoji: '🐝' }, { word: 'tree', emoji: '🌳' }, { word: 'see', emoji: '👀' }, { word: 'free', emoji: '🆓' },
      { word: 'feet', emoji: '🦶' }, { word: 'green', emoji: '💚' },
    ]},
    { pattern: 'ea', sound: '/iː/', shortWord: 'met', longWord: 'meat', words: [
      { word: 'eat', emoji: '🍽️' }, { word: 'read', emoji: '📖' }, { word: 'sea', emoji: '🌊' }, { word: 'team', emoji: '👥' },
      { word: 'bean', emoji: '🫘' }, { word: 'peach', emoji: '🍑' },
    ]},
    { pattern: 'oa', sound: '/oʊ/', shortWord: 'got', longWord: 'goat', words: [
      { word: 'boat', emoji: '⛵' }, { word: 'coat', emoji: '🧥' }, { word: 'goat', emoji: '🐐' }, { word: 'road', emoji: '🛣️' },
      { word: 'soap', emoji: '🧼' }, { word: 'toast', emoji: '🍞' },
    ]},
    { pattern: 'ai', sound: '/eɪ/', shortWord: 'man', longWord: 'main', words: [
      { word: 'rain', emoji: '🌧️' }, { word: 'tail', emoji: '🐕' }, { word: 'mail', emoji: '📬' }, { word: 'sail', emoji: '⛵' },
      { word: 'train', emoji: '🚂' }, { word: 'paint', emoji: '🎨' },
    ]},
  ],
};

export default longVowelData;
