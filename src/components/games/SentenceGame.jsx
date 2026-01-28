import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import sentenceData from '../../data/sentenceData';
import { playDing } from '../../utils/sound';

export default function SentenceGame({ stars, addStars, speakWord, speakSentence, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Create fill-in-the-blank questions from sentences
    const qs = [];
    sentenceData.lessons.forEach((level) => {
      level.sentences.forEach((s) => {
        const words = s.text.split(' ');
        if (words.length < 3) return;
        // Pick a word to blank out (not first, not punctuation-only)
        const candidates = words
          .map((w, i) => ({ w, i }))
          .filter(({ w, i }) => i > 0 && w.replace(/[^a-zA-Z]/g, '').length > 1);
        if (candidates.length === 0) return;
        const target = candidates[Math.floor(Math.random() * candidates.length)];
        const cleanWord = target.w.replace(/[^a-zA-Z]/g, '').toLowerCase();
        const distractors = ['cat', 'big', 'run', 'see', 'the', 'red', 'hot', 'fun']
          .filter((d) => d !== cleanWord)
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
        qs.push({
          sentence: s.text,
          emoji: s.emoji,
          blankIndex: target.i,
          answer: target.w,
          options: [target.w, ...distractors].sort(() => Math.random() - 0.5),
        });
      });
    });
    setQuestions(qs.sort(() => Math.random() - 0.5).slice(0, 6));
  }, []);

  const q = questions[qIndex];
  if (!q) return null;

  const words = q.sentence.split(' ');

  const handleAnswer = (word) => {
    if (feedback) return;
    if (word === q.answer) {
      setFeedback('correct');
      addStars(5);
      playDing();
      speakSentence(q.sentence);
      setTimeout(() => {
        setFeedback(null);
        if (qIndex < questions.length - 1) setQIndex(qIndex + 1);
      }, 2000);
    } else {
      setFeedback('wrong');
      speakWord('Try again!');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-yellow-200 p-4">
      <div className="max-w-md mx-auto">
        <Header title={`📝 문장 완성 (${qIndex + 1}/${questions.length})`} stars={stars} onBack={onBack} />
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">{q.emoji}</div>
            <div className="text-xl font-bold leading-relaxed flex flex-wrap justify-center gap-1">
              {words.map((w, i) => (
                <span
                  key={i}
                  className={`px-1 ${
                    i === q.blankIndex
                      ? feedback === 'correct'
                        ? 'bg-green-300 rounded px-2'
                        : 'bg-yellow-200 rounded px-2 border-b-2 border-dashed border-gray-400'
                      : ''
                  }`}
                >
                  {i === q.blankIndex && feedback !== 'correct' ? '______' : w}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className={`w-full p-4 rounded-xl text-lg font-bold active:scale-95 transition-all min-h-[44px] ${
                  feedback === 'correct' && opt === q.answer
                    ? 'bg-green-400 text-white'
                    : 'bg-blue-100'
                }`}
              >
                {opt}
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
