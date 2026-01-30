const blendData = {
  title: '자음 블렌드',
  icon: '🔀',
  description: '두 자음이 합쳐진 소리를 배워요',
  lessons: [
    { blend: 'sh', sound: '/ʃ/', words: [
      { word: 'ship', emoji: '🚢' }, { word: 'shop', emoji: '🏪' }, { word: 'fish', emoji: '🐟' }, { word: 'she', emoji: '👩' },
      { word: 'shoe', emoji: '👟' }, { word: 'shell', emoji: '🐚' }, { word: 'shark', emoji: '🦈' }, { word: 'sheep', emoji: '🐑' },
      { word: 'shirt', emoji: '👕' }, { word: 'shine', emoji: '✨' }, { word: 'share', emoji: '🤝' }, { word: 'show', emoji: '📺' },
    ]},
    { blend: 'ch', sound: '/tʃ/', words: [
      { word: 'chip', emoji: '🍟' }, { word: 'chat', emoji: '💬' }, { word: 'much', emoji: '📈' }, { word: 'rich', emoji: '💰' },
      { word: 'chin', emoji: '😊' }, { word: 'lunch', emoji: '🍱' }, { word: 'cheese', emoji: '🧀' }, { word: 'chicken', emoji: '🍗' },
      { word: 'chair', emoji: '🪑' }, { word: 'child', emoji: '👶' }, { word: 'choose', emoji: '✅' }, { word: 'church', emoji: '⛪' },
    ]},
    { blend: 'th', sound: '/θ/', words: [
      { word: 'thin', emoji: '📏' }, { word: 'bath', emoji: '🛁' }, { word: 'math', emoji: '🔢' }, { word: 'with', emoji: '🤝' },
      { word: 'think', emoji: '🤔' }, { word: 'tooth', emoji: '🦷' }, { word: 'three', emoji: '3️⃣' }, { word: 'throw', emoji: '🤾' },
      { word: 'thank', emoji: '🙏' }, { word: 'thick', emoji: '📕' }, { word: 'thing', emoji: '📦' }, { word: 'thumb', emoji: '👍' },
    ]},
    { blend: 'wh', sound: '/w/', words: [
      { word: 'when', emoji: '⏰' }, { word: 'what', emoji: '❓' }, { word: 'white', emoji: '⬜' }, { word: 'whale', emoji: '🐋' },
      { word: 'wheel', emoji: '🎡' }, { word: 'where', emoji: '📍' }, { word: 'which', emoji: '🤷' }, { word: 'while', emoji: '⏳' },
      { word: 'whisper', emoji: '🤫' }, { word: 'whistle', emoji: '😗' }, { word: 'whip', emoji: '🏇' }, { word: 'why', emoji: '❔' },
    ]},
    { blend: 'bl', sound: '/bl/', words: [
      { word: 'blue', emoji: '🔵' }, { word: 'black', emoji: '⬛' }, { word: 'block', emoji: '🧱' }, { word: 'blow', emoji: '💨' },
      { word: 'blend', emoji: '🌀' }, { word: 'blanket', emoji: '🛏️' }, { word: 'blade', emoji: '🗡️' }, { word: 'blaze', emoji: '🔥' },
      { word: 'blind', emoji: '👁️' }, { word: 'blink', emoji: '😉' }, { word: 'blood', emoji: '🩸' }, { word: 'bloom', emoji: '🌸' },
    ]},
    { blend: 'cl', sound: '/kl/', words: [
      { word: 'clap', emoji: '👏' }, { word: 'class', emoji: '🏫' }, { word: 'clock', emoji: '🕐' }, { word: 'clean', emoji: '✨' },
      { word: 'close', emoji: '🚪' }, { word: 'cloud', emoji: '☁️' }, { word: 'climb', emoji: '🧗' }, { word: 'clip', emoji: '📎' },
      { word: 'cloth', emoji: '🧵' }, { word: 'clown', emoji: '🤡' }, { word: 'club', emoji: '🏌️' }, { word: 'claw', emoji: '🦞' },
    ]},
    { blend: 'fl', sound: '/fl/', words: [
      { word: 'flag', emoji: '🚩' }, { word: 'fly', emoji: '🪰' }, { word: 'flower', emoji: '🌸' }, { word: 'flat', emoji: '📋' },
      { word: 'floor', emoji: '🏠' }, { word: 'flip', emoji: '🔄' }, { word: 'flame', emoji: '🔥' }, { word: 'flash', emoji: '⚡' },
      { word: 'float', emoji: '🎈' }, { word: 'flock', emoji: '🐑' }, { word: 'flood', emoji: '🌊' }, { word: 'flute', emoji: '🎶' },
    ]},
    { blend: 'gl', sound: '/gl/', words: [
      { word: 'glad', emoji: '😊' }, { word: 'glass', emoji: '🥛' }, { word: 'glow', emoji: '✨' }, { word: 'glue', emoji: '🧴' },
      { word: 'globe', emoji: '🌍' }, { word: 'glove', emoji: '🧤' }, { word: 'glide', emoji: '🛷' }, { word: 'glitter', emoji: '💫' },
      { word: 'glory', emoji: '🏆' }, { word: 'glimpse', emoji: '👀' }, { word: 'gloomy', emoji: '😔' }, { word: 'glossy', emoji: '🖼️' },
    ]},
    { blend: 'pl', sound: '/pl/', words: [
      { word: 'play', emoji: '🎮' }, { word: 'plan', emoji: '📋' }, { word: 'plate', emoji: '🍽️' }, { word: 'plant', emoji: '🌱' },
      { word: 'place', emoji: '📍' }, { word: 'plane', emoji: '✈️' }, { word: 'please', emoji: '🙏' }, { word: 'plenty', emoji: '📦' },
      { word: 'plum', emoji: '🫐' }, { word: 'plus', emoji: '➕' }, { word: 'plug', emoji: '🔌' }, { word: 'plop', emoji: '💧' },
    ]},
    { blend: 'sl', sound: '/sl/', words: [
      { word: 'slow', emoji: '🐢' }, { word: 'sleep', emoji: '😴' }, { word: 'slide', emoji: '🛝' }, { word: 'slip', emoji: '🍌' },
      { word: 'slim', emoji: '🧍' }, { word: 'slime', emoji: '💚' }, { word: 'slice', emoji: '🍕' }, { word: 'sled', emoji: '🛷' },
      { word: 'slope', emoji: '⛷️' }, { word: 'sleeve', emoji: '👕' }, { word: 'slap', emoji: '✋' }, { word: 'slug', emoji: '🐌' },
    ]},
    { blend: 'br', sound: '/br/', words: [
      { word: 'bread', emoji: '🍞' }, { word: 'brown', emoji: '🟤' }, { word: 'brush', emoji: '🖌️' }, { word: 'brain', emoji: '🧠' },
      { word: 'brave', emoji: '💪' }, { word: 'bridge', emoji: '🌉' }, { word: 'break', emoji: '💔' }, { word: 'brick', emoji: '🧱' },
      { word: 'bring', emoji: '📦' }, { word: 'bright', emoji: '☀️' }, { word: 'brother', emoji: '👦' }, { word: 'broom', emoji: '🧹' },
    ]},
    { blend: 'cr', sound: '/kr/', words: [
      { word: 'crab', emoji: '🦀' }, { word: 'cry', emoji: '😢' }, { word: 'crown', emoji: '👑' }, { word: 'cream', emoji: '🍦' },
      { word: 'cross', emoji: '❌' }, { word: 'crayon', emoji: '🖍️' }, { word: 'crash', emoji: '💥' }, { word: 'crane', emoji: '🏗️' },
      { word: 'crisp', emoji: '🥬' }, { word: 'crop', emoji: '🌾' }, { word: 'crowd', emoji: '👥' }, { word: 'cricket', emoji: '🦗' },
    ]},
    { blend: 'dr', sound: '/dr/', words: [
      { word: 'draw', emoji: '✏️' }, { word: 'dream', emoji: '💭' }, { word: 'drink', emoji: '🥤' }, { word: 'drive', emoji: '🚗' },
      { word: 'drop', emoji: '💧' }, { word: 'drum', emoji: '🥁' }, { word: 'dress', emoji: '👗' }, { word: 'dry', emoji: '☀️' },
      { word: 'dragon', emoji: '🐉' }, { word: 'drip', emoji: '💦' }, { word: 'drill', emoji: '🔩' }, { word: 'drift', emoji: '🌬️' },
    ]},
    { blend: 'fr', sound: '/fr/', words: [
      { word: 'frog', emoji: '🐸' }, { word: 'free', emoji: '🆓' }, { word: 'friend', emoji: '👫' }, { word: 'fresh', emoji: '🌿' },
      { word: 'from', emoji: '📍' }, { word: 'front', emoji: '⏮️' }, { word: 'fruit', emoji: '🍎' }, { word: 'frame', emoji: '🖼️' },
      { word: 'freeze', emoji: '🥶' }, { word: 'fries', emoji: '🍟' }, { word: 'frown', emoji: '😠' }, { word: 'friday', emoji: '📅' },
    ]},
    { blend: 'gr', sound: '/gr/', words: [
      { word: 'green', emoji: '💚' }, { word: 'grass', emoji: '🌿' }, { word: 'grape', emoji: '🍇' }, { word: 'grow', emoji: '🌱' },
      { word: 'group', emoji: '👥' }, { word: 'great', emoji: '👍' }, { word: 'gray', emoji: '🩶' }, { word: 'grab', emoji: '✊' },
      { word: 'ground', emoji: '🌍' }, { word: 'grill', emoji: '🍖' }, { word: 'grin', emoji: '😁' }, { word: 'grade', emoji: '📊' },
    ]},
    { blend: 'pr', sound: '/pr/', words: [
      { word: 'prince', emoji: '🤴' }, { word: 'prize', emoji: '🏆' }, { word: 'print', emoji: '🖨️' }, { word: 'proud', emoji: '😊' },
      { word: 'pretty', emoji: '💄' }, { word: 'press', emoji: '📰' }, { word: 'problem', emoji: '❓' }, { word: 'promise', emoji: '🤝' },
      { word: 'pray', emoji: '🙏' }, { word: 'price', emoji: '💰' }, { word: 'prop', emoji: '🎭' }, { word: 'proof', emoji: '✅' },
    ]},
    { blend: 'tr', sound: '/tr/', words: [
      { word: 'tree', emoji: '🌳' }, { word: 'train', emoji: '🚂' }, { word: 'truck', emoji: '🚚' }, { word: 'true', emoji: '✅' },
      { word: 'trip', emoji: '✈️' }, { word: 'try', emoji: '💪' }, { word: 'trick', emoji: '🎩' }, { word: 'trash', emoji: '🗑️' },
      { word: 'treat', emoji: '🍬' }, { word: 'track', emoji: '🛤️' }, { word: 'trade', emoji: '🤝' }, { word: 'trap', emoji: '🪤' },
    ]},
    { blend: 'st', sound: '/st/', words: [
      { word: 'star', emoji: '⭐' }, { word: 'stop', emoji: '🛑' }, { word: 'step', emoji: '👣' }, { word: 'stone', emoji: '🪨' },
      { word: 'story', emoji: '📖' }, { word: 'stick', emoji: '🪵' }, { word: 'store', emoji: '🏪' }, { word: 'stand', emoji: '🧍' },
      { word: 'start', emoji: '▶️' }, { word: 'stay', emoji: '🏠' }, { word: 'stamp', emoji: '📬' }, { word: 'stair', emoji: '🪜' },
    ]},
    { blend: 'sp', sound: '/sp/', words: [
      { word: 'spin', emoji: '🌀' }, { word: 'spot', emoji: '⭕' }, { word: 'space', emoji: '🚀' }, { word: 'spoon', emoji: '🥄' },
      { word: 'speak', emoji: '🗣️' }, { word: 'spider', emoji: '🕷️' }, { word: 'speed', emoji: '⚡' }, { word: 'spell', emoji: '📝' },
      { word: 'spend', emoji: '💸' }, { word: 'sport', emoji: '⚽' }, { word: 'spring', emoji: '🌸' }, { word: 'spark', emoji: '✨' },
    ]},
    { blend: 'sc/sk', sound: '/sk/', words: [
      { word: 'school', emoji: '🏫' }, { word: 'sky', emoji: '🌤️' }, { word: 'skin', emoji: '🖐️' }, { word: 'skip', emoji: '🚶' },
      { word: 'skate', emoji: '⛸️' }, { word: 'scale', emoji: '⚖️' }, { word: 'scare', emoji: '😱' }, { word: 'score', emoji: '🎯' },
      { word: 'scout', emoji: '🏕️' }, { word: 'skill', emoji: '💪' }, { word: 'skull', emoji: '💀' }, { word: 'sketch', emoji: '✏️' },
    ]},
    { blend: 'sm', sound: '/sm/', words: [
      { word: 'small', emoji: '🐜' }, { word: 'smile', emoji: '😊' }, { word: 'smell', emoji: '👃' }, { word: 'smart', emoji: '🧠' },
      { word: 'smoke', emoji: '💨' }, { word: 'smooth', emoji: '🧈' }, { word: 'smash', emoji: '💥' }, { word: 'snap', emoji: '🫰' },
      { word: 'snake', emoji: '🐍' }, { word: 'snow', emoji: '❄️' }, { word: 'snack', emoji: '🍪' }, { word: 'snail', emoji: '🐌' },
    ]},
    { blend: 'sw', sound: '/sw/', words: [
      { word: 'swim', emoji: '🏊' }, { word: 'sweet', emoji: '🍬' }, { word: 'swing', emoji: '🛝' }, { word: 'switch', emoji: '🔀' },
      { word: 'sweep', emoji: '🧹' }, { word: 'swan', emoji: '🦢' }, { word: 'sweat', emoji: '💦' }, { word: 'sword', emoji: '⚔️' },
      { word: 'swamp', emoji: '🌿' }, { word: 'swift', emoji: '💨' }, { word: 'swirl', emoji: '🌀' }, { word: 'swell', emoji: '🌊' },
    ]},
    { blend: 'tw', sound: '/tw/', words: [
      { word: 'two', emoji: '2️⃣' }, { word: 'twin', emoji: '👯' }, { word: 'twist', emoji: '🌀' }, { word: 'twelve', emoji: '🕛' },
      { word: 'twenty', emoji: '2️⃣0️⃣' }, { word: 'twice', emoji: '✌️' }, { word: 'twinkle', emoji: '✨' }, { word: 'tweet', emoji: '🐦' },
      { word: 'twig', emoji: '🌿' }, { word: 'twilight', emoji: '🌅' }, { word: 'twirl', emoji: '💃' }, { word: 'tweed', emoji: '🧥' },
    ]},
  ],
};

export default blendData;
