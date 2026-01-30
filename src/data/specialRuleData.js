const specialRuleData = {
  title: '특수 규칙',
  icon: '📚',
  description: '특별한 발음 규칙을 배워요',
  lessons: [
    { rule: 'ck', sound: '/k/', words: [
      { word: 'duck', emoji: '🦆' }, { word: 'back', emoji: '🔙' }, { word: 'kick', emoji: '🦵' }, { word: 'rock', emoji: '🪨' },
      { word: 'sock', emoji: '🧦' }, { word: 'clock', emoji: '🕐' }, { word: 'black', emoji: '⬛' }, { word: 'truck', emoji: '🚚' },
      { word: 'stick', emoji: '🪵' }, { word: 'trick', emoji: '🎩' }, { word: 'quick', emoji: '⚡' }, { word: 'snack', emoji: '🍪' },
    ]},
    { rule: 'ng', sound: '/ŋ/', words: [
      { word: 'ring', emoji: '💍' }, { word: 'sing', emoji: '🎤' }, { word: 'king', emoji: '🤴' }, { word: 'long', emoji: '📏' },
      { word: 'song', emoji: '🎵' }, { word: 'wing', emoji: '🪽' }, { word: 'bring', emoji: '📦' }, { word: 'thing', emoji: '📦' },
      { word: 'spring', emoji: '🌸' }, { word: 'string', emoji: '🧵' }, { word: 'swing', emoji: '🛝' }, { word: 'strong', emoji: '💪' },
    ]},
    { rule: 'nk', sound: '/ŋk/', words: [
      { word: 'pink', emoji: '💗' }, { word: 'sink', emoji: '🚰' }, { word: 'think', emoji: '🤔' }, { word: 'drink', emoji: '🥤' },
      { word: 'thank', emoji: '🙏' }, { word: 'bank', emoji: '🏦' }, { word: 'tank', emoji: '🚂' }, { word: 'blank', emoji: '⬜' },
      { word: 'trunk', emoji: '🐘' }, { word: 'skunk', emoji: '🦨' }, { word: 'chunk', emoji: '🧱' }, { word: 'shrink', emoji: '🤏' },
    ]},
    { rule: 'oo (short)', sound: '/ʊ/', words: [
      { word: 'book', emoji: '📖' }, { word: 'look', emoji: '👀' }, { word: 'cook', emoji: '👨‍🍳' }, { word: 'good', emoji: '👍' },
      { word: 'wood', emoji: '🪵' }, { word: 'foot', emoji: '🦶' }, { word: 'hook', emoji: '🪝' }, { word: 'took', emoji: '✋' },
      { word: 'shook', emoji: '😰' }, { word: 'brook', emoji: '🏞️' }, { word: 'stood', emoji: '🧍' }, { word: 'wool', emoji: '🧶' },
    ]},
    { rule: 'oo (long)', sound: '/uː/', words: [
      { word: 'moon', emoji: '🌙' }, { word: 'food', emoji: '🍔' }, { word: 'cool', emoji: '😎' }, { word: 'pool', emoji: '🏊' },
      { word: 'school', emoji: '🏫' }, { word: 'room', emoji: '🚪' }, { word: 'zoo', emoji: '🦁' }, { word: 'too', emoji: '2️⃣' },
      { word: 'tooth', emoji: '🦷' }, { word: 'roof', emoji: '🏠' }, { word: 'boot', emoji: '👢' }, { word: 'broom', emoji: '🧹' },
    ]},
    { rule: 'ow (diphthong)', sound: '/aʊ/', words: [
      { word: 'cow', emoji: '🐄' }, { word: 'now', emoji: '⏰' }, { word: 'how', emoji: '❓' }, { word: 'wow', emoji: '😮' },
      { word: 'town', emoji: '🏘️' }, { word: 'brown', emoji: '🟤' }, { word: 'down', emoji: '⬇️' }, { word: 'crown', emoji: '👑' },
      { word: 'frown', emoji: '😠' }, { word: 'clown', emoji: '🤡' }, { word: 'power', emoji: '💪' }, { word: 'flower', emoji: '🌸' },
    ]},
    { rule: 'ou', sound: '/aʊ/', words: [
      { word: 'out', emoji: '🚪' }, { word: 'house', emoji: '🏠' }, { word: 'mouse', emoji: '🐭' }, { word: 'loud', emoji: '🔊' },
      { word: 'cloud', emoji: '☁️' }, { word: 'round', emoji: '⭕' }, { word: 'sound', emoji: '🔉' }, { word: 'found', emoji: '🔍' },
      { word: 'ground', emoji: '🌍' }, { word: 'count', emoji: '🔢' }, { word: 'shout', emoji: '📢' }, { word: 'mouth', emoji: '👄' },
    ]},
    { rule: 'aw', sound: '/ɔː/', words: [
      { word: 'saw', emoji: '🪚' }, { word: 'paw', emoji: '🐾' }, { word: 'draw', emoji: '✏️' }, { word: 'law', emoji: '⚖️' },
      { word: 'straw', emoji: '🥤' }, { word: 'crawl', emoji: '🐛' }, { word: 'jaw', emoji: '👄' }, { word: 'raw', emoji: '🥩' },
      { word: 'claw', emoji: '🦞' }, { word: 'flaw', emoji: '💔' }, { word: 'yawn', emoji: '🥱' }, { word: 'dawn', emoji: '🌅' },
    ]},
    { rule: 'au', sound: '/ɔː/', words: [
      { word: 'pause', emoji: '⏸️' }, { word: 'cause', emoji: '➡️' }, { word: 'sauce', emoji: '🍝' }, { word: 'haunt', emoji: '👻' },
      { word: 'fault', emoji: '❌' }, { word: 'vault', emoji: '🏦' }, { word: 'launch', emoji: '🚀' }, { word: 'laundry', emoji: '🧺' },
      { word: 'author', emoji: '✍️' }, { word: 'August', emoji: '📅' }, { word: 'auto', emoji: '🚗' }, { word: 'audio', emoji: '🔊' },
    ]},
    { rule: 'er', sound: '/ɜːr/', words: [
      { word: 'her', emoji: '👩' }, { word: 'water', emoji: '💧' }, { word: 'sister', emoji: '👧' }, { word: 'teacher', emoji: '👩‍🏫' },
      { word: 'mother', emoji: '👩' }, { word: 'father', emoji: '👨' }, { word: 'after', emoji: '➡️' }, { word: 'under', emoji: '⬇️' },
      { word: 'over', emoji: '⬆️' }, { word: 'flower', emoji: '🌸' }, { word: 'letter', emoji: '✉️' }, { word: 'better', emoji: '👍' },
    ]},
    { rule: 'ir', sound: '/ɜːr/', words: [
      { word: 'bird', emoji: '🐦' }, { word: 'girl', emoji: '👧' }, { word: 'first', emoji: '🥇' }, { word: 'shirt', emoji: '👕' },
      { word: 'dirt', emoji: '🟤' }, { word: 'circle', emoji: '⭕' }, { word: 'third', emoji: '3️⃣' }, { word: 'thirsty', emoji: '🥤' },
      { word: 'birthday', emoji: '🎂' }, { word: 'skirt', emoji: '👗' }, { word: 'stir', emoji: '🥄' }, { word: 'swirl', emoji: '🌀' },
    ]},
    { rule: 'ur', sound: '/ɜːr/', words: [
      { word: 'burn', emoji: '🔥' }, { word: 'turn', emoji: '🔄' }, { word: 'nurse', emoji: '👩‍⚕️' }, { word: 'purple', emoji: '💜' },
      { word: 'turtle', emoji: '🐢' }, { word: 'church', emoji: '⛪' }, { word: 'hurt', emoji: '🤕' }, { word: 'fur', emoji: '🐻' },
      { word: 'curly', emoji: '〰️' }, { word: 'burger', emoji: '🍔' }, { word: 'return', emoji: '↩️' }, { word: 'Saturday', emoji: '📅' },
    ]},
    { rule: 'or', sound: '/ɔːr/', words: [
      { word: 'or', emoji: '↔️' }, { word: 'for', emoji: '➡️' }, { word: 'corn', emoji: '🌽' }, { word: 'horn', emoji: '📯' },
      { word: 'short', emoji: '📏' }, { word: 'storm', emoji: '⛈️' }, { word: 'fork', emoji: '🍴' }, { word: 'horse', emoji: '🐴' },
      { word: 'sport', emoji: '⚽' }, { word: 'morning', emoji: '🌅' }, { word: 'story', emoji: '📖' }, { word: 'north', emoji: '⬆️' },
    ]},
    { rule: 'ar', sound: '/ɑːr/', words: [
      { word: 'car', emoji: '🚗' }, { word: 'star', emoji: '⭐' }, { word: 'far', emoji: '🛤️' }, { word: 'park', emoji: '🏞️' },
      { word: 'farm', emoji: '🚜' }, { word: 'dark', emoji: '🌑' }, { word: 'shark', emoji: '🦈' }, { word: 'card', emoji: '🃏' },
      { word: 'garden', emoji: '🌻' }, { word: 'market', emoji: '🏪' }, { word: 'party', emoji: '🎉' }, { word: 'artist', emoji: '🎨' },
    ]},
    { rule: 'oi/oy', sound: '/ɔɪ/', words: [
      { word: 'boy', emoji: '👦' }, { word: 'toy', emoji: '🧸' }, { word: 'joy', emoji: '😊' }, { word: 'enjoy', emoji: '🎉' },
      { word: 'coin', emoji: '🪙' }, { word: 'join', emoji: '🤝' }, { word: 'point', emoji: '👉' }, { word: 'voice', emoji: '🗣️' },
      { word: 'noise', emoji: '🔊' }, { word: 'choice', emoji: '✅' }, { word: 'boil', emoji: '♨️' }, { word: 'oil', emoji: '🛢️' },
    ]},
    { rule: 'ew', sound: '/uː/', words: [
      { word: 'new', emoji: '🆕' }, { word: 'few', emoji: '🔢' }, { word: 'chew', emoji: '😋' }, { word: 'grew', emoji: '🌱' },
      { word: 'flew', emoji: '✈️' }, { word: 'blew', emoji: '💨' }, { word: 'drew', emoji: '✏️' }, { word: 'knew', emoji: '🧠' },
      { word: 'threw', emoji: '🤾' }, { word: 'stew', emoji: '🍲' }, { word: 'crew', emoji: '👥' }, { word: 'jewel', emoji: '💎' },
    ]},
    { rule: 'ph', sound: '/f/', words: [
      { word: 'phone', emoji: '📱' }, { word: 'photo', emoji: '📷' }, { word: 'elephant', emoji: '🐘' }, { word: 'dolphin', emoji: '🐬' },
      { word: 'alphabet', emoji: '🔤' }, { word: 'graph', emoji: '📊' }, { word: 'trophy', emoji: '🏆' }, { word: 'nephew', emoji: '👦' },
      { word: 'pharaoh', emoji: '👑' }, { word: 'phrase', emoji: '💬' }, { word: 'phantom', emoji: '👻' }, { word: 'sphere', emoji: '🔵' },
    ]},
    { rule: 'gh (silent)', sound: '(silent)', words: [
      { word: 'high', emoji: '📈' }, { word: 'night', emoji: '🌙' }, { word: 'light', emoji: '💡' }, { word: 'right', emoji: '✅' },
      { word: 'sight', emoji: '👁️' }, { word: 'fight', emoji: '🥊' }, { word: 'might', emoji: '💪' }, { word: 'bright', emoji: '☀️' },
      { word: 'thought', emoji: '🤔' }, { word: 'daughter', emoji: '👧' }, { word: 'caught', emoji: '🎣' }, { word: 'taught', emoji: '👩‍🏫' },
    ]},
    { rule: 'kn', sound: '/n/', words: [
      { word: 'know', emoji: '🧠' }, { word: 'knee', emoji: '🦵' }, { word: 'knife', emoji: '🔪' }, { word: 'knock', emoji: '🚪' },
      { word: 'knot', emoji: '🪢' }, { word: 'knight', emoji: '🛡️' }, { word: 'knit', emoji: '🧶' }, { word: 'knew', emoji: '💡' },
      { word: 'knob', emoji: '🚪' }, { word: 'kneel', emoji: '🧎' }, { word: 'knowledge', emoji: '📚' }, { word: 'known', emoji: '✅' },
    ]},
    { rule: 'wr', sound: '/r/', words: [
      { word: 'write', emoji: '✍️' }, { word: 'wrong', emoji: '❌' }, { word: 'wrap', emoji: '🎁' }, { word: 'wrist', emoji: '⌚' },
      { word: 'wreck', emoji: '💥' }, { word: 'wreath', emoji: '🎄' }, { word: 'wrestle', emoji: '🤼' }, { word: 'wrinkle', emoji: '👵' },
      { word: 'writer', emoji: '✏️' }, { word: 'written', emoji: '📝' }, { word: 'wren', emoji: '🐦' }, { word: 'wrote', emoji: '✍️' },
    ]},
    { rule: 'mb', sound: '/m/', words: [
      { word: 'climb', emoji: '🧗' }, { word: 'comb', emoji: '💇' }, { word: 'lamb', emoji: '🐑' }, { word: 'thumb', emoji: '👍' },
      { word: 'bomb', emoji: '💣' }, { word: 'crumb', emoji: '🍞' }, { word: 'dumb', emoji: '🤐' }, { word: 'numb', emoji: '🥶' },
      { word: 'tomb', emoji: '⚰️' }, { word: 'limb', emoji: '🦵' }, { word: 'plumber', emoji: '🔧' }, { word: 'womb', emoji: '👶' },
    ]},
    { rule: 'soft c', sound: '/s/', words: [
      { word: 'city', emoji: '🏙️' }, { word: 'cell', emoji: '📱' }, { word: 'cent', emoji: '💵' }, { word: 'ice', emoji: '🧊' },
      { word: 'rice', emoji: '🍚' }, { word: 'nice', emoji: '😊' }, { word: 'mice', emoji: '🐭' }, { word: 'face', emoji: '😊' },
      { word: 'place', emoji: '📍' }, { word: 'space', emoji: '🚀' }, { word: 'race', emoji: '🏃' }, { word: 'dance', emoji: '💃' },
    ]},
    { rule: 'soft g', sound: '/dʒ/', words: [
      { word: 'gym', emoji: '🏋️' }, { word: 'gem', emoji: '💎' }, { word: 'giraffe', emoji: '🦒' }, { word: 'giant', emoji: '🦍' },
      { word: 'germ', emoji: '🦠' }, { word: 'page', emoji: '📄' }, { word: 'cage', emoji: '🐦' }, { word: 'stage', emoji: '🎭' },
      { word: 'age', emoji: '🎂' }, { word: 'huge', emoji: '🐘' }, { word: 'orange', emoji: '🍊' }, { word: 'change', emoji: '🔄' },
    ]},
  ],
};

export default specialRuleData;
