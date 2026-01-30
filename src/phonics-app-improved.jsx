import React, { useState, useEffect, useCallback, useRef } from 'react';

// ============================================
// 고품질 TTS 시스템 (개선된 버전)
// ============================================

// 음성 캐시 및 상태
let cachedVoice = null;
let voicesInitialized = false;
let voiceLoadPromise = null;

// 파닉스 발음 매핑 (알파벳 → 음가)
const PHONICS_SOUNDS = {
  'A': 'æ', 'B': 'buh', 'C': 'kuh', 'D': 'duh', 'E': 'eh',
  'F': 'fff', 'G': 'guh', 'H': 'huh', 'I': 'ih', 'J': 'juh',
  'K': 'kuh', 'L': 'lll', 'M': 'mmm', 'N': 'nnn', 'O': 'ah',
  'P': 'puh', 'Q': 'kwuh', 'R': 'rrr', 'S': 'sss', 'T': 'tuh',
  'U': 'uh', 'V': 'vvv', 'W': 'wuh', 'X': 'ks', 'Y': 'yuh', 'Z': 'zzz'
};

// 고품질 음성 로드 (Promise 기반)
const loadVoices = () => {
  if (voiceLoadPromise) return voiceLoadPromise;
  
  voiceLoadPromise = new Promise((resolve) => {
    const tryGetVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      if (voices.length > 0) {
        // 우선순위별 음성 선택
        const voicePreferences = [
          // 1순위: Google 고품질 (가장 자연스러움)
          (v) => v.name.includes('Google') && v.lang.startsWith('en'),
          // 2순위: Microsoft Neural (Windows 11)
          (v) => v.name.includes('Microsoft') && (v.name.includes('Online') || v.name.includes('Natural')),
          // 3순위: Apple 고품질
          (v) => ['Samantha', 'Alex', 'Karen', 'Daniel', 'Moira', 'Tessa'].some(n => v.name.includes(n)),
          // 4순위: Microsoft 일반
          (v) => v.name.includes('Microsoft') && v.lang.startsWith('en'),
          // 5순위: 원격 서버 음성 (더 자연스러움)
          (v) => !v.localService && v.lang.startsWith('en'),
          // 6순위: 모든 영어 음성
          (v) => v.lang.startsWith('en-US'),
          (v) => v.lang.startsWith('en'),
        ];
        
        for (const preference of voicePreferences) {
          const found = voices.find(preference);
          if (found) {
            cachedVoice = found;
            voicesInitialized = true;
            console.log('🎤 Selected voice:', found.name, found.lang, found.localService ? '(local)' : '(remote)');
            resolve(found);
            return;
          }
        }
        
        // 기본값
        cachedVoice = voices[0];
        voicesInitialized = true;
        resolve(voices[0]);
      }
    };
    
    // 즉시 시도
    tryGetVoices();
    
    // 음성 로드 이벤트
    if (!voicesInitialized && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = tryGetVoices;
      // 타임아웃
      setTimeout(() => {
        if (!voicesInitialized) {
          console.warn('Voice loading timeout');
          resolve(null);
        }
      }, 3000);
    }
  });
  
  return voiceLoadPromise;
};

// 개선된 발음 함수
const speak = async (text, options = {}) => {
  const {
    rate = 0.8,
    pitch = 1.0,
    isPhonics = false, // 파닉스 발음 모드
    onEnd = null,
    onStart = null
  } = options;
  
  if (!window.speechSynthesis) {
    console.warn('Speech synthesis not supported');
    onEnd?.();
    return;
  }
  
  // 이전 발화 취소
  window.speechSynthesis.cancel();
  
  // 음성 로드 대기
  await loadVoices();
  
  // 파닉스 모드: 단일 알파벳은 음가로 변환
  let processedText = text;
  if (isPhonics && text.length === 1 && /[A-Z]/i.test(text)) {
    processedText = PHONICS_SOUNDS[text.toUpperCase()] || text;
  }
  
  const utterance = new SpeechSynthesisUtterance(processedText);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1.0;
  
  if (cachedVoice) {
    utterance.voice = cachedVoice;
  }
  
  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = (e) => {
    console.error('Speech error:', e);
    onEnd?.();
  };
  
  // Chrome 버그 우회: 긴 텍스트 중단 방지
  const resumeInterval = setInterval(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 10000);
  
  utterance.onend = () => {
    clearInterval(resumeInterval);
    onEnd?.();
  };
  
  // 약간의 지연 후 발화 (안정성)
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 50);
};

// 음가 천천히 발음 (파닉스 학습용)
const speakPhonics = (letter, onEnd) => {
  speak(letter, { rate: 0.6, isPhonics: true, onEnd });
};

// 단어 발음 (자연스럽게)
const speakWord = (word, onEnd) => {
  speak(word, { rate: 0.75, onEnd });
};

// 문장 발음
const speakSentence = (sentence, onEnd) => {
  speak(sentence, { rate: 0.85, onEnd });
};

