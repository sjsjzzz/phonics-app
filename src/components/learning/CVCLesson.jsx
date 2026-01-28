import React, { useState, useEffect, useRef } from 'react';

export default function CVCLesson({ lesson, speakPhonics, speakWord, addStars, onCorrect }) {
  const [buildingWord, setBuildingWord] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const shuffledRef = useRef([]);
  const currentWord = lesson.words[wordIndex];

  useEffect(() => {
    setBuildingWord([]);
    setWordIndex(0);
  }, [lesson]);

  useEffect(() => {
    shuffledRef.current = [...currentWord.phonemes].sort(() => Math.random() - 0.5);
  }, [currentWord]);

  const handleLetterClick = (letter) => {
    if (buildingWord.length >= currentWord.phonemes.length) return;
    const next = [...buildingWord, letter];
    setBuildingWord(next);
    speakPhonics(letter);

    if (next.length === currentWord.phonemes.length && next.join('') === currentWord.word) {
      setTimeout(() => {
        onCorrect?.();
        addStars(5);
      }, 500);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{currentWord.emoji}</div>
        <button
          onClick={() => speakWord(currentWord.word)}
          className="bg-blue-500 text-white px-6 py-3 rounded-full text-xl font-bold active:scale-95 transition-transform min-h-[44px]"
        >
          🔊 듣기
        </button>
      </div>

      {/* Word building area */}
      <div className="bg-gray-100 rounded-xl p-4 mb-4 min-h-[80px] flex items-center justify-center gap-2">
        {currentWord.phonemes.map((_, i) => (
          <div
            key={i}
            className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold ${
              buildingWord[i] ? 'bg-green-400 text-white' : 'bg-white border-2 border-dashed border-gray-300'
            }`}
          >
            {buildingWord[i] || ''}
          </div>
        ))}
      </div>

      {/* Letter choices */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {shuffledRef.current.map((letter, i) => (
          <button
            key={i}
            onClick={() => handleLetterClick(letter)}
            className="bg-blue-100 p-4 rounded-xl text-xl font-bold active:scale-95 transition-all min-h-[44px]"
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setBuildingWord([])}
          className="flex-1 bg-gray-200 p-3 rounded-xl font-bold active:scale-95 transition-transform min-h-[44px]"
        >
          🔄 다시
        </button>
        <button
          onClick={() => {
            setBuildingWord([]);
            setWordIndex((wordIndex + 1) % lesson.words.length);
          }}
          className="flex-1 bg-blue-500 text-white p-3 rounded-xl font-bold active:scale-95 transition-transform min-h-[44px]"
        >
          다음 단어 ▶
        </button>
      </div>
    </div>
  );
}
