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

export default function AlphabetQuizGame({ stars, addStars, speakPhonics, speakWord, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // 26개 중 랜덤 12문제
    const qs = alphabetData.lessons
      .sort(() => Math.random() - 0.5)
      .slice(0, 12)
      .map((l) => ({
        letter: l.letter,
        sound: l.sound,
        options: [l.letter, ...getRandomLetters(l.letter, 3)].sort(() => Math.random() - 0.5),
      }));
    setQuestions(qs);
  }, []);

  const q = questions[qIndex];
  if (!q) return null;

  const isFinished = qIndex >= questions.length - 1 && feedback === 'correct';

  const handleAnswer = (letter) => {
    if (feedback) return;
    if (letter === q.letter) {
      setFeedback('correct');
      setScore((s) => s + 1);
      addStars(5);
      playDing();
      speakWord('Correct!');
      setTimeout(() => {
        setFeedback(null);
        if (qIndex < questions.length - 1) {
          setQIndex(qIndex + 1);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      speakWord('Try again!');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const handlePlaySound = () => {
    speakPhonics(q.letter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-indigo-200 p-4">
      <div className="max-w-md mx-auto">
        <Header
          title={`🔤 알파벳 찾기 (${qIndex + 1}/${questions.length})`}
          stars={stars}
          onBack={onBack}
        />

        <div className="bg-white rounded-3xl p-6 shadow-xl">
          {!isFinished ? (
            <>
              {/* 발음기호 표시 + 듣기 버튼 */}
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 mb-4">
                  <div className="text-4xl font-bold text-purple-700 mb-2">
                    {q.sound}
                  </div>
                  <p className="text-gray-500 text-sm">이 소리의 알파벳은?</p>
                </div>

                <button
                  onClick={handlePlaySound}
                  className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-8 py-4 rounded-full text-xl font-bold active:scale-95 transition-transform min-h-[44px]"
                >
                  🔊 소리 듣기
                </button>
              </div>

              {/* 4개 선택지 */}
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleAnswer(letter)}
                    className={`p-6 rounded-xl text-4xl font-bold transition-all active:scale-95 min-h-[44px] ${
                      feedback === 'correct' && letter === q.letter
                        ? 'bg-green-400 text-white'
                        : feedback === 'wrong' && letter === q.letter
                        ? 'bg-yellow-200'
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
            </>
          ) : (
            /* 완료 화면 */
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold text-gray-800 mb-2">완료!</div>
              <div className="text-lg text-gray-600 mb-4">
                {questions.length}문제 중 {score}개 정답!
              </div>
              <div className="text-yellow-500 text-xl font-bold mb-6">
                ⭐ {score * 5} 별 획득!
              </div>
              <button
                onClick={onBack}
                className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-8 py-4 rounded-xl text-lg font-bold active:scale-95 transition-transform min-h-[44px]"
              >
                🏠 돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
