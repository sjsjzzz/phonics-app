import React, { useState, useEffect, useCallback, useRef } from 'react';

// 고품질 TTS 음성 캐시
let cachedVoice = null;
let voicesLoaded = false;

// 고품질 영어 음성 찾기
const getBestEnglishVoice = () => {
  if (cachedVoice && voicesLoaded) return cachedVoice;
  
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;
  
  // 우선순위: Google > Microsoft > Apple > 기타
  const preferredVoices = [
    // Google 고품질 음성
    'Google US English',
    'Google UK English Female',
    'Google UK English Male',
    // Microsoft 고품질 음성
    'Microsoft Zira',
    'Microsoft David',
    'Microsoft Jenny',
    'Microsoft Aria',
    // Apple 음성
    'Samantha',
    'Karen',
    'Daniel',
    // 기타 고품질
    'English United States',
    'English (United States)',
  ];
  
  for (const preferred of preferredVoices) {
    const voice = voices.find(v => 
      v.name.includes(preferred) || v.name === preferred
    );
    if (voice) {
      cachedVoice = voice;
      voicesLoaded = true;
      return voice;
    }
  }
  
  // fallback: en-US 음성 중 가장 자연스러운 것
  const enUSVoice = voices.find(v => v.lang === 'en-US' && !v.localService) 
    || voices.find(v => v.lang === 'en-US')
    || voices.find(v => v.lang.startsWith('en'));
  
  cachedVoice = enUSVoice || voices[0];
  voicesLoaded = true;
  return cachedVoice;
};

// 발음 재생 함수 (고품질 버전)
const speak = (text, rate = 0.85, onEnd = null) => {
  if (!('speechSynthesis' in window)) {
    console.log('Speech synthesis not supported');
    if (onEnd) onEnd();
    return;
  }
  
  // 기존 발화 취소
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1.0; // 자연스러운 피치
  utterance.volume = 1.0;
  
  const speakWithVoice = () => {
    const voice = getBestEnglishVoice();
    if (voice) {
      utterance.voice = voice;
      console.log('Using voice:', voice.name);
    }
    
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = (e) => {
      console.log('Speech error:', e);
      if (onEnd) onEnd();
    };
    
    // 약간의 지연 후 발화 (더 안정적)
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  };
  
  // 음성 목록 로드 대기
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      speakWithVoice();
    };
  } else {
    speakWithVoice();
  }
};

