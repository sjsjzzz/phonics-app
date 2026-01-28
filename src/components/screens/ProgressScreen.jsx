import React from 'react';
import Header from '../common/Header';

export default function ProgressScreen({ user, level, stars, getStageProgress, stageData, onBack }) {
  const completedCount = Object.keys(user.completedLessons).length;
  const totalLessons = Object.values(stageData).reduce((sum, s) => sum + s.lessons.length, 0);
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-indigo-200 p-4">
      <div className="max-w-md mx-auto">
        <Header title="📊 내 진도" stars={stars} onBack={onBack} />

        {/* Level card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <div className="text-center">
            <div className="text-6xl mb-2">{level.emoji}</div>
            <div className="text-xl font-bold text-gray-800 mb-1">{user.name}의 학습 현황</div>
            <div className={`text-lg font-bold ${level.color}`}>{level.name}</div>
            <div className="mt-4 flex justify-center items-center gap-2">
              <span className="text-3xl">⭐</span>
              <span className="text-3xl font-bold text-yellow-500">{stars}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
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

        {/* Per-stage progress */}
        <div className="bg-white rounded-2xl p-4">
          <h3 className="font-bold text-gray-800 mb-4">단계별 진도</h3>
          {[1, 2, 3, 4, 5, 6].map((stage) => {
            const data = stageData[stage];
            const progress = getStageProgress(stage, data.lessons.length);
            const pct = Math.round((progress.completed / progress.total) * 100);
            return (
              <div key={stage} className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{stage}단계: {data.title}</span>
                  <span>{progress.completed}/{progress.total}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-full h-3 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
