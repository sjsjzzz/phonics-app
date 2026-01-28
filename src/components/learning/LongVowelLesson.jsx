import React from 'react';

export default function LongVowelLesson({ lesson, speakWord }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      {lesson.shortWord && (
        <div className="bg-gradient-to-r from-gray-100 to-pink-100 rounded-2xl p-4 mb-6">
          <div className="text-center text-gray-600 mb-2">✨ Magic E의 마법!</div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => speakWord(lesson.shortWord)}
              className="bg-gray-200 p-4 rounded-xl active:scale-95 transition-transform min-h-[44px]"
            >
              <div className="text-3xl font-bold">{lesson.shortWord}</div>
              <div className="text-sm text-gray-500">단모음</div>
            </button>
            <div className="text-3xl">→</div>
            <button
              onClick={() => speakWord(lesson.longWord)}
              className="bg-pink-200 p-4 rounded-xl active:scale-95 transition-transform min-h-[44px]"
            >
              <div className="text-3xl font-bold">{lesson.longWord}</div>
              <div className="text-sm text-pink-600">장모음!</div>
            </button>
          </div>
        </div>
      )}

      {lesson.sound && (
        <div className="text-center mb-4">
          <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-bold">
            {lesson.pattern} = {lesson.sound}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {lesson.words.map((item, i) => (
          <button
            key={i}
            onClick={() => speakWord(item.word)}
            className="bg-yellow-100 rounded-xl p-4 active:scale-95 transition-all min-h-[44px]"
          >
            <div className="text-4xl mb-2">{item.emoji}</div>
            <div className="font-bold text-gray-700">{item.word}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
