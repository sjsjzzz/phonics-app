import React from 'react';

export default function SpecialRuleLesson({ lesson, speakWord }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-4 mb-6 text-center">
        <div className="text-xl font-bold text-blue-600 mb-2">{lesson.rule}</div>
        {lesson.sound && <div className="text-lg text-blue-500">발음: {lesson.sound}</div>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {lesson.words.map((item, i) => (
          <button
            key={i}
            onClick={() => speakWord(item.word)}
            className="bg-indigo-100 rounded-xl p-4 active:scale-95 transition-all min-h-[44px]"
          >
            <div className="text-4xl mb-2">{item.emoji}</div>
            <div className="font-bold text-gray-700">{item.word}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