// ============================================
// 학습 데이터
// ============================================
const learningData = {
  stage1: {
    title: "알파벳 소리",
    icon: "🔤",
    description: "각 알파벳의 소리를 배워요",
    lessons: [
      { letter: "A", sound: "/æ/", words: [{ word: "apple", emoji: "🍎" }, { word: "ant", emoji: "🐜" }, { word: "alligator", emoji: "🐊" }] },
      { letter: "B", sound: "/b/", words: [{ word: "ball", emoji: "⚽" }, { word: "bear", emoji: "🐻" }, { word: "banana", emoji: "🍌" }] },
      { letter: "C", sound: "/k/", words: [{ word: "cat", emoji: "🐱" }, { word: "car", emoji: "🚗" }, { word: "cake", emoji: "🎂" }] },
      { letter: "D", sound: "/d/", words: [{ word: "dog", emoji: "🐶" }, { word: "duck", emoji: "🦆" }, { word: "door", emoji: "🚪" }] },
      { letter: "E", sound: "/ɛ/", words: [{ word: "egg", emoji: "🥚" }, { word: "elephant", emoji: "🐘" }, { word: "elbow", emoji: "💪" }] },
      { letter: "F", sound: "/f/", words: [{ word: "fish", emoji: "🐟" }, { word: "frog", emoji: "🐸" }, { word: "flower", emoji: "🌸" }] },
      { letter: "G", sound: "/g/", words: [{ word: "goat", emoji: "🐐" }, { word: "grape", emoji: "🍇" }, { word: "gift", emoji: "🎁" }] },
      { letter: "H", sound: "/h/", words: [{ word: "hat", emoji: "🎩" }, { word: "horse", emoji: "🐴" }, { word: "house", emoji: "🏠" }] },
      { letter: "I", sound: "/ɪ/", words: [{ word: "igloo", emoji: "🏠" }, { word: "insect", emoji: "🐛" }, { word: "ink", emoji: "🖋️" }] },
      { letter: "J", sound: "/dʒ/", words: [{ word: "jam", emoji: "🍯" }, { word: "jet", emoji: "✈️" }, { word: "jump", emoji: "🦘" }] },
      { letter: "K", sound: "/k/", words: [{ word: "kite", emoji: "🪁" }, { word: "king", emoji: "🤴" }, { word: "key", emoji: "🔑" }] },
      { letter: "L", sound: "/l/", words: [{ word: "lion", emoji: "🦁" }, { word: "leaf", emoji: "🍃" }, { word: "lemon", emoji: "🍋" }] },
      { letter: "M", sound: "/m/", words: [{ word: "moon", emoji: "🌙" }, { word: "mouse", emoji: "🐭" }, { word: "milk", emoji: "🥛" }] },
      { letter: "N", sound: "/n/", words: [{ word: "nose", emoji: "👃" }, { word: "nut", emoji: "🥜" }, { word: "nest", emoji: "🪹" }] },
      { letter: "O", sound: "/ɒ/", words: [{ word: "octopus", emoji: "🐙" }, { word: "orange", emoji: "🍊" }, { word: "owl", emoji: "🦉" }] },
      { letter: "P", sound: "/p/", words: [{ word: "pig", emoji: "🐷" }, { word: "pizza", emoji: "🍕" }, { word: "panda", emoji: "🐼" }] },
      { letter: "Q", sound: "/kw/", words: [{ word: "queen", emoji: "👸" }, { word: "quilt", emoji: "🛏️" }, { word: "question", emoji: "❓" }] },
      { letter: "R", sound: "/r/", words: [{ word: "rabbit", emoji: "🐰" }, { word: "rain", emoji: "🌧️" }, { word: "robot", emoji: "🤖" }] },
      { letter: "S", sound: "/s/", words: [{ word: "sun", emoji: "☀️" }, { word: "star", emoji: "⭐" }, { word: "snake", emoji: "🐍" }] },
      { letter: "T", sound: "/t/", words: [{ word: "tree", emoji: "🌳" }, { word: "tiger", emoji: "🐯" }, { word: "train", emoji: "🚂" }] },
      { letter: "U", sound: "/ʌ/", words: [{ word: "umbrella", emoji: "☂️" }, { word: "up", emoji: "⬆️" }, { word: "unicorn", emoji: "🦄" }] },
      { letter: "V", sound: "/v/", words: [{ word: "van", emoji: "🚐" }, { word: "violin", emoji: "🎻" }, { word: "vegetable", emoji: "🥕" }] },
      { letter: "W", sound: "/w/", words: [{ word: "water", emoji: "💧" }, { word: "whale", emoji: "🐋" }, { word: "watch", emoji: "⌚" }] },
      { letter: "X", sound: "/ks/", words: [{ word: "box", emoji: "📦" }, { word: "fox", emoji: "🦊" }, { word: "six", emoji: "6️⃣" }] },
      { letter: "Y", sound: "/j/", words: [{ word: "yellow", emoji: "💛" }, { word: "yo-yo", emoji: "🪀" }, { word: "yak", emoji: "🦬" }] },
      { letter: "Z", sound: "/z/", words: [{ word: "zebra", emoji: "🦓" }, { word: "zoo", emoji: "🦁" }, { word: "zero", emoji: "0️⃣" }] },
    ]
  },
  stage2: {
    title: "CVC 단어",
    icon: "📖",
    description: "자음-모음-자음 단어를 읽어요",
    lessons: [
      { vowel: "a", words: [
        { word: "cat", emoji: "🐱", phonemes: ["c", "a", "t"] },
        { word: "bat", emoji: "🦇", phonemes: ["b", "a", "t"] },
        { word: "hat", emoji: "🎩", phonemes: ["h", "a", "t"] },
        { word: "map", emoji: "🗺️", phonemes: ["m", "a", "p"] },
        { word: "bag", emoji: "👜", phonemes: ["b", "a", "g"] },
        { word: "dad", emoji: "👨", phonemes: ["d", "a", "d"] },
        { word: "can", emoji: "🥫", phonemes: ["c", "a", "n"] },
        { word: "fan", emoji: "🪭", phonemes: ["f", "a", "n"] },
      ]},
      { vowel: "e", words: [
        { word: "bed", emoji: "🛏️", phonemes: ["b", "e", "d"] },
        { word: "red", emoji: "🔴", phonemes: ["r", "e", "d"] },
        { word: "pen", emoji: "🖊️", phonemes: ["p", "e", "n"] },
        { word: "hen", emoji: "🐔", phonemes: ["h", "e", "n"] },
        { word: "leg", emoji: "🦵", phonemes: ["l", "e", "g"] },
        { word: "web", emoji: "🕸️", phonemes: ["w", "e", "b"] },
        { word: "jet", emoji: "✈️", phonemes: ["j", "e", "t"] },
        { word: "pet", emoji: "🐕", phonemes: ["p", "e", "t"] },
      ]},
      { vowel: "i", words: [
        { word: "pig", emoji: "🐷", phonemes: ["p", "i", "g"] },
        { word: "big", emoji: "🐘", phonemes: ["b", "i", "g"] },
        { word: "dig", emoji: "⛏️", phonemes: ["d", "i", "g"] },
        { word: "sit", emoji: "🪑", phonemes: ["s", "i", "t"] },
        { word: "hit", emoji: "👊", phonemes: ["h", "i", "t"] },
        { word: "fin", emoji: "🦈", phonemes: ["f", "i", "n"] },
        { word: "pin", emoji: "📌", phonemes: ["p", "i", "n"] },
        { word: "win", emoji: "🏆", phonemes: ["w", "i", "n"] },
      ]},
      { vowel: "o", words: [
        { word: "dog", emoji: "🐶", phonemes: ["d", "o", "g"] },
        { word: "log", emoji: "🪵", phonemes: ["l", "o", "g"] },
        { word: "fog", emoji: "🌫️", phonemes: ["f", "o", "g"] },
        { word: "hot", emoji: "🔥", phonemes: ["h", "o", "t"] },
        { word: "pot", emoji: "🍲", phonemes: ["p", "o", "t"] },
        { word: "top", emoji: "🔝", phonemes: ["t", "o", "p"] },
        { word: "hop", emoji: "🐰", phonemes: ["h", "o", "p"] },
        { word: "box", emoji: "📦", phonemes: ["b", "o", "x"] },
      ]},
      { vowel: "u", words: [
        { word: "bus", emoji: "🚌", phonemes: ["b", "u", "s"] },
        { word: "cup", emoji: "🥤", phonemes: ["c", "u", "p"] },
        { word: "sun", emoji: "☀️", phonemes: ["s", "u", "n"] },
        { word: "run", emoji: "🏃", phonemes: ["r", "u", "n"] },
        { word: "fun", emoji: "🎉", phonemes: ["f", "u", "n"] },
        { word: "bug", emoji: "🐛", phonemes: ["b", "u", "g"] },
        { word: "hug", emoji: "🤗", phonemes: ["h", "u", "g"] },
        { word: "rug", emoji: "🟫", phonemes: ["r", "u", "g"] },
      ]},
    ]
  },
  stage3: {
    title: "자음 블렌드",
    icon: "🔀",
    description: "두 자음이 합쳐진 소리를 배워요",
    lessons: [
      { blend: "sh", sound: "/ʃ/", words: [
        { word: "ship", emoji: "🚢" }, { word: "shop", emoji: "🏪" }, { word: "fish", emoji: "🐟" }, { word: "she", emoji: "👩" }
      ]},
      { blend: "ch", sound: "/tʃ/", words: [
        { word: "chip", emoji: "🍟" }, { word: "chat", emoji: "💬" }, { word: "much", emoji: "📈" }, { word: "rich", emoji: "💰" }
      ]},
      { blend: "th", sound: "/θ/", words: [
        { word: "thin", emoji: "📏" }, { word: "bath", emoji: "🛁" }, { word: "math", emoji: "🔢" }, { word: "with", emoji: "🤝" }
      ]},
      { blend: "wh", sound: "/w/", words: [
        { word: "when", emoji: "⏰" }, { word: "what", emoji: "❓" }, { word: "white", emoji: "⬜" }, { word: "whale", emoji: "🐋" }
      ]},
      { blend: "bl", sound: "/bl/", words: [
        { word: "blue", emoji: "🔵" }, { word: "black", emoji: "⬛" }, { word: "block", emoji: "🧱" }, { word: "blow", emoji: "💨" }
      ]},
      { blend: "cl", sound: "/kl/", words: [
        { word: "clap", emoji: "👏" }, { word: "class", emoji: "🏫" }, { word: "clock", emoji: "🕐" }, { word: "clean", emoji: "✨" }
      ]},
      { blend: "fl", sound: "/fl/", words: [
        { word: "flag", emoji: "🚩" }, { word: "fly", emoji: "🪰" }, { word: "flower", emoji: "🌸" }, { word: "flat", emoji: "📋" }
      ]},
      { blend: "br", sound: "/br/", words: [
        { word: "bread", emoji: "🍞" }, { word: "brown", emoji: "🟤" }, { word: "brush", emoji: "🖌️" }, { word: "brain", emoji: "🧠" }
      ]},
      { blend: "cr", sound: "/kr/", words: [
        { word: "crab", emoji: "🦀" }, { word: "cry", emoji: "😢" }, { word: "crown", emoji: "👑" }, { word: "cream", emoji: "🍦" }
      ]},
      { blend: "gr", sound: "/gr/", words: [
        { word: "green", emoji: "💚" }, { word: "grass", emoji: "🌿" }, { word: "grape", emoji: "🍇" }, { word: "grow", emoji: "🌱" }
      ]},
    ]
  },
  stage4: {
    title: "장모음 & Magic E",
    icon: "✨",
    description: "마법의 E가 모음을 바꿔요",
    lessons: [
      { pattern: "a_e", sound: "/eɪ/", shortWord: "cap", longWord: "cape", words: [
        { word: "cake", emoji: "🎂" }, { word: "lake", emoji: "🏞️" }, { word: "make", emoji: "🔨" }, { word: "name", emoji: "📛" }
      ]},
      { pattern: "i_e", sound: "/aɪ/", shortWord: "kit", longWord: "kite", words: [
        { word: "bike", emoji: "🚲" }, { word: "like", emoji: "❤️" }, { word: "time", emoji: "⏰" }, { word: "five", emoji: "5️⃣" }
      ]},
      { pattern: "o_e", sound: "/oʊ/", shortWord: "hop", longWord: "hope", words: [
        { word: "home", emoji: "🏠" }, { word: "bone", emoji: "🦴" }, { word: "note", emoji: "📝" }, { word: "rose", emoji: "🌹" }
      ]},
      { pattern: "u_e", sound: "/juː/", shortWord: "cub", longWord: "cube", words: [
        { word: "cute", emoji: "🥰" }, { word: "huge", emoji: "🐘" }, { word: "mule", emoji: "🫏" }, { word: "tune", emoji: "🎵" }
      ]},
      { pattern: "ee", sound: "/iː/", words: [
        { word: "bee", emoji: "🐝" }, { word: "tree", emoji: "🌳" }, { word: "see", emoji: "👀" }, { word: "free", emoji: "🆓" }
      ]},
      { pattern: "ea", sound: "/iː/", words: [
        { word: "eat", emoji: "🍽️" }, { word: "read", emoji: "📖" }, { word: "sea", emoji: "🌊" }, { word: "team", emoji: "👥" }
      ]},
      { pattern: "oa", sound: "/oʊ/", words: [
        { word: "boat", emoji: "⛵" }, { word: "coat", emoji: "🧥" }, { word: "goat", emoji: "🐐" }, { word: "road", emoji: "🛣️" }
      ]},
      { pattern: "ai", sound: "/eɪ/", words: [
        { word: "rain", emoji: "🌧️" }, { word: "tail", emoji: "🐕" }, { word: "mail", emoji: "📬" }, { word: "sail", emoji: "⛵" }
      ]},
    ]
  },
  stage5: {
    title: "특수 규칙",
    icon: "📚",
    description: "특별한 발음 규칙을 배워요",
    lessons: [
      { rule: "ck", sound: "/k/", words: [
        { word: "duck", emoji: "🦆" }, { word: "back", emoji: "🔙" }, { word: "kick", emoji: "🦵" }, { word: "rock", emoji: "🪨" }
      ]},
      { rule: "ng", sound: "/ŋ/", words: [
        { word: "ring", emoji: "💍" }, { word: "sing", emoji: "🎤" }, { word: "king", emoji: "🤴" }, { word: "long", emoji: "📏" }
      ]},
      { rule: "oo (short)", sound: "/ʊ/", words: [
        { word: "book", emoji: "📖" }, { word: "look", emoji: "👀" }, { word: "cook", emoji: "👨‍🍳" }, { word: "good", emoji: "👍" }
      ]},
      { rule: "oo (long)", sound: "/uː/", words: [
        { word: "moon", emoji: "🌙" }, { word: "food", emoji: "🍔" }, { word: "cool", emoji: "😎" }, { word: "pool", emoji: "🏊" }
      ]},
      { rule: "ow", sound: "/aʊ/", words: [
        { word: "cow", emoji: "🐄" }, { word: "now", emoji: "⏰" }, { word: "how", emoji: "❓" }, { word: "wow", emoji: "😮" }
      ]},
      { rule: "ou", sound: "/aʊ/", words: [
        { word: "out", emoji: "🚪" }, { word: "house", emoji: "🏠" }, { word: "mouse", emoji: "🐭" }, { word: "loud", emoji: "🔊" }
      ]},
      { rule: "aw", sound: "/ɔː/", words: [
        { word: "saw", emoji: "🪚" }, { word: "paw", emoji: "🐾" }, { word: "draw", emoji: "✏️" }, { word: "law", emoji: "⚖️" }
      ]},
      { rule: "er", sound: "/ɜːr/", words: [
        { word: "her", emoji: "👩" }, { word: "water", emoji: "💧" }, { word: "sister", emoji: "👧" }, { word: "teacher", emoji: "👩‍🏫" }
      ]},
    ]
  },
  stage6: {
    title: "문장 읽기",
    icon: "📝",
    description: "문장을 읽고 이해해요",
    lessons: [
      { level: "Easy", sentences: [
        { text: "The cat sat on the mat.", emoji: "🐱", chunks: ["The cat", "sat on", "the mat."] },
        { text: "I can see a big dog.", emoji: "🐶", chunks: ["I can see", "a big dog."] },
        { text: "The sun is hot.", emoji: "☀️", chunks: ["The sun", "is hot."] },
      ]},
      { level: "Medium", sentences: [
        { text: "The white ship sails on the blue sea.", emoji: "🚢", chunks: ["The white ship", "sails on", "the blue sea."] },
        { text: "She likes to read books at home.", emoji: "📚", chunks: ["She likes", "to read books", "at home."] },
        { text: "The brown bear eats sweet honey.", emoji: "🐻", chunks: ["The brown bear", "eats", "sweet honey."] },
      ]},
      { level: "Hard", sentences: [
        { text: "The children play in the green garden after school.", emoji: "🏫", chunks: ["The children", "play in", "the green garden", "after school."] },
        { text: "My friend and I like to swim in the cool pool.", emoji: "🏊", chunks: ["My friend and I", "like to swim", "in the cool pool."] },
        { text: "The little mouse found some cheese in the house.", emoji: "🐭", chunks: ["The little mouse", "found some cheese", "in the house."] },
      ]},
    ]
  },
};

