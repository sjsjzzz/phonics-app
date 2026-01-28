import { useState, useEffect, useCallback, useRef } from 'react';
import { playPhonicsSound, preloadMeSpeak } from '../utils/phonicsAudio';

let cachedVoice = null;
let voicesInitialized = false;
let voiceLoadPromise = null;

const loadVoices = () => {
  if (voiceLoadPromise) return voiceLoadPromise;

  voiceLoadPromise = new Promise((resolve) => {
    const tryGetVoices = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      if (voices.length > 0) {
        const prefs = [
          (v) => v.name.includes('Google') && v.lang.startsWith('en'),
          (v) => v.name.includes('Microsoft') && (v.name.includes('Online') || v.name.includes('Natural')),
          (v) => ['Samantha', 'Alex', 'Karen', 'Daniel'].some((n) => v.name.includes(n)),
          (v) => v.name.includes('Microsoft') && v.lang.startsWith('en'),
          (v) => !v.localService && v.lang.startsWith('en'),
          (v) => v.lang.startsWith('en-US'),
          (v) => v.lang.startsWith('en'),
        ];
        for (const pref of prefs) {
          const found = voices.find(pref);
          if (found) {
            cachedVoice = found;
            voicesInitialized = true;
            resolve(found);
            return;
          }
        }
        cachedVoice = voices[0];
        voicesInitialized = true;
        resolve(voices[0]);
      }
    };

    tryGetVoices();
    if (!voicesInitialized && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = tryGetVoices;
      setTimeout(() => {
        if (!voicesInitialized) resolve(null);
      }, 3000);
    }
  });

  return voiceLoadPromise;
};

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(0.8);
  const resumeRef = useRef(null);

  useEffect(() => {
    loadVoices();
    preloadMeSpeak(); // 앱 시작 시 meSpeak 음성 미리 로드
    return () => {
      if (resumeRef.current) clearInterval(resumeRef.current);
    };
  }, []);

  // Web Speech API로 영어 텍스트(단어/문장) 읽기
  const speak = useCallback(async (text, options = {}) => {
    const {
      rate: r = 0.8,
      pitch = 1.0,
      onEnd = null,
    } = options;

    if (!window.speechSynthesis) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    if (resumeRef.current) clearInterval(resumeRef.current);

    await loadVoices();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = r;
    utterance.pitch = pitch;
    utterance.volume = 1.0;
    if (cachedVoice) utterance.voice = cachedVoice;

    setSpeaking(true);

    resumeRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);

    utterance.onend = () => {
      clearInterval(resumeRef.current);
      setSpeaking(false);
      onEnd?.();
    };
    utterance.onerror = () => {
      clearInterval(resumeRef.current);
      setSpeaking(false);
      onEnd?.();
    };

    setTimeout(() => window.speechSynthesis.speak(utterance), 50);
  }, []);

  // meSpeak으로 순수 발음기호 음가 재생 (알파벳 카드, CVC 개별 글자, 게임)
  const speakPhonics = useCallback((letter, onEnd) => {
    playPhonicsSound(letter, { speed: 100, onEnd });
  }, []);

  // 단어 발음 (Web Speech API)
  const speakWord = useCallback((word, onEnd) => {
    speak(word, { rate: 0.75, onEnd });
  }, [speak]);

  // 문장 발음 (Web Speech API)
  const speakSentence = useCallback((sentence, onEnd) => {
    speak(sentence, { rate: 0.85, onEnd });
  }, [speak]);

  return { speak, speakPhonics, speakWord, speakSentence, speaking, rate, setRate };
}
