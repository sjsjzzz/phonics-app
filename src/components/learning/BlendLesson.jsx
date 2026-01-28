import React from 'react';

export default function BlendLesson({ lesson, speakWord }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      <button
        onClick={() => speakWord(lesson.blend)}
        className="w-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 mb-6 active:scale-95 transition-transform"
      >
        <div className="text-6xl font-bold text-purple-600 mb-2">{lesson.blend}</div>
        <div className="text-xl text-purple-500">🔊 {lesson.sound}</div>
      </button>

      <div className="grid grid-cols-2 gap-3">
        {lesson.words.map((item, i) => (
          <button
            key={i}
            onClick={() => speakWord(item.word)}
            className="bg-green-100 rounded-xl p-4 active:scale-95 transition-all text-center min-h-[44px]"
          >
            <div className="text-4xl mb-2">{item.emoji}</div>
            <div className="font-bold text-gray-700">
              <span className="text-purple-600">{lesson.blend}</span>
              {item.word.slice(item.word.indexOf(lesson.blend) === 0 ? lesson.blend.length : 0)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
