import React, { useState } from 'react';

export default function SightWordsLesson({ lesson, speakWord, speakSentence, onCorrect }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  const words = lesson.words || [];
  const word = words[currentIndex];

  if (!word) return null;

  const handleSpeak = () => {
    speakWord(word.word);
  };

  const handleSpeakSentence = () => {
    speakSentence(word.sentence);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowMeaning(false);
      onCorrect?.();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowMeaning(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
      <div className="text-center mb-4">
        <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
          {lesson.level} - {currentIndex + 1}/{words.length}
        </span>
      </div>

      {/* Main Word Card */}
      <div
        className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8 mb-6 cursor-pointer active:scale-95 transition-transform"
        onClick={handleSpeak}
      >
        <div className="text-6xl font-bold text-center text-indigo-700 mb-4">
          {word.word}
        </div>
        <div className="text-center text-indigo-500">
          Click to hear pronunciation
        </div>
      </div>

      {/* Meaning Toggle */}
      <button
        onClick={() => setShowMeaning(!showMeaning)}
        className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold py-3 px-4 rounded-xl mb-4 transition-colors"
      >
        {showMeaning ? '뜻 숨기기' : '뜻 보기'}
      </button>

      {showMeaning && (
        <div className="bg-yellow-50 rounded-xl p-4 mb-4 animate-fadeIn">
          <div className="text-2xl font-bold text-center text-yellow-700 mb-2">
            {word.meaning}
          </div>
        </div>
      )}

      {/* Example Sentence */}
      <div
        className="bg-green-50 rounded-xl p-4 mb-6 cursor-pointer active:scale-98 transition-transform"
        onClick={handleSpeakSentence}
      >
        <div className="text-sm text-green-600 font-medium mb-1">Example:</div>
        <div className="text-xl font-semibold text-green-700 text-center">
          "{word.sentence}"
        </div>
        <div className="text-center text-green-500 text-sm mt-2">
          Click to hear sentence
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
            currentIndex === 0
              ? 'bg-gray-200 text-gray-400'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
            currentIndex === words.length - 1
              ? 'bg-gray-200 text-gray-400'
              : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
