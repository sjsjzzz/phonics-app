import React from 'react';
import Header from '../common/Header';

const STAGES = [
  { num: 1, title: '알파벳 소리', icon: '🔤', color: 'from-pink-400 to-pink-500' },
  { num: 2, title: 'CVC 단어', icon: '📖', color: 'from-orange-400 to-orange-500' },
  { num: 3, title: '자음 블렌드', icon: '🔀', color: 'from-yellow-400 to-yellow-500' },
  { num: 4, title: '장모음 & Magic E', icon: '✨', color: 'from-green-400 to-green-500' },
  { num: 5, title: '특수 규칙', icon: '📚', color: 'from-blue-400 to-blue-500' },
  { num: 6, title: '필수 단어', icon: '👁️', color: 'from-indigo-400 to-indigo-500' },
  { num: 7, title: '문장 읽기', icon: '📝', color: 'from-purple-400 to-purple-500' },
];

export default function StagesScreen({ stars, getStageProgress, stageData, onSelectStage, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-indigo-200 p-4">
      <div className="max-w-md mx-auto">
        <Header title="🗺️ 학습 단계" stars={stars} onBack={onBack} />
        <div className="space-y-4">
          {STAGES.map((stage) => {
            const data = stageData[stage.num];
            const progress = getStageProgress(stage.num, data.lessons.length);
            const pct = Math.round((progress.completed / progress.total) * 100);

            return (
              <button
                key={stage.num}
                onClick={() => onSelectStage(stage.num)}
                className={`w-full bg-gradient-to-r ${stage.color} p-4 rounded-2xl shadow-lg active:scale-95 transition-transform`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl bg-white/30 p-3 rounded-xl">{stage.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="text-white font-bold text-lg">{stage.num}단계: {stage.title}</div>
                    <div className="text-white/80 text-sm">{progress.completed}/{progress.total} 완료</div>
                    <div className="mt-2 bg-white/30 rounded-full h-2">
                      <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-2xl text-white">▶</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
