import React from 'react';

export default function Celebration({ amount = 10 }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="text-center animate-bounce">
        <div className="text-8xl">🎉</div>
        <div className="text-3xl font-bold text-white drop-shadow-lg mt-4">
          +{amount} ⭐
        </div>
      </div>
    </div>
  );
}
