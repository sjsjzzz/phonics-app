import React, { useState, useCallback } from 'react';
import Header from '../common/Header';
import NavigationButtons from '../common/NavigationButtons';
import Celebration from '../common/Celebration';
import AlphabetLesson from '../learning/AlphabetLesson';
import CVCLesson from '../learning/CVCLesson';
import BlendLesson from '../learning/BlendLesson';
import LongVowelLesson from '../learning/LongVowelLesson';
import SpecialRuleLesson from '../learning/SpecialRuleLesson';
import SentenceLesson from '../learning/SentenceLesson';
import { playDing, playStarSound } from '../../utils/sound';

const BG_COLORS = {
  1: 'from-pink-400 to-pink-200',
  2: 'from-orange-400 to-orange-200',
  3: 'from-yellow-400 to-yellow-200',
  4: 'from-green-400 to-green-200',
  5: 'from-blue-400 to-blue-200',
  6: 'from-purple-400 to-purple-200',
};

export default function LearningScreen({
  stage, stageData, stars,
  speech, addStars, markLessonComplete, isLessonComplete,
  onBack,
}) {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [miniFeedback, setMiniFeedback] = useState(null); // 'Great!' mini popup

  const data = stageData[stage];
  const lesson = data.lessons[lessonIndex];

  // Mini celebration for correct answers within a lesson
  const onCorrect = useCallback((praise) => {
    const praises = ['Great!', 'Awesome!', 'Well done!', 'Amazing!', 'Good job!'];
    const msg = praise || praises[Math.floor(Math.random() * praises.length)];
    playDing();
    setMiniFeedback(msg);
    setTimeout(() => {
      speech.speakWord(msg);
    }, 200);
    setTimeout(() => setMiniFeedback(null), 1500);
  }, [speech]);

  const handleComplete = () => {
    if (!isLessonComplete(stage, lessonIndex)) {
      markLessonComplete(stage, lessonIndex);
      addStars(15);
      playStarSound();
      setShowCelebration(true);
      speech.speakWord('Great job!');
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const handleNext = () => {
    if (lessonIndex < data.lessons.length - 1) {
      setLessonIndex(lessonIndex + 1);
    } else {
      onBack();
    }
  };

  const handlePrev = () => {
    if (lessonIndex > 0) setLessonIndex(lessonIndex - 1);
  };

  const renderLesson = () => {
    switch (stage) {
      case 1: return <AlphabetLesson lesson={lesson} speakPhonics={speech.speakPhonics} speakWord={speech.speakWord} onCorrect={onCorrect} />;
      case 2: return <CVCLesson lesson={lesson} speakPhonics={speech.speakPhonics} speakWord={speech.speakWord} addStars={addStars} onCorrect={onCorrect} />;
      case 3: return <BlendLesson lesson={lesson} speakWord={speech.speakWord} onCorrect={onCorrect} />;
      case 4: return <LongVowelLesson lesson={lesson} speakWord={speech.speakWord} onCorrect={onCorrect} />;
      case 5: return <SpecialRuleLesson lesson={lesson} speakWord={speech.speakWord} onCorrect={onCorrect} />;
      case 6: return <SentenceLesson lesson={lesson} speak={speech.speak} speakSentence={speech.speakSentence} speechRate={speech.rate} onCorrect={onCorrect} />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${BG_COLORS[stage]} p-4`}>
      <div className="max-w-md mx-auto">
        <Header
          title={`${lessonIndex + 1}/${data.lessons.length}`}
          stars={stars}
          onBack={onBack}
        />
        {renderLesson()}
        <NavigationButtons
          onPrev={handlePrev}
          onNext={handleNext}
          onComplete={handleComplete}
          hasPrev={lessonIndex > 0}
          hasNext={lessonIndex < data.lessons.length - 1}
        />
      </div>
      {showCelebration && <Celebration amount={15} />}
      {miniFeedback && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="bg-white/90 rounded-2xl px-8 py-4 shadow-xl animate-bounce">
            <div className="text-3xl font-bold text-green-500 text-center">
              🎉 {miniFeedback}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
