import React from 'react';

export default function AlphabetLesson({ lesson, speakPhonics, speakWord, onCorrect }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      {/* 메인 글자 카드 - meSpeak으로 순수 음가 재생 */}
      <button
        onClick={() => speakPhonics(lesson.letter)}
        className="w-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 mb-6 active:scale-95 transition-transform"
      >
        <div className="text-8xl font-bold text-blue-600 mb-2">
          {lesson.letter}{lesson.letter.toLowerCase()}
        </div>
        <div className="text-2xl text-blue-500">🔊 {lesson.sound}</div>
        <p className="text-gray-500 mt-2">터치해서 소리 들어보기!</p>
      </button>

      {/* 예시 단어들 - Web Speech API로 단어 읽기 */}
      <div className="grid grid-cols-4 gap-3">
        {lesson.words.map((item, i) => (
          <button
            key={i}
            onClick={() => speakWord(item.word)}
            className="bg-yellow-100 rounded-xl p-4 active:scale-95 transition-all min-h-[44px]"
          >
            <div className="text-4xl mb-2">{item.emoji}</div>
            <div className="text-sm font-bold text-gray-700">{item.word}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
