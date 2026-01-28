import React from 'react';
import Header from '../common/Header';

const GAMES = [
  { id: 'alphabet', name: '알파벳 찾기', emoji: '🔤', desc: '발음기호를 듣고 알파벳을 찾아요', color: 'from-indigo-400 to-indigo-500' },
  { id: 'matching', name: '카드 뒤집기', emoji: '🎴', desc: '그림과 단어를 매칭해요', color: 'from-pink-400 to-pink-500' },
  { id: 'listening', name: '소리 찾기', emoji: '👂', desc: '소리를 듣고 맞는 글자를 찾아요', color: 'from-green-400 to-green-500' },
  { id: 'spelling', name: '단어 조립', emoji: '🧩', desc: '글자를 조합해서 단어를 완성해요', color: 'from-blue-400 to-blue-500' },
  { id: 'sentence', name: '문장 완성', emoji: '📝', desc: '빈칸에 알맞은 단어를 넣어요', color: 'from-yellow-400 to-yellow-500' },
];

export default function GamesScreen({ stars, onSelectGame, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-purple-200 p-4">
      <div className="max-w-md mx-auto">
        <Header title="🎮 게임" stars={stars} onBack={onBack} />
        <div className="space-y-4">
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className={`w-full bg-gradient-to-r ${game.color} p-5 rounded-2xl shadow-lg active:scale-95 transition-transform`}
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
}
