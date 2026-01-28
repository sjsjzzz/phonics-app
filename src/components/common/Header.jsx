import React from 'react';

export default function Header({ title, stars, onBack }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={onBack}
        className="bg-white/30 p-3 rounded-full active:scale-95 transition-transform min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <span className="text-2xl">{onBack ? '←' : ''}</span>
      </button>
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-1 bg-white/30 px-3 py-2 rounded-full">
        <span>⭐</span>
        <span className="font-bold text-white">{stars}</span>
      </div>
    </div>
  );
}
