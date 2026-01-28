import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import alphabetData from '../../data/alphabetData';
import { playDing } from '../../utils/sound';

function getRandomLetters(exclude, count) {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .filter((l) => l !== exclude)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export default function ListeningGame({ stars, addStars, speakPhonics, speakWord, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const qs = alphabetData.lessons.slice(0, 10).map((l) => ({
      letter: l.letter,
      options: [l.letter, ...getRandomLetters(l.letter, 3)].sort(() => Math.random() - 0.5),
    }));
    setQuestions(qs);
  }, []);

  const q = questions[qIndex];
  if (!q) return null;

  const handleAnswer = (letter) => {
    if (feedback) return;
    if (letter === q.letter) {
      setFeedback('correct');
      addStars(5);
      playDing();
      speakWord('Correct!');
      setTimeout(() => {
        setFeedback(null);
        if (qIndex < questions.length - 1) setQIndex(qIndex + 1);
      }, 1500);
    } else {
      setFeedback('wrong');
      speakWord('Try again!');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-200 p-4">
      <div className="max-w-md mx-auto">
        <Header title={`👂 소리 찾기 (${qIndex + 1}/${questions.length})`} stars={stars} onBack={onBack} />
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">소리를 듣고 맞는 글자를 찾아요!</p>
            <button
              onClick={() => speakPhonics(q.letter)}
              className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-8 py-4 rounded-full text-xl font-bold active:scale-95 transition-transform min-h-[44px]"
            >
              🔊 소리 듣기
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {q.options.map((letter) => (
              <button
                key={letter}
                onClick={() => handleAnswer(letter)}
                className={`p-6 rounded-xl text-4xl font-bold transition-all active:scale-95 min-h-[44px] ${
                  feedback === 'correct' && letter === q.letter
                    ? 'bg-green-400 text-white'
                    : 'bg-blue-100'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
          {feedback === 'correct' && <div className="mt-4 text-center text-2xl text-green-500 font-bold">🎉 잘했어요!</div>}
          {feedback === 'wrong' && <div className="mt-4 text-center text-2xl text-red-500 font-bold">😅 다시 해봐요!</div>}
        </div>
      </div>
    </div>
  );
}
