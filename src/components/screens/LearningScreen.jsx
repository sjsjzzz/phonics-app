import React, { useState, useCallback, useMemo } from 'react';
import Header from '../common/Header';
import NavigationButtons from '../common/NavigationButtons';
import Celebration from '../common/Celebration';
import AlphabetLesson from '../learning/AlphabetLesson';
import CVCLesson from '../learning/CVCLesson';
import BlendLesson from '../learning/BlendLesson';
import LongVowelLesson from '../learning/LongVowelLesson';
import SpecialRuleLesson from '../learning/SpecialRuleLesson';
import SightWordsLesson from '../learning/SightWordsLesson';
import SentenceLesson from '../learning/SentenceLesson';
import { playDing, playStarSound } from '../../utils/sound';

const BG_COLORS = {
  1: 'from-pink-400 to-pink-200',
  2: 'from-orange-400 to-orange-200',
  3: 'from-yellow-400 to-yellow-200',
  4: 'from-green-400 to-green-200',
  5: 'from-blue-400 to-blue-200',
  6: 'from-indigo-400 to-indigo-200',
  7: 'from-purple-400 to-purple-200',
};

// Shuffle array utility
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function LearningScreen({
  stage, stageData, stars,
  speech, addStars, markLessonComplete, isLessonComplete,
  onBack,
}) {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [miniFeedback, setMiniFeedback] = useState(null); // 'Great!' mini popup
  const [shuffleMode, setShuffleMode] = useState('default'); // 'default', 'random', 'alphabetical'
  const [shuffleKey, setShuffleKey] = useState(0); // Force re-shuffle

  const data = stageData[stage];

  // Get sorted/shuffled lessons based on mode
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sortedLessons = useMemo(() => {
    const lessons = [...data.lessons];
    if (shuffleMode === 'random') {
      return shuffleArray(lessons);
    } else if (shuffleMode === 'alphabetical') {
      return lessons.sort((a, b) => {
        const aKey = a.letter || a.word || a.pattern || a.rule || a.level || '';
        const bKey = b.letter || b.word || b.pattern || b.rule || b.level || '';
        return aKey.localeCompare(bKey);
      });
    }
    return lessons;
  }, [data.lessons, shuffleMode, shuffleKey]); // shuffleKey intentionally triggers re-shuffle

  const lesson = sortedLessons[lessonIndex];

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
    if (lessonIndex < sortedLessons.length - 1) {
      setLessonIndex(lessonIndex + 1);
    } else {
      onBack();
    }
  };

  const handlePrev = () => {
    if (lessonIndex > 0) setLessonIndex(lessonIndex - 1);
  };

  const handleShuffle = () => {
    const modes = ['default', 'random', 'alphabetical'];
    const currentIdx = modes.indexOf(shuffleMode);
    const nextIdx = (currentIdx + 1) % modes.length;
    setShuffleMode(modes[nextIdx]);
    if (modes[nextIdx] === 'random') {
      setShuffleKey(prev => prev + 1); // Force new shuffle
    }
    setLessonIndex(0); // Reset to first lesson
  };

  const getShuffleLabel = () => {
    switch (shuffleMode) {
      case 'random': return 'Random';
      case 'alphabetical': return 'A-Z';
      default: return 'Default';
    }
  };

  const renderLesson = () => {
    switch (stage) {
      case 1: return <AlphabetLesson lesson={lesson} speakPhonics={speech.speakPhonics} speakWord={speech.speakWord} onCorrect={onCorrect} />;
      case 2: return <CVCLesson lesson={lesson} speakPhonics={speech.speakPhonics} speakWord={speech.speakWord} addStars={addStars} onCorrect={onCorrect} />;
      case 3: return <BlendLesson lesson={lesson} speakWord={speech.speakWord} onCorrect={onCorrect} />;
      case 4: return <LongVowelLesson lesson={lesson} speakWord={speech.speakWord} onCorrect={onCorrect} />;
      case 5: return <SpecialRuleLesson lesson={lesson} speakWord={speech.speakWord} onCorrect={onCorrect} />;
      case 6: return <SightWordsLesson lesson={lesson} speakWord={speech.speakWord} speakSentence={speech.speakSentence} onCorrect={onCorrect} />;
      case 7: return <SentenceLesson lesson={lesson} speak={speech.speak} speakSentence={speech.speakSentence} speechRate={speech.rate} onCorrect={onCorrect} />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${BG_COLORS[stage] || 'from-gray-400 to-gray-200'} p-4`}>
      <div className="max-w-md mx-auto">
        <Header
          title={`${lessonIndex + 1}/${sortedLessons.length}`}
          stars={stars}
          onBack={onBack}
        />
        {/* Shuffle Button */}
        <div className="flex justify-center mb-3">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-md transition-all active:scale-95"
          >
            <span className="text-lg">🔀</span>
            <span className="font-semibold text-gray-700">{getShuffleLabel()}</span>
          </button>
        </div>
        {renderLesson()}
        <NavigationButtons
          onPrev={handlePrev}
          onNext={handleNext}
          onComplete={handleComplete}
          hasPrev={lessonIndex > 0}
          hasNext={lessonIndex < sortedLessons.length - 1}
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