// ============================================
// 메인 앱 컴포넌트
// ============================================
export default function PhonicsApp() {
  // 사용자 상태
  const [userName, setUserName] = useState('');
  const [stars, setStars] = useState(0);
  const [completedLessons, setCompletedLessons] = useState({});
  
  // 앱 상태
  const [screen, setScreen] = useState('login');
  const [currentStage, setCurrentStage] = useState(1);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentGame, setCurrentGame] = useState(null);
  
  // 설정
  const [speechRate, setSpeechRate] = useState(0.8);
  const [showSettings, setShowSettings] = useState(false);
  
  // 음성 초기화
  useEffect(() => {
    loadVoices();
  }, []);
  
  // 로컬 스토리지 연동
  useEffect(() => {
    const saved = localStorage.getItem('phonicsProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setUserName(data.userName || '');
      setStars(data.stars || 0);
      setCompletedLessons(data.completedLessons || {});
      if (data.userName) setScreen('home');
    }
  }, []);
  
  useEffect(() => {
    if (userName) {
      localStorage.setItem('phonicsProgress', JSON.stringify({
        userName, stars, completedLessons
      }));
    }
  }, [userName, stars, completedLessons]);
  
  // 유틸리티 함수
  const addStars = useCallback((amount) => {
    setStars(prev => prev + amount);
  }, []);
  
  const markLessonComplete = useCallback((stage, lesson) => {
    setCompletedLessons(prev => ({
      ...prev,
      [`${stage}-${lesson}`]: true
    }));
  }, []);
  
  const getStageProgress = (stageNum) => {
    const stageData = learningData[`stage${stageNum}`];
    const total = stageData.lessons.length;
    const completed = stageData.lessons.filter((_, i) => 
      completedLessons[`${stageNum}-${i}`]
    ).length;
    return { total, completed };
  };
  
  const getLevel = () => {
    const totalCompleted = Object.keys(completedLessons).length;
    if (totalCompleted >= 50) return { name: '파닉스 마스터', emoji: '👑', color: 'text-yellow-500' };
    if (totalCompleted >= 35) return { name: '읽기 전문가', emoji: '🌟', color: 'text-purple-500' };
    if (totalCompleted >= 20) return { name: '단어 탐험가', emoji: '🚀', color: 'text-blue-500' };
    if (totalCompleted >= 10) return { name: '소리 친구', emoji: '🎵', color: 'text-green-500' };
    return { name: '새싹 학습자', emoji: '🌱', color: 'text-green-400' };
  };

  // ============================================
  // 화면 컴포넌트들
  // ============================================
  
  // 로그인 화면
  const LoginScreen = () => {
    const [inputName, setInputName] = useState('');
    
    const handleStart = () => {
      if (inputName.trim()) {
        setUserName(inputName.trim());
        setScreen('home');
        speakWord(`Hello ${inputName}! Let's learn phonics!`);
      }
    };
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">파닉스 마스터</h1>
          <p className="text-gray-500 mb-6">재미있게 영어 읽기를 배워요!</p>
          
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            placeholder="이름을 입력하세요"
            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl mb-4 text-center focus:border-blue-400 focus:outline-none transition-colors"
            maxLength={10}
          />
          
          <button
            onClick={handleStart}
            disabled={!inputName.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl text-xl font-bold disabled:opacity-50 hover:scale-105 active:scale-95 transition-transform shadow-lg"
          >
            🚀 시작하기!
          </button>
        </div>
      </div>
    );
  };
  
  // 홈 화면
  const HomeScreen = () => {
    const level = getLevel();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 p-4">
        <div className="max-w-md mx-auto">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 bg-white/30 px-4 py-2 rounded-full">
              <span className="text-xl">⭐</span>
              <span className="font-bold text-white text-lg">{stars}</span>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-white/30 p-3 rounded-full hover:bg-white/50 transition-colors"
            >
              <span className="text-xl">⚙️</span>
            </button>
          </div>
          
          {/* 프로필 카드 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
            <div className="text-center">
              <div className="text-6xl mb-2">{level.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800">{userName}</h2>
              <p className={`text-lg font-medium ${level.color}`}>{level.name}</p>
            </div>
          </div>
          
          {/* 메뉴 버튼들 */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setScreen('stages');
                speakWord("Let's learn!");
              }}
              className="w-full bg-gradient-to-r from-green-400 to-green-500 p-5 rounded-2xl shadow-lg hover:scale-102 active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl bg-white/30 p-3 rounded-xl">📖</span>
                <div className="text-left">
                  <div className="text-white font-bold text-xl">학습하기</div>
                  <div className="text-white/80 text-sm">파닉스 규칙을 배워요</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => {
                setScreen('games');
                speakWord("Let's play!");
              }}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 p-5 rounded-2xl shadow-lg hover:scale-102 active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl bg-white/30 p-3 rounded-xl">🎮</span>
                <div className="text-left">
                  <div className="text-white font-bold text-xl">게임하기</div>
                  <div className="text-white/80 text-sm">재미있게 복습해요</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setScreen('progress')}
              className="w-full bg-gradient-to-r from-purple-400 to-purple-500 p-5 rounded-2xl shadow-lg hover:scale-102 active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl bg-white/30 p-3 rounded-xl">📊</span>
                <div className="text-left">
                  <div className="text-white font-bold text-xl">내 진도</div>
                  <div className="text-white/80 text-sm">학습 현황을 확인해요</div>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        {/* 설정 모달 */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold mb-4">⚙️ 설정</h3>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">발음 속도</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>느리게</span>
                  <span>보통</span>
                  <span>빠르게</span>
                </div>
              </div>
              
              <button
                onClick={() => speak("Hello, this is a test.", { rate: speechRate })}
                className="w-full bg-blue-100 text-blue-600 p-3 rounded-xl mb-4 font-medium"
              >
                🔊 테스트
              </button>
              
              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-gray-800 text-white p-3 rounded-xl font-bold"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // 단계 선택 화면
  const StagesScreen = () => {
    const stages = [
      { num: 1, title: "알파벳 소리", icon: "🔤", color: "from-pink-400 to-pink-500" },
      { num: 2, title: "CVC 단어", icon: "📖", color: "from-orange-400 to-orange-500" },
      { num: 3, title: "자음 블렌드", icon: "🔀", color: "from-yellow-400 to-yellow-500" },
      { num: 4, title: "장모음 & Magic E", icon: "✨", color: "from-green-400 to-green-500" },
      { num: 5, title: "특수 규칙", icon: "📚", color: "from-blue-400 to-blue-500" },
      { num: 6, title: "문장 읽기", icon: "📝", color: "from-purple-400 to-purple-500" },
    ];
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-indigo-200 p-4">
        <div className="max-w-md mx-auto">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setScreen('home')}
              className="bg-white/30 p-3 rounded-full"
            >
              <span className="text-2xl">🏠</span>
            </button>
            <h1 className="text-2xl font-bold text-white">🗺️ 학습 단계</h1>
            <div className="flex items-center gap-1 bg-white/30 px-3 py-2 rounded-full">
              <span>⭐</span>
              <span className="font-bold text-white">{stars}</span>
            </div>
          </div>
          
          {/* 단계 목록 */}
          <div className="space-y-4">
            {stages.map((stage) => {
              const progress = getStageProgress(stage.num);
              const progressPercent = Math.round((progress.completed / progress.total) * 100);
              
              return (
                <button
                  key={stage.num}
                  onClick={() => {
                    setCurrentStage(stage.num);
                    setCurrentLesson(0);
                    setScreen('learning');
                    speakWord(stage.title);
                  }}
                  className={`w-full bg-gradient-to-r ${stage.color} p-4 rounded-2xl shadow-lg hover:scale-102 active:scale-98 transition-transform`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl bg-white/30 p-3 rounded-xl">
                      {stage.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-bold text-lg">
                        {stage.num}단계: {stage.title}
                      </div>
                      <div className="text-white/80 text-sm">
                        {progress.completed}/{progress.total} 완료
                      </div>
                      <div className="mt-2 bg-white/30 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-2 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-2xl text-white">▶</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 학습 화면
  const LearningScreen = () => {
    const stageData = learningData[`stage${currentStage}`];
    const lesson = stageData.lessons[currentLesson];
    const [showCelebration, setShowCelebration] = useState(false);
    
    // Stage 2 상태
    const [buildingWord, setBuildingWord] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    
    // Stage 6 상태
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    
    // 상태 리셋
    useEffect(() => {
      setBuildingWord([]);
      setCurrentWordIndex(0);
      setCurrentSentenceIndex(0);
      setHighlightIndex(-1);
    }, [currentStage, currentLesson]);

    const handleNext = () => {
      if (currentLesson < stageData.lessons.length - 1) {
        setCurrentLesson(currentLesson + 1);
      } else {
        setScreen('stages');
      }
    };

    const handleComplete = () => {
      if (!completedLessons[`${currentStage}-${currentLesson}`]) {
        markLessonComplete(currentStage, currentLesson);
        addStars(10);
        setShowCelebration(true);
        speakWord("Great job!");
        setTimeout(() => setShowCelebration(false), 2000);
      }
    };

    // 헤더 컴포넌트
    const Header = ({ title }) => (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setScreen('stages')}
          className="bg-white/30 p-3 rounded-full"
        >
          <span className="text-2xl">←</span>
        </button>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-1 bg-white/30 px-3 py-2 rounded-full">
          <span>⭐</span>
          <span className="font-bold text-white">{stars}</span>
        </div>
      </div>
    );

    // 네비게이션 버튼
    const NavigationButtons = () => (
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => currentLesson > 0 && setCurrentLesson(currentLesson - 1)}
          disabled={currentLesson === 0}
          className="flex-1 bg-white/80 p-4 rounded-xl font-bold disabled:opacity-50 active:scale-95 transition-transform"
        >
          ◀ 이전
        </button>
        <button
          onClick={handleComplete}
          className="flex-1 bg-yellow-400 p-4 rounded-xl font-bold active:scale-95 transition-transform"
        >
          ⭐ 완료!
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-white/80 p-4 rounded-xl font-bold active:scale-95 transition-transform"
        >
          다음 ▶
        </button>
      </div>
    );

    // 축하 애니메이션
    const Celebration = () => (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <div className="text-center animate-bounce">
          <div className="text-8xl">🎉</div>
          <div className="text-3xl font-bold text-white drop-shadow-lg mt-4">
            +10 ⭐
          </div>
        </div>
      </div>
    );

    // 1단계: 알파벳 소리
    if (currentStage === 1) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-pink-400 to-pink-200 p-4">
          <div className="max-w-md mx-auto">
            <Header title={`${currentLesson + 1}/${stageData.lessons.length}`} />
            
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              {/* 글자 카드 */}
              <button
                onClick={() => speakPhonics(lesson.letter)}
                className="w-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 mb-6 hover:scale-105 active:scale-95 transition-transform"
              >
                <div className="text-8xl font-bold text-blue-600 mb-2">
                  {lesson.letter}{lesson.letter.toLowerCase()}
                </div>
                <div className="text-2xl text-blue-500">🔊 {lesson.sound}</div>
                <p className="text-gray-500 mt-2">터치해서 소리 들어보기!</p>
              </button>

              {/* 예시 단어들 */}
              <div className="grid grid-cols-3 gap-3">
                {lesson.words.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => speakWord(item.word)}
                    className="bg-yellow-100 rounded-xl p-4 hover:bg-yellow-200 active:scale-95 transition-all"
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="text-sm font-bold text-gray-700">{item.word}</div>
                  </button>
                ))}
              </div>
            </div>

            <NavigationButtons />
          </div>
          {showCelebration && <Celebration />}
        </div>
      );
    }

    // 2단계: CVC 단어
    if (currentStage === 2) {
      const currentWord = lesson.words[currentWordIndex];
      
      const handleLetterClick = (letter) => {
        if (buildingWord.length < currentWord.phonemes.length) {
          const newBuilding = [...buildingWord, letter];
          setBuildingWord(newBuilding);
          speakPhonics(letter);
          
          if (newBuilding.length === currentWord.phonemes.length) {
            setTimeout(() => {
              if (newBuilding.join('') === currentWord.word) {
                speakWord(currentWord.word);
                addStars(5);
              }
            }, 500);
          }
        }
      };

      return (
        <div className="min-h-screen bg-gradient-to-b from-orange-400 to-orange-200 p-4">
          <div className="max-w-md mx-auto">
            <Header title={`단모음 ${lesson.vowel}`} />
            
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              {/* 현재 단어 */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{currentWord.emoji}</div>
                <button
                  onClick={() => speakWord(currentWord.word)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full text-xl font-bold active:scale-95 transition-transform"
                >
                  🔊 듣기
                </button>
              </div>

              {/* 단어 조립 영역 */}
              <div className="bg-gray-100 rounded-xl p-4 mb-4 min-h-[80px] flex items-center justify-center gap-2">
                {currentWord.phonemes.map((_, i) => (
                  <div
                    key={i}
                    className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold ${
                      buildingWord[i] 
                        ? 'bg-green-400 text-white' 
                        : 'bg-white border-2 border-dashed border-gray-300'
                    }`}
                  >
                    {buildingWord[i] || ''}
                  </div>
                ))}
              </div>

              {/* 글자 선택 */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[...currentWord.phonemes].sort(() => Math.random() - 0.5).map((letter, i) => (
                  <button
                    key={i}
                    onClick={() => handleLetterClick(letter)}
                    className="bg-blue-100 p-4 rounded-xl text-xl font-bold hover:bg-blue-200 active:scale-95 transition-all"
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* 리셋/다음 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setBuildingWord([])}
                  className="flex-1 bg-gray-200 p-3 rounded-xl font-bold active:scale-95 transition-transform"
                >
                  🔄 다시
                </button>
                <button
                  onClick={() => {
                    setBuildingWord([]);
                    setCurrentWordIndex((currentWordIndex + 1) % lesson.words.length);
                  }}
                  className="flex-1 bg-blue-500 text-white p-3 rounded-xl font-bold active:scale-95 transition-transform"
                >
                  다음 단어 ▶
                </button>
              </div>
            </div>

            <NavigationButtons />
          </div>
        </div>
      );
    }

    // 3단계: 자음 블렌드
    if (currentStage === 3) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-yellow-200 p-4">
          <div className="max-w-md mx-auto">
            <Header title={`블렌드: ${lesson.blend}`} />
            
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              {/* 블렌드 카드 */}
              <button
                onClick={() => speakWord(lesson.blend)}
                className="w-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 mb-6 hover:scale-105 active:scale-95 transition-transform"
              >
                <div className="text-6xl font-bold text-purple-600 mb-2">
                  {lesson.blend}
                </div>
                <div className="text-xl text-purple-500">🔊 {lesson.sound}</div>
              </button>

              {/* 예시 단어들 */}
              <div className="grid grid-cols-2 gap-3">
                {lesson.words.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => speakWord(item.word)}
                    className="bg-green-100 rounded-xl p-4 hover:bg-green-200 active:scale-95 transition-all text-center"
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="font-bold text-gray-700">
                      <span className="text-purple-600">{lesson.blend}</span>
                      {item.word.slice(lesson.blend.length)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <NavigationButtons />
          </div>
        </div>
      );
    }

    // 4단계: Magic E & 장모음
    if (currentStage === 4) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-200 p-4">
          <div className="max-w-md mx-auto">
            <Header title={`패턴: ${lesson.pattern}`} />
            
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              {/* Magic E 변환 */}
              {lesson.shortWord && (
                <div className="bg-gradient-to-r from-gray-100 to-pink-100 rounded-2xl p-4 mb-6">
                  <div className="text-center text-gray-600 mb-2">✨ Magic E의 마법!</div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => speakWord(lesson.shortWord)}
                      className="bg-gray-200 p-4 rounded-xl active:scale-95 transition-transform"
                    >
                      <div className="text-3xl font-bold">{lesson.shortWord}</div>
                      <div className="text-sm text-gray-500">단모음</div>
                    </button>
                    <div className="text-3xl">→</div>
                    <button
                      onClick={() => speakWord(lesson.longWord)}
                      className="bg-pink-200 p-4 rounded-xl active:scale-95 transition-transform"
                    >
                      <div className="text-3xl font-bold">{lesson.longWord}</div>
                      <div className="text-sm text-pink-600">장모음!</div>
                    </button>
                  </div>
                </div>
              )}

              {/* 패턴 표시 */}
              {lesson.sound && (
                <div className="text-center mb-4">
                  <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-bold">
                    {lesson.pattern} = {lesson.sound}
                  </span>
                </div>
              )}

              {/* 예시 단어들 */}
              <div className="grid grid-cols-2 gap-3">
                {lesson.words.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => speakWord(item.word)}
                    className="bg-yellow-100 rounded-xl p-4 hover:bg-yellow-200 active:scale-95 transition-all"
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="font-bold text-gray-700">{item.word}</div>
                  </button>
                ))}
              </div>
            </div>

            <NavigationButtons />
          </div>
        </div>
      );
    }

    // 5단계: 특수 규칙
    if (currentStage === 5) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 p-4">
          <div className="max-w-md mx-auto">
            <Header title={lesson.rule} />
            
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              {/* 규칙 설명 */}
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-4 mb-6 text-center">
                <div className="text-xl font-bold text-blue-600 mb-2">{lesson.rule}</div>
                {lesson.sound && (
                  <div className="text-lg text-blue-500">발음: {lesson.sound}</div>
                )}
              </div>

              {/* 예시 단어들 */}
              <div className="grid grid-cols-2 gap-3">
                {lesson.words.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => speakWord(item.word)}
                    className="bg-indigo-100 rounded-xl p-4 hover:bg-indigo-200 active:scale-95 transition-all"
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="font-bold text-gray-700">{item.word}</div>
                  </button>
                ))}
              </div>
            </div>

            <NavigationButtons />
          </div>
        </div>
      );
    }

    // 6단계: 문장 읽기
    if (currentStage === 6) {
      const currentSentence = lesson.sentences[currentSentenceIndex];

      const readSentenceWithHighlight = () => {
        let chunkIndex = 0;
        const readNextChunk = () => {
          if (chunkIndex < currentSentence.chunks.length) {
            setHighlightIndex(chunkIndex);
            speak(currentSentence.chunks[chunkIndex], {
              rate: speechRate,
              onEnd: () => {
                chunkIndex++;
                setTimeout(readNextChunk, 300);
              }
            });
          } else {
            setHighlightIndex(-1);
          }
        };
        readNextChunk();
      };

      return (
        <div className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-200 p-4">
          <div className="max-w-md mx-auto">
            <Header title={`문장 읽기 (${lesson.level})`} />
            
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              {/* 문장 표시 */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{currentSentence.emoji}</div>
                <div className="text-2xl font-bold leading-relaxed">
                  {currentSentence.chunks.map((chunk, i) => (
                    <span
                      key={i}
                      className={`inline-block mx-1 px-2 py-1 rounded transition-all ${
                        highlightIndex === i 
                          ? 'bg-yellow-300 scale-110' 
                          : 'bg-gray-100'
                      }`}
                    >
                      {chunk}
                    </span>
                  ))}
                </div>
              </div>

              {/* 읽기 버튼 */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={readSentenceWithHighlight}
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-xl font-bold text-lg active:scale-95 transition-transform"
                >
                  🔊 천천히 듣기
                </button>
                <button
                  onClick={() => speakSentence(currentSentence.text)}
                  className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 rounded-xl font-bold text-lg active:scale-95 transition-transform"
                >
                  🎵 자연스럽게
                </button>
              </div>

              {/* 문장 네비게이션 */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentSentenceIndex(Math.max(0, currentSentenceIndex - 1))}
                  disabled={currentSentenceIndex === 0}
                  className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  ◀ 이전
                </button>
                <span className="text-gray-600">
                  {currentSentenceIndex + 1} / {lesson.sentences.length}
                </span>
                <button
                  onClick={() => setCurrentSentenceIndex(Math.min(lesson.sentences.length - 1, currentSentenceIndex + 1))}
                  disabled={currentSentenceIndex === lesson.sentences.length - 1}
                  className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  다음 ▶
                </button>
              </div>
            </div>

            <NavigationButtons />
          </div>
        </div>
      );
    }

    return null;
  };

  // 게임 선택 화면
  const GamesScreen = () => {
    const games = [
      { id: 'matching', name: '카드 뒤집기', emoji: '🎴', desc: '그림과 단어를 매칭해요', color: 'from-pink-400 to-pink-500' },
      { id: 'listening', name: '소리 찾기', emoji: '👂', desc: '소리를 듣고 맞는 글자를 찾아요', color: 'from-green-400 to-green-500' },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setScreen('home')}
              className="bg-white/30 p-3 rounded-full"
            >
              <span className="text-2xl">🏠</span>
            </button>
            <h1 className="text-2xl font-bold text-white">🎮 게임</h1>
            <div className="flex items-center gap-1 bg-white/30 px-3 py-2 rounded-full">
              <span>⭐</span>
              <span className="font-bold text-white">{stars}</span>
            </div>
          </div>

          <div className="space-y-4">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => {
                  setCurrentGame(game.id);
                  setScreen('game');
                }}
                className={`w-full bg-gradient-to-r ${game.color} p-5 rounded-2xl shadow-lg hover:scale-102 active:scale-98 transition-transform`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl bg-white/30 p-3 rounded-xl">{game.emoji}</span>
                  <div className="text-left">
                    <div className="text-white font-bold text-xl">{game.name}</div>
                    <div className="text-white/80">{game.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 게임 화면
  const GameScreen = () => {
    const [gameData, setGameData] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    useEffect(() => {
      if (currentGame === 'matching') {
        // 매칭 게임 데이터
        const words = learningData.stage1.lessons.slice(0, 6).map(l => ({
          word: l.words[0].word,
          emoji: l.words[0].emoji
        }));
        const cards = [
          ...words.map((w, i) => ({ id: `word-${i}`, type: 'word', content: w.word, pairId: i })),
          ...words.map((w, i) => ({ id: `emoji-${i}`, type: 'emoji', content: w.emoji, pairId: i }))
        ].sort(() => Math.random() - 0.5);
        setGameData(cards);
      } else if (currentGame === 'listening') {
        // 듣기 게임 데이터
        const questions = learningData.stage1.lessons.slice(0, 10).map(l => ({
          letter: l.letter,
          options: [l.letter, ...getRandomLetters(l.letter, 3)]
            .sort(() => Math.random() - 0.5)
        }));
        setGameData(questions);
      }
    }, [currentGame]);

    const getRandomLetters = (exclude, count) => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== exclude);
      return letters.sort(() => Math.random() - 0.5).slice(0, count);
    };

    // 매칭 게임
    if (currentGame === 'matching') {
      const handleCardClick = (card) => {
        if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.pairId)) return;
        
        const newFlipped = [...flipped, card.id];
        setFlipped(newFlipped);
        speakWord(card.type === 'word' ? card.content : gameData.find(c => c.pairId === card.pairId && c.type === 'word')?.content);

        if (newFlipped.length === 2) {
          const [first, second] = newFlipped.map(id => gameData.find(c => c.id === id));
          if (first.pairId === second.pairId) {
            setMatched([...matched, first.pairId]);
            addStars(5);
            setTimeout(() => setFlipped([]), 500);
          } else {
            setTimeout(() => setFlipped([]), 1000);
          }
        }
      };

      return (
        <div className="min-h-screen bg-gradient-to-b from-pink-400 to-pink-200 p-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setScreen('games')} className="bg-white/30 p-3 rounded-full">
                <span className="text-2xl">←</span>
              </button>
              <h1 className="text-xl font-bold text-white">🎴 카드 뒤집기</h1>
              <div className="flex items-center gap-1 bg-white/30 px-3 py-2 rounded-full">
                <span>⭐</span>
                <span className="font-bold text-white">{stars}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {gameData.map((card) => {
                const isFlipped = flipped.includes(card.id);
                const isMatched = matched.includes(card.pairId);

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`aspect-square rounded-xl text-2xl font-bold transition-all ${
                      isFlipped || isMatched
                        ? 'bg-white'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } ${isMatched ? 'opacity-50' : ''}`}
                  >
                    {isFlipped || isMatched ? (
                      card.type === 'emoji' ? card.content : card.content
                    ) : '?'}
                  </button>
                );
              })}
            </div>

            {matched.length === 6 && (
              <div className="mt-6 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <div className="text-white text-xl font-bold">완료!</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 듣기 게임
    if (currentGame === 'listening') {
      const question = gameData[currentQuestion];
      
      const handleAnswer = (letter) => {
        if (letter === question?.letter) {
          setFeedback('correct');
          addStars(5);
          speakWord("Correct!");
          setTimeout(() => {
            setFeedback(null);
            if (currentQuestion < gameData.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
            }
          }, 1500);
        } else {
          setFeedback('wrong');
          speakWord("Try again!");
          setTimeout(() => setFeedback(null), 1000);
        }
      };

      if (!question) return null;

      return (
        <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-200 p-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setScreen('games')} className="bg-white/30 p-3 rounded-full">
                <span className="text-2xl">←</span>
              </button>
              <h1 className="text-xl font-bold text-white">👂 소리 찾기</h1>
              <div className="flex items-center gap-1 bg-white/30 px-3 py-2 rounded-full">
                <span>⭐</span>
                <span className="font-bold text-white">{stars}</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-4">소리를 듣고 맞는 글자를 찾아요!</p>
                <button
                  onClick={() => speakPhonics(question.letter)}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-8 py-4 rounded-full text-xl font-bold active:scale-95 transition-transform"
                >
                  🔊 소리 듣기
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {question.options.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleAnswer(letter)}
                    className={`p-6 rounded-xl text-4xl font-bold transition-all active:scale-95 ${
                      feedback === 'correct' && letter === question.letter
                        ? 'bg-green-400 text-white'
                        : 'bg-blue-100 hover:bg-blue-200'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {feedback === 'correct' && (
                <div className="mt-4 text-center text-2xl text-green-500 font-bold">
                  🎉 잘했어요!
                </div>
              )}
              {feedback === 'wrong' && (
                <div className="mt-4 text-center text-2xl text-red-500 font-bold">
                  😅 다시 해봐요!
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // 진도 화면
  const ProgressScreen = () => {
    const level = getLevel();
    const completedCount = Object.keys(completedLessons).length;
    const totalLessons = 59;
    const progressPercent = Math.round((completedCount / totalLessons) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-indigo-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setScreen('home')} className="bg-white/30 p-3 rounded-full">
              <span className="text-2xl">🏠</span>
            </button>
            <h1 className="text-2xl font-bold text-white">📊 내 진도</h1>
            <div className="w-12" />
          </div>

          {/* 레벨 카드 */}
          <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
            <div className="text-center">
              <div className="text-6xl mb-2">{level.emoji}</div>
              <div className="text-xl font-bold text-gray-800 mb-1">{userName}의 학습 현황</div>
              <div className={`text-lg font-bold ${level.color}`}>{level.name}</div>
              <div className="mt-4 flex justify-center items-center gap-2">
                <span className="text-3xl">⭐</span>
                <span className="text-3xl font-bold text-yellow-500">{stars}</span>
              </div>
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-gray-800">{completedCount}</div>
              <div className="text-gray-600 text-sm">완료한 레슨</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-gray-800">{progressPercent}%</div>
              <div className="text-gray-600 text-sm">전체 진도</div>
            </div>
          </div>

          {/* 단계별 진도 */}
          <div className="bg-white rounded-2xl p-4">
            <h3 className="font-bold text-gray-800 mb-4">단계별 진도</h3>
            {[1, 2, 3, 4, 5, 6].map((stage) => {
              const stageData = learningData[`stage${stage}`];
              const total = stageData.lessons.length;
              const completed = stageData.lessons.filter((_, i) => 
                completedLessons[`${stage}-${i}`]
              ).length;
              const percent = Math.round((completed / total) * 100);

              return (
                <div key={stage} className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{stage}단계: {stageData.title}</span>
                    <span>{completed}/{total}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-full h-3 transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 메인 렌더링
  return (
    <div className="font-sans select-none" style={{ touchAction: 'manipulation' }}>
      {screen === 'login' && <LoginScreen />}
      {screen === 'home' && <HomeScreen />}
      {screen === 'stages' && <StagesScreen />}
      {screen === 'learning' && <LearningScreen />}
      {screen === 'games' && <GamesScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'progress' && <ProgressScreen />}
    </div>
  );
}
