import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import cvcData from '../../data/cvcData';
import { playDing } from '../../utils/sound';

export default function SpellingGame({ stars, addStars, speakWord, onBack }) {
  const [words, setWords] = useState([]);
  const [wIndex, setWIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [shuffled, setShuffled] = useState([]);

  useEffect(() => {
    const all = cvcData.lessons.flatMap((l) => l.words);
    const picked = all.sort(() => Math.random() - 0.5).slice(0, 8);
    setWords(picked);
  }, []);

  const current = words[wIndex];

  useEffect(() => {
    if (!current) return;
    const extra = 'abcdefghijklmnopqrstuvwxyz'
      .split('')
      .filter((c) => !current.phonemes.includes(c))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    setShuffled([...current.phonemes, ...extra].sort(() => Math.random() - 0.5));
    setSelected([]);
    setFeedback(null);
  }, [current]);

  if (!current) return null;

  const handleSelect = (letter, idx) => {
    const next = [...selected, { letter, idx }];
    setSelected(next);

    if (next.length === current.phonemes.length) {
      const attempt = next.map((s) => s.letter).join('');
      if (attempt === current.word) {
        setFeedback('correct');
        addStars(5);
        playDing();
        speakWord(current.word);
        setTimeout(() => {
          if (wIndex < words.length - 1) setWIndex(wIndex + 1);
        }, 1500);
      } else {
        setFeedback('wrong');
        setTimeout(() => {
          setSelected([]);
          setFeedback(null);
        }, 1000);
      }
    }
  };

  const usedIndices = selected.map((s) => s.idx);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-200 p-4">
      <div className="max-w-md mx-auto">
        <Header title={`🧩 단어 조립 (${wIndex + 1}/${words.length})`} stars={stars} onBack={onBack} />
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{current.emoji}</div>
            <button
              onClick={() => speakWord(current.word)}
              className="bg-blue-500 text-white px-6 py-3 rounded-full text-xl font-bold active:scale-95 transition-transform min-h-[44px]"
            >
              🔊 듣기
            </button>
          </div>

          {/* Target slots */}
          <div className="flex justify-center gap-2 mb-6">
            {current.phonemes.map((_, i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold ${
                  selected[i]
                    ? feedback === 'correct'
                      ? 'bg-green-400 text-white'
                      : feedback === 'wrong'
                      ? 'bg-red-400 text-white'
                      : 'bg-blue-400 text-white'
                    : 'bg-gray-200 border-2 border-dashed border-gray-300'
                }`}
              >
                {selected[i]?.letter || ''}
              </div>
            ))}
          </div>

          {/* Letter choices */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {shuffled.map((letter, i) => (
              <button
                key={i}
                onClick={() => !usedIndices.includes(i) && !feedback && handleSelect(letter, i)}
                disabled={usedIndices.includes(i) || !!feedback}
                className={`p-4 rounded-xl text-xl font-bold active:scale-95 transition-all min-h-[44px] ${
                  usedIndices.includes(i) ? 'opacity-30 bg-gray-200' : 'bg-blue-100'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setSelected([]); setFeedback(null); }}
            className="w-full bg-gray-200 p-3 rounded-xl font-bold active:scale-95 transition-transform min-h-[44px]"
          >
            🔄 다시
          </button>

          {feedback === 'correct' && <div className="mt-4 text-center text-2xl text-green-500 font-bold">🎉 잘했어요!</div>}
          {feedback === 'wrong' && <div className="mt-4 text-center text-2xl text-red-500 font-bold">😅 다시 해봐요!</div>}
        </div>
      </div>
    </div>
  );
}
