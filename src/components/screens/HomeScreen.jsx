import React, { useState } from 'react';
import Modal from '../common/Modal';

export default function HomeScreen({ user, level, onNavigate, onLogout, speech }) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-white/30 px-4 py-2 rounded-full">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-white text-lg">{user.stars}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="bg-white/30 p-3 rounded-full active:scale-95 transition-transform min-w-[44px] min-h-[44px]"
            >
              ⚙️
            </button>
            <button
              onClick={onLogout}
              className="bg-white/30 p-3 rounded-full active:scale-95 transition-transform min-w-[44px] min-h-[44px]"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <div className="text-center">
            <div className="text-6xl mb-2">{level.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className={`text-lg font-medium ${level.color}`}>{level.name}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-4">
          {[
            { screen: 'stages', icon: '📖', title: '학습하기', desc: '파닉스 규칙을 배워요', color: 'from-green-400 to-green-500' },
            { screen: 'games', icon: '🎮', title: '게임하기', desc: '재미있게 복습해요', color: 'from-orange-400 to-orange-500' },
            { screen: 'progress', icon: '📊', title: '내 진도', desc: '학습 현황을 확인해요', color: 'from-purple-400 to-purple-500' },
          ].map((item) => (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`w-full bg-gradient-to-r ${item.color} p-5 rounded-2xl shadow-lg active:scale-95 transition-transform`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl bg-white/30 p-3 rounded-xl">{item.icon}</span>
                <div className="text-left">
                  <div className="text-white font-bold text-xl">{item.title}</div>
                  <div className="text-white/80 text-sm">{item.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Settings modal */}
      {showSettings && (
        <Modal onClose={() => setShowSettings(false)}>
          <h3 className="text-xl font-bold mb-4">⚙️ 설정</h3>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">발음 속도</label>
            <input
              type="range"
              min="0.5"
              max="1.2"
              step="0.1"
              value={speech.rate}
              onChange={(e) => speech.setRate(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>느리게</span>
              <span>보통</span>
              <span>빠르게</span>
            </div>
          </div>
          <button
            onClick={() => speech.speak('Hello, this is a test.', { rate: speech.rate })}
            className="w-full bg-blue-100 text-blue-600 p-3 rounded-xl mb-2 font-medium min-h-[44px] active:scale-95 transition-transform"
          >
            🔊 발음 테스트
          </button>
        </Modal>
      )}
    </div>
  );
}