// 학습 데이터
const learningData = {
  // 1단계: 알파벳 소리
  stage1: {
    title: "알파벳 소리",
    icon: "🔤",
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
  // 2단계: CVC 단어
  stage2: {
    title: "CVC 단어",
    icon: "📖",
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
  // 3단계: 자음 블렌드 & 이중자음
  stage3: {
    title: "자음 블렌드",
    icon: "🔀",
    lessons: [
      { blend: "sh", sound: "/ʃ/", words: [
        { word: "ship", emoji: "🚢" }, { word: "shop", emoji: "🏪" }, { word: "fish", emoji: "🐟" }, { word: "she", emoji: "👩" }
      ]},
      { blend: "ch", sound: "/tʃ/", words: [
        { word: "chair", emoji: "🪑" }, { word: "cheese", emoji: "🧀" }, { word: "chicken", emoji: "🐔" }, { word: "lunch", emoji: "🍱" }
      ]},
      { blend: "th", sound: "/θ/", words: [
        { word: "think", emoji: "🤔" }, { word: "three", emoji: "3️⃣" }, { word: "bath", emoji: "🛁" }, { word: "math", emoji: "➕" }
      ]},
      { blend: "wh", sound: "/w/", words: [
        { word: "what", emoji: "❓" }, { word: "when", emoji: "⏰" }, { word: "where", emoji: "📍" }, { word: "white", emoji: "⬜" }
      ]},
      { blend: "bl", sound: "/bl/", words: [
        { word: "blue", emoji: "🔵" }, { word: "black", emoji: "⬛" }, { word: "block", emoji: "🧱" }, { word: "blanket", emoji: "🛏️" }
      ]},
      { blend: "cl", sound: "/kl/", words: [
        { word: "clap", emoji: "👏" }, { word: "clock", emoji: "🕐" }, { word: "cloud", emoji: "☁️" }, { word: "class", emoji: "🏫" }
      ]},
      { blend: "fl", sound: "/fl/", words: [
        { word: "flag", emoji: "🚩" }, { word: "flower", emoji: "🌸" }, { word: "fly", emoji: "🪰" }, { word: "floor", emoji: "🟫" }
      ]},
      { blend: "st", sound: "/st/", words: [
        { word: "star", emoji: "⭐" }, { word: "stop", emoji: "🛑" }, { word: "stick", emoji: "🥢" }, { word: "stamp", emoji: "📮" }
      ]},
      { blend: "tr", sound: "/tr/", words: [
        { word: "tree", emoji: "🌳" }, { word: "train", emoji: "🚂" }, { word: "truck", emoji: "🚚" }, { word: "trip", emoji: "✈️" }
      ]},
      { blend: "dr", sound: "/dr/", words: [
        { word: "drum", emoji: "🥁" }, { word: "draw", emoji: "✏️" }, { word: "dress", emoji: "👗" }, { word: "drink", emoji: "🥤" }
      ]},
    ]
  },
  // 4단계: 장모음
  stage4: {
    title: "장모음 (Magic E)",
    icon: "✨",
    lessons: [
      { pattern: "a_e", shortWord: "cap", longWord: "cape", words: [
        { word: "cake", emoji: "🎂" }, { word: "make", emoji: "🔨" }, { word: "lake", emoji: "🏞️" }, { word: "name", emoji: "📛" }, { word: "game", emoji: "🎮" }
      ]},
      { pattern: "i_e", shortWord: "kit", longWord: "kite", words: [
        { word: "bike", emoji: "🚲" }, { word: "like", emoji: "👍" }, { word: "nine", emoji: "9️⃣" }, { word: "time", emoji: "⏰" }, { word: "five", emoji: "5️⃣" }
      ]},
      { pattern: "o_e", shortWord: "hop", longWord: "hope", words: [
        { word: "home", emoji: "🏠" }, { word: "bone", emoji: "🦴" }, { word: "nose", emoji: "👃" }, { word: "rope", emoji: "🪢" }, { word: "rose", emoji: "🌹" }
      ]},
      { pattern: "u_e", shortWord: "cub", longWord: "cube", words: [
        { word: "cute", emoji: "🥰" }, { word: "mute", emoji: "🔇" }, { word: "tune", emoji: "🎵" }, { word: "huge", emoji: "🦣" }, { word: "tube", emoji: "📺" }
      ]},
      { pattern: "ee", sound: "/iː/", words: [
        { word: "tree", emoji: "🌳" }, { word: "see", emoji: "👀" }, { word: "bee", emoji: "🐝" }, { word: "green", emoji: "💚" }, { word: "sleep", emoji: "😴" }
      ]},
      { pattern: "ea", sound: "/iː/", words: [
        { word: "eat", emoji: "🍽️" }, { word: "sea", emoji: "🌊" }, { word: "read", emoji: "📖" }, { word: "team", emoji: "👥" }, { word: "beach", emoji: "🏖️" }
      ]},
      { pattern: "ai/ay", sound: "/eɪ/", words: [
        { word: "rain", emoji: "🌧️" }, { word: "train", emoji: "🚂" }, { word: "day", emoji: "☀️" }, { word: "play", emoji: "🎮" }, { word: "say", emoji: "💬" }
      ]},
      { pattern: "oa/ow", sound: "/oʊ/", words: [
        { word: "boat", emoji: "⛵" }, { word: "coat", emoji: "🧥" }, { word: "snow", emoji: "❄️" }, { word: "grow", emoji: "🌱" }, { word: "show", emoji: "🎬" }
      ]},
    ]
  },
  // 5단계: 특수 규칙
  stage5: {
    title: "특수 발음",
    icon: "🎯",
    lessons: [
      { rule: "R-controlled: ar", sound: "/ɑːr/", words: [
        { word: "car", emoji: "🚗" }, { word: "star", emoji: "⭐" }, { word: "farm", emoji: "🚜" }, { word: "park", emoji: "🏞️" }
      ]},
      { rule: "R-controlled: or", sound: "/ɔːr/", words: [
        { word: "for", emoji: "➡️" }, { word: "door", emoji: "🚪" }, { word: "horse", emoji: "🐴" }, { word: "morning", emoji: "🌅" }
      ]},
      { rule: "R-controlled: er/ir/ur", sound: "/ɜːr/", words: [
        { word: "her", emoji: "👩" }, { word: "bird", emoji: "🐦" }, { word: "girl", emoji: "👧" }, { word: "turn", emoji: "↩️" }, { word: "purple", emoji: "💜" }
      ]},
      { rule: "Silent K: kn", words: [
        { word: "know", emoji: "🧠" }, { word: "knee", emoji: "🦵" }, { word: "knife", emoji: "🔪" }, { word: "knock", emoji: "🚪" }
      ]},
      { rule: "Silent W: wr", words: [
        { word: "write", emoji: "✍️" }, { word: "wrong", emoji: "❌" }, { word: "wrap", emoji: "🎁" }, { word: "wrist", emoji: "⌚" }
      ]},
      { rule: "oi/oy sound", sound: "/ɔɪ/", words: [
        { word: "oil", emoji: "🛢️" }, { word: "coin", emoji: "🪙" }, { word: "boy", emoji: "👦" }, { word: "toy", emoji: "🧸" }, { word: "enjoy", emoji: "😊" }
      ]},
      { rule: "ou/ow sound", sound: "/aʊ/", words: [
        { word: "house", emoji: "🏠" }, { word: "mouse", emoji: "🐭" }, { word: "cow", emoji: "🐄" }, { word: "now", emoji: "⏰" }, { word: "brown", emoji: "🟤" }
      ]},
      { rule: "Soft c (ce, ci)", sound: "/s/", words: [
        { word: "city", emoji: "🏙️" }, { word: "ice", emoji: "🧊" }, { word: "dance", emoji: "💃" }, { word: "face", emoji: "😊" }
      ]},
    ]
  },
  // 6단계: 문장 읽기
  stage6: {
    title: "문장 읽기",
    icon: "📚",
    lessons: [
      { level: "쉬움", sentences: [
        { text: "The cat sat.", chunks: ["The", "cat", "sat."], emoji: "🐱" },
        { text: "I see a dog.", chunks: ["I", "see", "a", "dog."], emoji: "🐶" },
        { text: "The sun is hot.", chunks: ["The", "sun", "is", "hot."], emoji: "☀️" },
        { text: "I like to run.", chunks: ["I", "like", "to", "run."], emoji: "🏃" },
        { text: "The fish can swim.", chunks: ["The", "fish", "can", "swim."], emoji: "🐟" },
      ]},
      { level: "보통", sentences: [
        { text: "The big dog runs fast.", chunks: ["The big dog", "runs fast."], emoji: "🐕" },
        { text: "I have a red ball.", chunks: ["I have", "a red ball."], emoji: "🔴" },
        { text: "She likes to read books.", chunks: ["She likes", "to read books."], emoji: "📚" },
        { text: "The bird sits on the tree.", chunks: ["The bird sits", "on the tree."], emoji: "🐦" },
        { text: "We play games at home.", chunks: ["We play games", "at home."], emoji: "🎮" },
      ]},
      { level: "어려움", sentences: [
        { text: "The white cat sleeps on the soft bed.", chunks: ["The white cat", "sleeps", "on the soft bed."], emoji: "🐱" },
        { text: "My friend and I like to play together.", chunks: ["My friend and I", "like to play", "together."], emoji: "👫" },
        { text: "The little bird sings a beautiful song.", chunks: ["The little bird", "sings", "a beautiful song."], emoji: "🎵" },
        { text: "We can see many stars at night.", chunks: ["We can see", "many stars", "at night."], emoji: "🌟" },
        { text: "The farmer grows vegetables on his farm.", chunks: ["The farmer", "grows vegetables", "on his farm."], emoji: "🥕" },
      ]},
    ]
  }
};

// 메인 앱 컴포넌트
export default function PhonicsAdventure() {
  const [screen, setScreen] = useState('login'); // login, home, stages, learning, games, game, progress
  const [currentStage, setCurrentStage] = useState(1);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [stars, setStars] = useState(0);
  const [completedLessons, setCompletedLessons] = useState({});
  const [difficulty, setDifficulty] = useState('normal');
  const [gameMode, setGameMode] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [userName, setUserName] = useState('');
  const [allUsers, setAllUsers] = useState([]); // 모든 사용자 목록
  const [inputValue, setInputValue] = useState(''); // 한글 입력용 별도 상태
  const inputRef = useRef(null);
  
  // 모든 사용자 데이터 로드
  useEffect(() => {
    const savedUsers = localStorage.getItem('phonicsUsers');
    if (savedUsers) {
      setAllUsers(JSON.parse(savedUsers));
    }
    
    // 음성 미리 로드
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      // 음성 로드 이벤트 등록
      window.speechSynthesis.onvoiceschanged = () => {
        getBestEnglishVoice();
      };
    }
  }, []);

  // 사용자 선택/로그인
  const loginUser = (name) => {
    const users = JSON.parse(localStorage.getItem('phonicsUsers') || '[]');
    const existingUser = users.find(u => u.name === name);
    
    if (existingUser) {
      // 기존 사용자 데이터 로드
      setUserName(existingUser.name);
      setStars(existingUser.stars || 0);
      setCompletedLessons(existingUser.completedLessons || {});
      setDifficulty(existingUser.difficulty || 'normal');
      setSpeechRate(existingUser.speechRate || 0.85);
    } else {
      // 새 사용자 생성
      const newUser = {
        name: name,
        stars: 0,
        completedLessons: {},
        difficulty: 'normal',
        speechRate: 0.85,
        createdAt: new Date().toISOString()
      };
      const updatedUsers = [...users, newUser];
      localStorage.setItem('phonicsUsers', JSON.stringify(updatedUsers));
      setAllUsers(updatedUsers);
      
      setUserName(name);
      setStars(0);
      setCompletedLessons({});
      setDifficulty('normal');
      setSpeechRate(0.85);
    }
    
    setScreen('home');
    setTimeout(() => {
      speak(`Hello ${name}! Let's learn phonics!`, 0.85);
    }, 300);
  };

  // 현재 사용자 데이터 저장
  useEffect(() => {
    if (userName) {
      const users = JSON.parse(localStorage.getItem('phonicsUsers') || '[]');
      const userIndex = users.findIndex(u => u.name === userName);
      
      const userData = {
        name: userName,
        stars,
        completedLessons,
        difficulty,
        speechRate,
        lastPlayedAt: new Date().toISOString()
      };
      
      if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...userData };
      } else {
        users.push(userData);
      }
      
      localStorage.setItem('phonicsUsers', JSON.stringify(users));
      setAllUsers(users);
    }
  }, [stars, completedLessons, difficulty, speechRate, userName]);

  // 사용자 삭제
  const deleteUser = (name) => {
    const users = JSON.parse(localStorage.getItem('phonicsUsers') || '[]');
    const updatedUsers = users.filter(u => u.name !== name);
    localStorage.setItem('phonicsUsers', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
  };

  // 로그아웃
  const logout = () => {
    setUserName('');
    setScreen('login');
  };

  const addStars = (amount) => {
    setStars(prev => prev + amount);
  };

  const markLessonComplete = (stage, lesson) => {
    setCompletedLessons(prev => ({
      ...prev,
      [`${stage}-${lesson}`]: true
    }));
  };

  const getLevel = () => {
    if (stars < 100) return { name: "파닉스 새싹", emoji: "🌱", color: "text-green-500" };
    if (stars < 300) return { name: "파닉스 꼬마", emoji: "🧒", color: "text-blue-500" };
    if (stars < 600) return { name: "파닉스 친구", emoji: "🤝", color: "text-purple-500" };
    if (stars < 1000) return { name: "파닉스 영웅", emoji: "🦸", color: "text-orange-500" };
    return { name: "파닉스 마스터", emoji: "👑", color: "text-yellow-500" };
  };

  // 로그인/사용자 선택 화면
  const LoginScreen = () => {
    const [isNewUser, setIsNewUser] = useState(false);
    const [newName, setNewName] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    
    const handleSubmit = () => {
      const trimmedName = newName.trim();
      if (trimmedName) {
        loginUser(trimmedName);
        setNewName('');
        setIsNewUser(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-400 p-4 flex flex-col">
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          {/* 헤더 */}
          <div className="text-center py-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg mb-2">
              🎈 Phonics Adventure
            </h1>
            <p className="text-white/90 text-base sm:text-lg">파닉스 모험을 시작해요!</p>
          </div>

          {/* 마스코트 */}
          <div className="text-center mb-6">
            <div className="text-7xl sm:text-8xl mb-2">🦄</div>
            <p className="text-white text-lg">누가 공부할까요?</p>
          </div>

          {/* 기존 사용자 목록 */}
          {allUsers.length > 0 && !isNewUser && (
            <div className="bg-white/95 rounded-3xl p-4 sm:p-6 shadow-xl mb-4">
              <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">👋 다시 오셨네요!</h2>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {allUsers.map((user) => (
                  <div key={user.name} className="flex items-center gap-3">
                    <button
                      onClick={() => loginUser(user.name)}
                      className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 rounded-xl font-bold text-left flex items-center gap-3 hover:from-blue-500 hover:to-blue-600 active:scale-98 transition-all"
                    >
                      <span className="text-2xl">👤</span>
                      <div className="flex-1">
                        <div className="text-lg">{user.name}</div>
                        <div className="text-sm text-white/80">⭐ {user.stars || 0}개</div>
                      </div>
                      <span className="text-xl">▶</span>
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(user.name)}
                      className="bg-red-100 text-red-500 p-3 rounded-xl hover:bg-red-200 active:scale-95 transition-all"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 새 사용자 입력 */}
          {(isNewUser || allUsers.length === 0) && (
            <div className="bg-white/95 rounded-3xl p-4 sm:p-6 shadow-xl mb-4">
              <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
                {allUsers.length === 0 ? '🌟 처음이시네요!' : '✨ 새 친구 등록'}
              </h2>
              <p className="text-gray-600 text-center mb-4">이름을 알려줄래요?</p>
              
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                    handleSubmit();
                  }
                }}
                placeholder="이름 입력 (예: 주혁)"
                className="w-full p-4 text-xl text-center border-2 border-blue-300 rounded-xl mb-4 focus:border-blue-500 focus:outline-none"
                autoComplete="off"
                autoFocus
              />

              <button
                onClick={handleSubmit}
                disabled={!newName.trim()}
                className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-500 hover:to-green-600 active:scale-98 transition-all"
              >
                시작하기! 🚀
              </button>
              
              {allUsers.length > 0 && (
                <button
                  onClick={() => {
                    setIsNewUser(false);
                    setNewName('');
                  }}
                  className="w-full mt-3 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold"
                >
                  ← 뒤로가기
                </button>
              )}
            </div>
          )}

          {/* 새 사용자 추가 버튼 */}
          {allUsers.length > 0 && !isNewUser && (
            <button
              onClick={() => setIsNewUser(true)}
              className="bg-white/90 text-gray-700 p-4 rounded-2xl font-bold text-center hover:bg-white active:scale-98 transition-all"
            >
              ➕ 새 친구 추가하기
            </button>
          )}
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-xs">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">😢</div>
                <p className="text-lg font-bold text-gray-800">
                  {showDeleteConfirm}의 기록을 삭제할까요?
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  모든 진도와 별이 사라져요!
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-xl font-bold"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    deleteUser(showDeleteConfirm);
                    setShowDeleteConfirm(null);
                  }}
                  className="flex-1 bg-red-500 text-white p-3 rounded-xl font-bold"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 홈 화면
  const HomeScreen = () => {
    const level = getLevel();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 p-3 sm:p-4">
        <div className="max-w-md mx-auto">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={logout}
              className="bg-white/30 p-2 sm:p-3 rounded-full text-white text-sm"
            >
              🚪 나가기
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
              🎈 Phonics Adventure
            </h1>
            <div className="w-16"></div>
          </div>

          {/* 마스코트 & 레벨 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl mb-4 sm:mb-6">
            <div className="text-center">
              <div className="text-6xl sm:text-8xl mb-3">🦄</div>
              <p className="text-lg sm:text-xl text-gray-700 mb-1">
                안녕, <span className="font-bold text-blue-600">{userName}</span>! 👋
              </p>
              <p className="text-gray-500 text-sm sm:text-base mb-3">오늘도 열심히 공부해보자!</p>
              <div className={`text-base sm:text-xl font-bold ${level.color}`}>
                {level.emoji} {level.name}
              </div>
              <div className="mt-3 flex justify-center items-center gap-2">
                <span className="text-xl sm:text-2xl">⭐</span>
                <span className="text-xl sm:text-2xl font-bold text-yellow-500">{stars}</span>
              </div>
            </div>
          </div>

          {/* 메인 버튼들 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={() => {
                speak("Let's learn!", speechRate);
                setScreen('stages');
              }}
              className="bg-gradient-to-br from-green-400 to-green-500 text-white p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              <div className="text-3xl sm:text-4xl mb-2">📚</div>
              <div className="font-bold text-sm sm:text-base">학습하기</div>
            </button>
            <button
              onClick={() => {
                speak("Let's play!", speechRate);
                setScreen('games');
              }}
              className="bg-gradient-to-br from-purple-400 to-purple-500 text-white p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              <div className="text-3xl sm:text-4xl mb-2">🎮</div>
              <div className="font-bold text-sm sm:text-base">게임하기</div>
            </button>
            <button
              onClick={() => setScreen('progress')}
              className="bg-gradient-to-br from-blue-400 to-blue-500 text-white p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              <div className="text-3xl sm:text-4xl mb-2">📊</div>
              <div className="font-bold text-sm sm:text-base">내 진도</div>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-gradient-to-br from-gray-400 to-gray-500 text-white p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              <div className="text-3xl sm:text-4xl mb-2">⚙️</div>
              <div className="font-bold text-sm sm:text-base">설정</div>
            </button>
          </div>

          {/* 난이도 표시 */}
          <div className="bg-white/80 rounded-xl p-3 text-center text-sm sm:text-base">
            <span className="text-gray-600">현재 난이도: </span>
            <span className="font-bold">
              {difficulty === 'easy' && '🐣 쉬움'}
              {difficulty === 'normal' && '🐥 보통'}
              {difficulty === 'hard' && '🦅 어려움'}
            </span>
          </div>
        </div>

        {/* 설정 모달 */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">⚙️ 설정</h2>
              
              {/* 현재 사용자 */}
              <div className="mb-4 sm:mb-6 bg-blue-50 rounded-xl p-3 sm:p-4 text-center">
                <span className="text-gray-600">현재 사용자: </span>
                <span className="font-bold text-blue-600">{userName}</span>
              </div>
              
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-bold mb-3 text-sm sm:text-base">난이도 선택</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'easy', label: '🐣 쉬움' },
                    { id: 'normal', label: '🐥 보통' },
                    { id: 'hard', label: '🦅 어려움' },
                  ].map(d => (
                    <button
                      key={d.id}
                      onClick={() => setDifficulty(d.id)}
                      className={`p-2 sm:p-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                        difficulty === d.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-bold mb-3 text-sm sm:text-base">
                  발음 속도: {speechRate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.2"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
                  <span>느리게</span>
                  <span>빠르게</span>
                </div>
              </div>

              <button
                onClick={() => {
                  speak(`Hello ${userName}! This is how I sound.`, speechRate);
                }}
                className="w-full bg-green-500 text-white p-3 rounded-xl font-bold mb-3 sm:mb-4 text-sm sm:text-base"
              >
                🔊 발음 테스트
              </button>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-gray-200 text-gray-700 p-3 rounded-xl font-bold text-sm sm:text-base"
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
      { num: 1, ...learningData.stage1, color: 'from-red-400 to-red-500', icon: '🔤' },
      { num: 2, ...learningData.stage2, color: 'from-orange-400 to-orange-500', icon: '📖' },
      { num: 3, ...learningData.stage3, color: 'from-yellow-400 to-yellow-500', icon: '🔀' },
      { num: 4, ...learningData.stage4, color: 'from-green-400 to-green-500', icon: '✨' },
      { num: 5, ...learningData.stage5, color: 'from-blue-400 to-blue-500', icon: '🎯' },
      { num: 6, ...learningData.stage6, color: 'from-purple-400 to-purple-500', icon: '📚' },
    ];

    const getStageProgress = (stageNum) => {
      const stageData = learningData[`stage${stageNum}`];
      const total = stageData.lessons.length;
      const completed = stageData.lessons.filter((_, i) => 
        completedLessons[`${stageNum}-${i}`]
      ).length;
      return { completed, total };
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-indigo-200 p-3 sm:p-4">
        <div className="max-w-md mx-auto">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={() => setScreen('home')}
              className="bg-white/30 p-2 sm:p-3 rounded-full"
            >
              <span className="text-xl sm:text-2xl">🏠</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white">🗺️ 학습 단계</h1>
            <div className="flex items-center gap-1 bg-white/30 px-2 sm:px-3 py-1 sm:py-2 rounded-full">
              <span className="text-sm sm:text-base">⭐</span>
              <span className="font-bold text-white text-sm sm:text-base">{stars}</span>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-white/80 rounded-xl p-3 mb-4 text-center text-sm">
            <span className="text-gray-700">💡 모든 단계를 자유롭게 체험해보세요!</span>
          </div>

          {/* 단계 목록 */}
          <div className="space-y-3 sm:space-y-4">
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
                    speak(stage.title, speechRate);
                  }}
                  className={`w-full bg-gradient-to-r ${stage.color} p-3 sm:p-4 rounded-2xl shadow-lg 
                    hover:scale-102 transition-transform active:scale-98`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-3xl sm:text-4xl bg-white/30 p-2 sm:p-3 rounded-xl">
                      {stage.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-bold text-base sm:text-lg">
                        {stage.num}단계: {stage.title}
                      </div>
                      <div className="text-white/80 text-xs sm:text-sm">
                        {progress.completed}/{progress.total} 완료
                      </div>
                      {/* 진행바 */}
                      <div className="mt-2 bg-white/30 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-2 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl text-white">▶</div>
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
        setTimeout(() => setShowCelebration(false), 2000);
      }
    };

    // 1단계: 알파벳 소리
    if (currentStage === 1) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-pink-400 to-pink-200 p-4">
          <div className="max-w-md mx-auto">
            <Header title={`${currentLesson + 1}/${stageData.lessons.length}`} />
            
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              {/* 글자 카드 */}
              <button
                onClick={() => speak(lesson.letter, speechRate)}
                className="w-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 mb-6 hover:scale-105 transition-transform"
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
                    onClick={() => speak(item.word, speechRate)}
                    className="bg-yellow-100 rounded-xl p-4 hover:bg-yellow-200 transition-colors"
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="text-sm font-bold text-gray-700">{item.word}</div>
                  </button>
                ))}
              </div>
            </div>

            <NavigationButtons
              onPrev={() => currentLesson > 0 && setCurrentLesson(currentLesson - 1)}
              onNext={handleNext}
              onComplete={handleComplete}
              canPrev={currentLesson > 0}
              canNext={currentLesson < stageData.lessons.length - 1}
            />
          </div>
          {showCelebration && <Celebration />}
        </div>
      );
    }

    // 2단계: CVC 단어
    if (currentStage === 2) {
      const [buildingWord, setBuildingWord] = useState([]);
      const [currentWordIndex, setCurrentWordIndex] = useState(0);
      const currentWord = lesson.words[currentWordIndex];
      
      const handleLetterClick = (letter) => {
        if (buildingWord.length < currentWord.phonemes.length) {
          const newBuilding = [...buildingWord, letter];
          setBuildingWord(newBuilding);
          speak(letter, speechRate);
          
          if (newBuilding.length === currentWord.phonemes.length) {
            setTimeout(() => {
              if (newBuilding.join('') === currentWord.word) {
                speak(currentWord.word, speechRate);
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
                  onClick={() => speak(currentWord.word, speechRate)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full text-xl font-bold"
                >
                  🔊 듣기
                </button>
              </div>

              {/* 조립 영역 */}
              <div className="flex justify-center gap-2 mb-6">
                {currentWord.phonemes.map((_, i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold
                      ${buildingWord[i] ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-400'}
                    `}
                  >
                    {buildingWord[i] || '_'}
                  </div>
                ))}
              </div>

              {/* 글자 선택 */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {[...currentWord.phonemes].sort(() => Math.random() - 0.5).map((letter, i) => (
                  <button
                    key={i}
                    onClick={() => handleLetterClick(letter)}
                    className="w-14 h-14 bg-yellow-400 rounded-xl text-2xl font-bold hover:bg-yellow-500 transition-colors"
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* 리셋/다음 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setBuildingWord([])}
                  className="flex-1 bg-gray-200 p-3 rounded-xl font-bold"
                >
                  🔄 다시
                </button>
                <button
                  onClick={() => {
                    setBuildingWord([]);
                    setCurrentWordIndex((currentWordIndex + 1) % lesson.words.length);
                  }}
                  className="flex-1 bg-blue-500 text-white p-3 rounded-xl font-bold"
                >
                  다음 단어 ▶
                </button>
              </div>
            </div>

            <NavigationButtons
              onPrev={() => currentLesson > 0 && setCurrentLesson(currentLesson - 1)}
              onNext={handleNext}
              onComplete={handleComplete}
              canPrev={currentLesson > 0}
              canNext={currentLesson < stageData.lessons.length - 1}
            />
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
                onClick={() => speak(lesson.blend, speechRate)}
                className="w-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 mb-6 hover:scale-105 transition-transform"
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
                    onClick={() => speak(item.word, speechRate)}
                    className="bg-green-100 rounded-xl p-4 hover:bg-green-200 transition-colors text-center"
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

            <NavigationButtons
              onPrev={() => currentLesson > 0 && setCurrentLesson(currentLesson - 1)}
              onNext={handleNext}
              onComplete={handleComplete}
              canPrev={currentLesson > 0}
              canNext={currentLesson < stageData.lessons.length - 1}
            />
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
              {/* Magic E 변환 (해당하는 경우) */}
              {lesson.shortWord && (
                <div className="bg-gradient-to-r from-gray-100 to-pink-100 rounded-2xl p-4 mb-6">
                  <div className="text-center text-gray-600 mb-2">✨ Magic E의 마법!</div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => speak(lesson.shortWord, speechRate)}
                      className="bg-gray-200 p-4 rounded-xl"
                    >
                      <div className="text-3xl font-bold">{lesson.shortWord}</div>
                      <div className="text-sm text-gray-500">단모음</div>
                    </button>
                    <div className="text-3xl">→</div>
                    <button
                      onClick={() => speak(lesson.longWord, speechRate)}
                      className="bg-pink-200 p-4 rounded-xl"
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
                    onClick={() => speak(item.word, speechRate)}
                    className="bg-yellow-100 rounded-xl p-4 hover:bg-yellow-200 transition-colors"
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="font-bold text-gray-700">{item.word}</div>
                  </button>
                ))}
              </div>
            </div>

            <NavigationButtons
              onPrev={() => currentLesson > 0 && setCurrentLesson(currentLesson - 1)}
              onNext={handleNext}
              onComplete={handleComplete}
              canPrev={currentLesson > 0}
              canNext={currentLesson < stageData.lessons.length - 1}
            />
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
                    onClick={() => speak(item.word, speechRate)}
                    className="bg-indigo-100 rounded-xl p-4 hover:bg-indigo-200 transition-colors"
                  >
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="font-bold text-gray-700">{item.word}</div>
                  </button>
                ))}
              </div>
            </div>

            <NavigationButtons
              onPrev={() => currentLesson > 0 && setCurrentLesson(currentLesson - 1)}
              onNext={handleNext}
              onComplete={handleComplete}
              canPrev={currentLesson > 0}
              canNext={currentLesson < stageData.lessons.length - 1}
            />
          </div>
        </div>
      );
    }

    // 6단계: 문장 읽기
    if (currentStage === 6) {
      const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
      const [highlightIndex, setHighlightIndex] = useState(-1);
      const currentSentence = lesson.sentences[currentSentenceIndex];

      const readSentenceWithHighlight = () => {
        let chunkIndex = 0;
        const readNextChunk = () => {
          if (chunkIndex < currentSentence.chunks.length) {
            setHighlightIndex(chunkIndex);
            speak(currentSentence.chunks[chunkIndex], speechRate, () => {
              chunkIndex++;
              setTimeout(readNextChunk, 300);
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
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-xl font-bold text-lg"
                >
                  🔊 천천히 듣기
                </button>
                <button
                  onClick={() => speak(currentSentence.text, speechRate + 0.2)}
                  className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 rounded-xl font-bold text-lg"
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

            <NavigationButtons
              onPrev={() => currentLesson > 0 && setCurrentLesson(currentLesson - 1)}
              onNext={handleNext}
              onComplete={handleComplete}
              canPrev={currentLesson > 0}
              canNext={currentLesson < stageData.lessons.length - 1}
            />
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
      { id: 'spelling', name: '단어 조립', emoji: '🧩', desc: '글자를 조합해 단어를 만들어요', color: 'from-orange-400 to-orange-500' },
      { id: 'listening', name: '소리 찾기', emoji: '👂', desc: '소리를 듣고 맞는 글자를 찾아요', color: 'from-green-400 to-green-500' },
      { id: 'sentence', name: '문장 완성', emoji: '📝', desc: '빈칸에 맞는 단어를 넣어요', color: 'from-blue-400 to-blue-500' },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-200 p-3 sm:p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={() => setScreen('home')}
              className="bg-white/30 p-2 sm:p-3 rounded-full"
            >
              <span className="text-xl sm:text-2xl">🏠</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white">🎮 게임</h1>
            <div className="flex items-center gap-1 bg-white/30 px-2 sm:px-3 py-1 sm:py-2 rounded-full">
              <span className="text-sm sm:text-base">⭐</span>
              <span className="font-bold text-white text-sm sm:text-base">{stars}</span>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => {
                  setGameMode(game.id);
                  setScreen('game');
                  speak(game.name, speechRate);
                }}
                className={`w-full bg-gradient-to-r ${game.color} p-3 sm:p-4 rounded-2xl shadow-lg hover:scale-102 transition-transform active:scale-98`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-4xl sm:text-5xl bg-white/30 p-2 sm:p-3 rounded-xl">
                    {game.emoji}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-bold text-base sm:text-xl">{game.name}</div>
                    <div className="text-white/80 text-xs sm:text-sm">{game.desc}</div>
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
    // 카드 매칭 게임
    if (gameMode === 'matching') {
      return <MatchingGame />;
    }
    // 단어 조립 게임
    if (gameMode === 'spelling') {
      return <SpellingGame />;
    }
    // 소리 찾기 게임
    if (gameMode === 'listening') {
      return <ListeningGame />;
    }
    // 문장 완성 게임
    if (gameMode === 'sentence') {
      return <SentenceGame />;
    }
    return null;
  };

  // 카드 매칭 게임
  const MatchingGame = () => {
    const words = [
      { word: 'cat', emoji: '🐱' },
      { word: 'dog', emoji: '🐶' },
      { word: 'sun', emoji: '☀️' },
      { word: 'fish', emoji: '🐟' },
      { word: 'tree', emoji: '🌳' },
      { word: 'bird', emoji: '🐦' },
    ];

    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
      // 난이도에 따라 카드 수 조절
      const pairCount = difficulty === 'easy' ? 3 : difficulty === 'normal' ? 4 : 6;
      const selectedWords = words.slice(0, pairCount);
      const cardPairs = [];
      selectedWords.forEach((item, i) => {
        cardPairs.push({ id: i * 2, type: 'word', content: item.word, pairId: i });
        cardPairs.push({ id: i * 2 + 1, type: 'emoji', content: item.emoji, pairId: i });
      });
      setCards(cardPairs.sort(() => Math.random() - 0.5));
    }, [difficulty]);

    const handleCardClick = (card) => {
      if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.pairId)) return;

      if (card.type === 'word') speak(card.content, speechRate);
      
      const newFlipped = [...flipped, card.id];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        const first = cards.find(c => c.id === newFlipped[0]);
        const second = cards.find(c => c.id === newFlipped[1]);
        
        if (first.pairId === second.pairId) {
          setMatched([...matched, first.pairId]);
          setScore(score + 10);
          addStars(5);
          setFlipped([]);
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
      }
    };

    const isComplete = matched.length === cards.length / 2;

    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-400 to-pink-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setScreen('games')} className="bg-white/30 p-3 rounded-full">
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-xl font-bold text-white">🎴 카드 뒤집기</h1>
            <div className="bg-white/30 px-3 py-2 rounded-full text-white font-bold">
              ⭐ {score}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || matched.includes(card.pairId);
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className={`aspect-square rounded-xl text-3xl font-bold transition-all duration-300 ${
                    isFlipped
                      ? 'bg-white text-gray-800'
                      : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                  } ${matched.includes(card.pairId) ? 'opacity-50' : 'hover:scale-105'}`}
                >
                  {isFlipped ? card.content : '?'}
                </button>
              );
            })}
          </div>

          {isComplete && (
            <div className="mt-6 bg-white rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-xl font-bold text-gray-800">완료!</div>
              <div className="text-gray-600">총 {score}점을 얻었어요!</div>
              <button
                onClick={() => {
                  setMatched([]);
                  setFlipped([]);
                  setScore(0);
                  setCards(cards.sort(() => Math.random() - 0.5));
                }}
                className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold"
              >
                다시 하기
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 단어 조립 게임
  const SpellingGame = () => {
    const wordList = [
      { word: 'cat', emoji: '🐱' },
      { word: 'dog', emoji: '🐶' },
      { word: 'sun', emoji: '☀️' },
      { word: 'hat', emoji: '🎩' },
      { word: 'bus', emoji: '🚌' },
      { word: 'cup', emoji: '🥤' },
      { word: 'fish', emoji: '🐟' },
      { word: 'tree', emoji: '🌳' },
      { word: 'frog', emoji: '🐸' },
      { word: 'ship', emoji: '🚢' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [input, setInput] = useState([]);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    
    const current = wordList[currentIndex];
    const shuffledLetters = [...current.word].sort(() => Math.random() - 0.5);
    const extraLetters = ['x', 'z', 'q'].slice(0, difficulty === 'hard' ? 2 : difficulty === 'normal' ? 1 : 0);
    const allLetters = [...shuffledLetters, ...extraLetters].sort(() => Math.random() - 0.5);

    const handleLetterClick = (letter, index) => {
      const newInput = [...input, { letter, originalIndex: index }];
      setInput(newInput);
      speak(letter, speechRate);

      if (newInput.length === current.word.length) {
        const typed = newInput.map(i => i.letter).join('');
        if (typed === current.word) {
          setScore(score + 10);
          addStars(5);
          speak(current.word, speechRate);
          setShowResult(true);
          setTimeout(() => {
            setShowResult(false);
            setInput([]);
            setCurrentIndex((currentIndex + 1) % wordList.length);
          }, 1500);
        }
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-400 to-orange-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setScreen('games')} className="bg-white/30 p-3 rounded-full">
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-xl font-bold text-white">🧩 단어 조립</h1>
            <div className="bg-white/30 px-3 py-2 rounded-full text-white font-bold">
              ⭐ {score}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{current.emoji}</div>
              <button
                onClick={() => speak(current.word, speechRate)}
                className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold"
              >
                🔊 듣기
              </button>
            </div>

            {/* 입력 영역 */}
            <div className="flex justify-center gap-2 mb-6 min-h-16">
              {Array(current.word.length).fill(null).map((_, i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold
                    ${input[i] ? 'bg-green-400 text-white' : 'bg-gray-200'}
                    ${showResult && input.map(x => x.letter).join('') === current.word ? 'animate-bounce' : ''}
                  `}
                >
                  {input[i]?.letter || ''}
                </div>
              ))}
            </div>

            {/* 글자 선택 */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {allLetters.map((letter, i) => {
                const isUsed = input.some(x => x.originalIndex === i);
                return (
                  <button
                    key={i}
                    onClick={() => !isUsed && handleLetterClick(letter, i)}
                    disabled={isUsed}
                    className={`w-12 h-12 rounded-xl text-xl font-bold transition-all
                      ${isUsed ? 'bg-gray-300 opacity-50' : 'bg-yellow-400 hover:bg-yellow-500 hover:scale-110'}
                    `}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setInput([])}
              className="w-full bg-gray-200 p-3 rounded-xl font-bold"
            >
              🔄 다시
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 소리 찾기 게임
  const ListeningGame = () => {
    const sounds = [
      { letter: 'A', words: ['apple', 'ant', 'arm'] },
      { letter: 'B', words: ['ball', 'bear', 'bus'] },
      { letter: 'C', words: ['cat', 'car', 'cup'] },
      { letter: 'S', words: ['sun', 'star', 'sit'] },
      { letter: 'M', words: ['moon', 'man', 'map'] },
      { letter: 'T', words: ['tree', 'top', 'ten'] },
    ];

    const [currentSound, setCurrentSound] = useState(sounds[0]);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
      newRound();
    }, []);

    const newRound = () => {
      const correct = sounds[Math.floor(Math.random() * sounds.length)];
      const others = sounds.filter(s => s.letter !== correct.letter)
        .sort(() => Math.random() - 0.5)
        .slice(0, difficulty === 'easy' ? 2 : 3);
      
      setCurrentSound(correct);
      setOptions([correct, ...others].sort(() => Math.random() - 0.5));
      setFeedback(null);
    };

    const playSound = () => {
      const word = currentSound.words[Math.floor(Math.random() * currentSound.words.length)];
      speak(word, speechRate);
    };

    const handleSelect = (letter) => {
      if (letter === currentSound.letter) {
        setFeedback('correct');
        setScore(score + 10);
        addStars(5);
        setTimeout(newRound, 1500);
      } else {
        setFeedback('wrong');
        setTimeout(() => setFeedback(null), 1000);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setScreen('games')} className="bg-white/30 p-3 rounded-full">
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-xl font-bold text-white">👂 소리 찾기</h1>
            <div className="bg-white/30 px-3 py-2 rounded-full text-white font-bold">
              ⭐ {score}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <p className="text-lg text-gray-600 mb-4">소리를 듣고 맞는 글자를 찾아요!</p>
              <button
                onClick={playSound}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-full text-4xl hover:scale-110 transition-transform"
              >
                🔊
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((opt) => (
                <button
                  key={opt.letter}
                  onClick={() => handleSelect(opt.letter)}
                  className={`p-6 rounded-2xl text-4xl font-bold transition-all
                    ${feedback === 'correct' && opt.letter === currentSound.letter
                      ? 'bg-green-400 text-white scale-110'
                      : feedback === 'wrong' && opt.letter !== currentSound.letter
                      ? ''
                      : 'bg-yellow-100 hover:bg-yellow-200'
                    }
                  `}
                >
                  {opt.letter}
                </button>
              ))}
            </div>

            {feedback === 'correct' && (
              <div className="mt-4 text-center text-2xl text-green-500 font-bold">
                🎉 정답이에요!
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
  };

  // 문장 완성 게임
  const SentenceGame = () => {
    const sentences = [
      { sentence: 'The ___ is red.', answer: 'ball', options: ['ball', 'cat', 'sun'], emoji: '🔴' },
      { sentence: 'I see a ___.', answer: 'dog', options: ['dog', 'hat', 'cup'], emoji: '🐶' },
      { sentence: 'The sun is ___.', answer: 'hot', options: ['hot', 'big', 'red'], emoji: '☀️' },
      { sentence: 'I like to ___.', answer: 'run', options: ['run', 'sit', 'eat'], emoji: '🏃' },
      { sentence: 'The ___ can swim.', answer: 'fish', options: ['fish', 'bird', 'cat'], emoji: '🐟' },
      { sentence: 'The tree is ___.', answer: 'big', options: ['big', 'hot', 'red'], emoji: '🌳' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const current = sentences[currentIndex];

    const handleSelect = (word) => {
      if (word === current.answer) {
        setFeedback('correct');
        setScore(score + 10);
        addStars(5);
        speak(current.sentence.replace('___', current.answer), speechRate);
        setTimeout(() => {
          setFeedback(null);
          setCurrentIndex((currentIndex + 1) % sentences.length);
        }, 2000);
      } else {
        setFeedback('wrong');
        setTimeout(() => setFeedback(null), 1000);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setScreen('games')} className="bg-white/30 p-3 rounded-full">
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-xl font-bold text-white">📝 문장 완성</h1>
            <div className="bg-white/30 px-3 py-2 rounded-full text-white font-bold">
              ⭐ {score}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{current.emoji}</div>
              <div className="text-2xl font-bold text-gray-800">
                {current.sentence.split('___').map((part, i) => (
                  <span key={i}>
                    {part}
                    {i === 0 && (
                      <span className={`inline-block px-4 py-1 rounded-lg mx-1 ${
                        feedback === 'correct' ? 'bg-green-400 text-white' : 'bg-yellow-200'
                      }`}>
                        {feedback === 'correct' ? current.answer : '?'}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {current.options.map((word) => (
                <button
                  key={word}
                  onClick={() => handleSelect(word)}
                  className={`p-4 rounded-xl text-xl font-bold transition-all
                    ${feedback === 'correct' && word === current.answer
                      ? 'bg-green-400 text-white'
                      : 'bg-blue-100 hover:bg-blue-200'
                    }
                  `}
                >
                  {word}
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
  };

  // 진도 화면
  const ProgressScreen = () => {
    const level = getLevel();
    const completedCount = Object.keys(completedLessons).length;
    const totalLessons = 59;
    const progressPercent = Math.round((completedCount / totalLessons) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-indigo-200 p-3 sm:p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button onClick={() => setScreen('home')} className="bg-white/30 p-2 sm:p-3 rounded-full">
              <span className="text-xl sm:text-2xl">🏠</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white">📊 내 진도</h1>
            <div className="w-10 sm:w-12" />
          </div>

          {/* 레벨 카드 */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl mb-4 sm:mb-6">
            <div className="text-center">
              <div className="text-5xl sm:text-6xl mb-2">{level.emoji}</div>
              <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{userName}의 학습 현황</div>
              <div className={`text-base sm:text-lg font-bold ${level.color}`}>{level.name}</div>
              <div className="mt-3 sm:mt-4 flex justify-center items-center gap-2">
                <span className="text-2xl sm:text-3xl">⭐</span>
                <span className="text-2xl sm:text-3xl font-bold text-yellow-500">{stars}</span>
              </div>
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl mb-2">📚</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-800">{completedCount}</div>
              <div className="text-gray-600 text-xs sm:text-sm">완료한 레슨</div>
            </div>
            <div className="bg-white rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl mb-2">🎯</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-800">
                {progressPercent}%
              </div>
              <div className="text-gray-600 text-xs sm:text-sm">전체 진도</div>
            </div>
          </div>

          {/* 격려 메시지 */}
          <div className="bg-white/90 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 text-center">
            <p className="text-sm sm:text-lg">
              {progressPercent < 10 && `${userName}, 이제 시작이야! 화이팅! 💪`}
              {progressPercent >= 10 && progressPercent < 30 && `${userName}, 잘하고 있어! 계속 가자! 🌟`}
              {progressPercent >= 30 && progressPercent < 50 && `와! ${userName}, 벌써 많이 했네! 대단해! 🎉`}
              {progressPercent >= 50 && progressPercent < 70 && `${userName}, 절반 넘었어! 정말 잘하고 있어! 🚀`}
              {progressPercent >= 70 && progressPercent < 90 && `${userName}, 거의 다 왔어! 조금만 더! ⭐`}
              {progressPercent >= 90 && `${userName}, 정말 대단해! 파닉스 마스터야! 👑`}
            </p>
          </div>

          {/* 단계별 진도 */}
          <div className="bg-white rounded-2xl p-3 sm:p-4">
            <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">단계별 진도</h3>
            {[1, 2, 3, 4, 5, 6].map((stage) => {
              const stageData = learningData[`stage${stage}`];
              const total = stageData.lessons.length;
              const completed = stageData.lessons.filter((_, i) => 
                completedLessons[`${stage}-${i}`]
              ).length;
              const percent = Math.round((completed / total) * 100);

              return (
                <div key={stage} className="mb-2 sm:mb-3">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                    <span>{stage}단계: {stageData.title}</span>
                    <span>{completed}/{total}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 sm:h-3">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-full h-2 sm:h-3 transition-all"
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

  // 헤더 컴포넌트
  const Header = ({ title }) => (
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <button
        onClick={() => setScreen('stages')}
        className="bg-white/30 p-2 sm:p-3 rounded-full"
      >
        <span className="text-xl sm:text-2xl">←</span>
      </button>
      <h1 className="text-base sm:text-xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-1 bg-white/30 px-2 sm:px-3 py-1 sm:py-2 rounded-full">
        <span className="text-sm sm:text-base">⭐</span>
        <span className="font-bold text-white text-sm sm:text-base">{stars}</span>
      </div>
    </div>
  );

  // 네비게이션 버튼
  const NavigationButtons = ({ onPrev, onNext, onComplete, canPrev, canNext }) => (
    <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="flex-1 bg-white/80 p-3 sm:p-4 rounded-xl font-bold disabled:opacity-50 text-sm sm:text-base active:scale-95 transition-transform"
      >
        ◀ 이전
      </button>
      <button
        onClick={onComplete}
        className="flex-1 bg-yellow-400 p-3 sm:p-4 rounded-xl font-bold text-sm sm:text-base active:scale-95 transition-transform"
      >
        ⭐ 완료!
      </button>
      <button
        onClick={onNext}
        className="flex-1 bg-white/80 p-3 sm:p-4 rounded-xl font-bold text-sm sm:text-base active:scale-95 transition-transform"
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
