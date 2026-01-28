import React, { useState, useEffect } from 'react';
import Header from '../common/Header';
import alphabetData from '../../data/alphabetData';
import { playDing } from '../../utils/sound';

export default function MatchingGame({ stars, addStars, speakWord, onBack }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    const words = alphabetData.lessons.slice(0, 6).map((l) => ({
      word: l.words[0].word,
      emoji: l.words[0].emoji,
    }));
    const deck = [
      ...words.map((w, i) => ({ id: `w-${i}`, type: 'word', content: w.word, pairId: i })),
      ...words.map((w, i) => ({ id: `e-${i}`, type: 'emoji', content: w.emoji, pairId: i })),
    ].sort(() => Math.random() - 0.5);
    setCards(deck);
  }, []);

  const handleClick = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.pairId)) return;

    const next = [...flipped, card.id];
    setFlipped(next);
    if (card.type === 'word') speakWord(card.content);

    if (next.length === 2) {
      const [a, b] = next.map((id) => cards.find((c) => c.id === id));
      if (a.pairId === b.pairId) {
        setMatched((prev) => [...prev, a.pairId]);
        addStars(5);
        playDing();
        setTimeout(() => setFlipped([]), 500);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const done = matched.length === 6;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-400 to-pink-200 p-4">
      <div className="max-w-md mx-auto">
        <Header title="🎴 카드 뒤집기" stars={stars} onBack={onBack} />
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card) => {
            const show = flipped.includes(card.id) || matched.includes(card.pairId);
            return (
              <button
                key={card.id}
                onClick={() => handleClick(card)}
                className={`aspect-square rounded-xl text-2xl font-bold transition-all min-h-[44px] ${
                  show ? 'bg-white' : 'bg-blue-500'
                } ${matched.includes(card.pairId) ? 'opacity-50' : ''}`}
              >
                {show ? card.content : '?'}
              </button>
            );
          })}
        </div>
        {done && (
          <div className="mt-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-white text-xl font-bold">완료!</div>
          </div>
        )}
      </div>
    </div>
  );
}
