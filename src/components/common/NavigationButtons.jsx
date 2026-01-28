import React from 'react';

export default function NavigationButtons({ onPrev, onNext, onComplete, hasPrev, hasNext }) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="flex-1 bg-white/80 p-4 rounded-xl font-bold disabled:opacity-50 active:scale-95 transition-transform min-h-[44px]"
      >
        ◀ 이전
      </button>
      <button
        onClick={onComplete}
        className="flex-1 bg-yellow-400 p-4 rounded-xl font-bold active:scale-95 transition-transform min-h-[44px]"
      >
        ⭐ 완료!
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="flex-1 bg-white/80 p-4 rounded-xl font-bold disabled:opacity-50 active:scale-95 transition-transform min-h-[44px]"
      >
        다음 ▶
      </button>
    </div>
  );
}
