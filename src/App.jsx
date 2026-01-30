import React, { useState } from 'react';
import { useSpeech } from './hooks/useSpeech';
import { useUser } from './hooks/useUser';
import LoginScreen from './components/screens/LoginScreen';
import HomeScreen from './components/screens/HomeScreen';
import StagesScreen from './components/screens/StagesScreen';
import LearningScreen from './components/screens/LearningScreen';
import GamesScreen from './components/screens/GamesScreen';
import ProgressScreen from './components/screens/ProgressScreen';
import MatchingGame from './components/games/MatchingGame';
import ListeningGame from './components/games/ListeningGame';
import SpellingGame from './components/games/SpellingGame';
import SentenceGame from './components/games/SentenceGame';
import AlphabetQuizGame from './components/games/AlphabetQuizGame';

import alphabetData from './data/alphabetData';
import cvcData from './data/cvcData';
import blendData from './data/blendData';
import longVowelData from './data/longVowelData';
import specialRuleData from './data/specialRuleData';
import sightWordsData from './data/sightWordsData';
import sentenceData from './data/sentenceData';

const stageData = {
  1: alphabetData,
  2: cvcData,
  3: blendData,
  4: longVowelData,
  5: specialRuleData,
  6: sightWordsData,
  7: sentenceData,
};

export default function App() {
  const speech = useSpeech();
  const user = useUser();

  const [screen, setScreen] = useState('login');
  const [currentStage, setCurrentStage] = useState(1);
  const [currentGame, setCurrentGame] = useState(null);

  const handleLogin = (name) => {
    user.selectUser(name);
    setScreen('home');
    speech.speakWord(`Hello ${name}! Let's learn phonics!`);
  };

  const handleAddUser = (name) => {
    user.addUser(name);
    setScreen('home');
    speech.speakWord(`Hello ${name}! Let's learn phonics!`);
  };

  const handleLogout = () => {
    setScreen('login');
  };

  const handleSelectStage = (num) => {
    setCurrentStage(num);
    setScreen('learning');
  };

  const handleSelectGame = (gameId) => {
    setCurrentGame(gameId);
    setScreen('game');
  };

  const stars = user.currentUser?.stars || 0;

  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return (
          <LoginScreen
            users={user.users}
            onLogin={handleLogin}
            onAddUser={handleAddUser}
            onDeleteUser={user.deleteUser}
          />
        );
      case 'home':
        return (
          <HomeScreen
            user={user.currentUser}
            level={user.getLevel()}
            speech={speech}
            onNavigate={setScreen}
            onLogout={handleLogout}
          />
        );
      case 'stages':
        return (
          <StagesScreen
            stars={stars}
            getStageProgress={user.getStageProgress}
            stageData={stageData}
            onSelectStage={handleSelectStage}
            onBack={() => setScreen('home')}
          />
        );
      case 'learning':
        return (
          <LearningScreen
            stage={currentStage}
            stageData={stageData}
            stars={stars}
            speech={speech}
            addStars={user.addStars}
            markLessonComplete={user.markLessonComplete}
            isLessonComplete={user.isLessonComplete}
            onBack={() => setScreen('stages')}
          />
        );
      case 'games':
        return (
          <GamesScreen
            stars={stars}
            onSelectGame={handleSelectGame}
            onBack={() => setScreen('home')}
          />
        );
      case 'game':
        return renderGame();
      case 'progress':
        return (
          <ProgressScreen
            user={user.currentUser}
            level={user.getLevel()}
            stars={stars}
            getStageProgress={user.getStageProgress}
            stageData={stageData}
            onBack={() => setScreen('home')}
          />
        );
      default:
        return null;
    }
  };

  const renderGame = () => {
    const gameProps = {
      stars,
      addStars: user.addStars,
      speakWord: speech.speakWord,
      speakPhonics: speech.speakPhonics,
      speakSentence: speech.speakSentence,
      onBack: () => setScreen('games'),
    };

    switch (currentGame) {
      case 'alphabet': return <AlphabetQuizGame {...gameProps} />;
      case 'matching': return <MatchingGame {...gameProps} />;
      case 'listening': return <ListeningGame {...gameProps} />;
      case 'spelling': return <SpellingGame {...gameProps} />;
      case 'sentence': return <SentenceGame {...gameProps} />;
      default: return null;
    }
  };

  return (
    <div className="font-sans select-none" style={{ touchAction: 'manipulation' }}>
      {renderScreen()}
    </div>
  );
}
