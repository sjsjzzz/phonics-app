import React, { useState } from 'react';

export default function SentenceLesson({ lesson, speak, speakSentence, speechRate }) {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const sentence = lesson.sentences[sentenceIndex];

  const readWithHighlight = () => {
    let idx = 0;
    const readNext = () => {
      if (idx < sentence.chunks.length) {
        setHighlightIndex(idx);
        speak(sentence.chunks[idx], {
          rate: speechRate,
          onEnd: () => {
            idx++;
            setTimeout(readNext, 300);
          },
        });
      } else {
        setHighlightIndex(-1);
      }
    };
    readNext();
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{sentence.emoji}</div>
        <div className="text-2xl font-bold leading-relaxed">
          {sentence.chunks.map((chunk, i) => (
            <span
              key={i}
              className={`inline-block mx-1 px-2 py-1 rounded transition-all ${
                highlightIndex === i ? 'bg-yellow-300 scale-110' : 'bg-gray-100'
              }`}
            >
              {chunk}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={readWithHighlight}
          className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-xl font-bold text-lg active:scale-95 transition-transform min-h-[44px]"
        >
          🔊 천천히 듣기
        </button>
        <button
          onClick={() => speakSentence(sentence.text)}
          className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 rounded-xl font-bold text-lg active:scale-95 transition-transform min-h-[44px]"
        >
          🎵 자연스럽게
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setSentenceIndex(Math.max(0, sentenceIndex - 1))}
          disabled={sentenceIndex === 0}
          className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50 min-h-[44px]"
        >
          ◀ 이전
        </button>
        <span className="text-gray-600">{sentenceIndex + 1} / {lesson.sentences.length}</span>
        <button
          onClick={() => setSentenceIndex(Math.min(lesson.sentences.length - 1, sentenceIndex + 1))}
          disabled={sentenceIndex === lesson.sentences.length - 1}
          className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50 min-h-[44px]"
        >
          다음 ▶
        </button>
      </div>
    </div>
  );
}
