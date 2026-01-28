export const LEVELS = [
  { min: 0, name: '새싹 학습자', emoji: '🌱', color: 'text-green-400' },
  { min: 10, name: '소리 친구', emoji: '🎵', color: 'text-green-500' },
  { min: 20, name: '단어 탐험가', emoji: '🚀', color: 'text-blue-500' },
  { min: 35, name: '읽기 전문가', emoji: '🌟', color: 'text-purple-500' },
  { min: 50, name: '파닉스 마스터', emoji: '👑', color: 'text-yellow-500' },
];

// === 파닉스 발음 시스템 ===

// 교습용: 실제 영어 단어 3개를 천천히 읽어줌
// TTS는 실제 단어를 정확히 발음하므로, 아이가 공통 소리를 자연스럽게 인식
export const PHONICS_TEACH = {
  A: 'apple. ant. alligator.',
  B: 'ball. bear. banana.',
  C: 'cat. car. cake.',
  D: 'dog. duck. door.',
  E: 'egg. elephant. elbow.',
  F: 'fish. frog. flower.',
  G: 'goat. grape. gift.',
  H: 'hat. horse. house.',
  I: 'igloo. insect. ink.',
  J: 'jam. jet. jump.',
  K: 'kite. king. key.',
  L: 'lion. leaf. lemon.',
  M: 'moon. mouse. milk.',
  N: 'nose. nut. nest.',
  O: 'octopus. orange. olive.',
  P: 'pig. pizza. panda.',
  Q: 'queen. quilt. question.',
  R: 'rabbit. rain. robot.',
  S: 'sun. star. snake.',
  T: 'tree. tiger. train.',
  U: 'umbrella. up. under.',
  V: 'van. violin. vegetable.',
  W: 'water. whale. watch.',
  X: 'box. fox. six.',
  Y: 'yellow. yo-yo. yak.',
  Z: 'zebra. zoo. zero.',
};

// CVC 단어 조립용 빠른 음가
// 실제 짧은 영어 단어로 음가를 근사 (TTS가 철자로 읽는 문제 방지)
export const PHONICS_SOUNDS = {
  a: 'at',     // /æ/ - "앳"의 첫소리
  b: 'bud',    // /b/
  c: 'cup',    // /k/
  d: 'dug',    // /d/
  e: 'ed',     // /ɛ/
  f: 'fun',    // /f/
  g: 'gut',    // /g/
  h: 'hut',    // /h/
  i: 'it',     // /ɪ/
  j: 'jug',    // /dʒ/
  k: 'kit',    // /k/
  l: 'lip',    // /l/
  m: 'mud',    // /m/
  n: 'nut',    // /n/
  o: 'on',     // /ɒ/
  p: 'pup',    // /p/
  q: 'quit',   // /kw/
  r: 'rub',    // /r/
  s: 'sit',    // /s/
  t: 'tip',    // /t/
  u: 'up',     // /ʌ/
  v: 'van',    // /v/
  w: 'wet',    // /w/
  x: 'ox',     // /ks/
  y: 'yes',    // /j/
  z: 'zip',    // /z/
};

export const STAR_REWARDS = {
  LESSON_COMPLETE: 10,
  GAME_CORRECT: 5,
};

export const STORAGE_KEY = 'phonics_app_data';
