// meSpeak.js wrapper for IPA phonics sounds
// Uses eSpeak engine to accurately pronounce individual phoneme sounds

let initialized = false;
let initPromise = null;

// Each letter's primary phonics sound in eSpeak phoneme notation
// Wrapped in [[...]] so eSpeak treats them as raw phonemes, not text
// Reference: http://espeak.sourceforge.net/phonemes.html
const LETTER_PHONEMES = {
  A: '[[a]]',       // /æ/ - short a as in "cat"
  B: '[[b]]',       // /b/ as in "ball"
  C: '[[k]]',       // /k/ as in "cat"
  D: '[[d]]',       // /d/ as in "dog"
  E: '[[E]]',       // /ɛ/ - short e as in "bed"
  F: '[[f]]',       // /f/ as in "fish"
  G: '[[g]]',       // /g/ as in "goat"
  H: '[[h]]',       // /h/ as in "hat"
  I: '[[I]]',       // /ɪ/ - short i as in "sit"
  J: '[[dZ]]',      // /dʒ/ as in "jam"
  K: '[[k]]',       // /k/ as in "kite"
  L: '[[l]]',       // /l/ as in "lion"
  M: '[[m]]',       // /m/ as in "moon"
  N: '[[n]]',       // /n/ as in "nose"
  O: '[[0]]',       // /ɒ/ - short o as in "hot"
  P: '[[p]]',       // /p/ as in "pig"
  Q: '[[kw]]',      // /kw/ as in "queen"
  R: '[[r]]',       // /r/ as in "rabbit"
  S: '[[s]]',       // /s/ as in "sun"
  T: '[[t]]',       // /t/ as in "tree"
  U: '[[V]]',       // /ʌ/ - short u as in "cup"
  V: '[[v]]',       // /v/ as in "van"
  W: '[[w]]',       // /w/ as in "water"
  X: '[[ks]]',      // /ks/ as in "box"
  Y: '[[j]]',       // /j/ as in "yes"
  Z: '[[z]]',       // /z/ as in "zebra"
};

function doLoadVoice(ms, resolve) {
  const voiceUrl = window.location.origin + '/mespeak/voices/en.json';
  try {
    ms.loadVoice(voiceUrl, function (success) {
      if (success) {
        initialized = true;
        console.log('meSpeak voice loaded successfully');
      } else {
        console.warn('meSpeak voice load failed');
      }
      resolve(success);
    });
  } catch (e) {
    console.error('meSpeak loadVoice error:', e);
    resolve(false);
  }
}

function initMeSpeak() {
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve) => {
    const ms = window.meSpeak;
    if (!ms) {
      console.warn('meSpeak not loaded');
      resolve(false);
      return;
    }

    try {
      doLoadVoice(ms, resolve);
    } catch (e) {
      console.error('meSpeak init error:', e);
      resolve(false);
    }
  });

  return initPromise;
}

/**
 * Play the phonics sound for a given letter using meSpeak (eSpeak engine)
 * This produces the actual phoneme sound, not the letter name.
 */
export async function playPhonicsSound(letter, options = {}) {
  const { speed = 100, onEnd = null } = options;

  const ok = await initMeSpeak();
  if (!ok || !window.meSpeak) {
    onEnd?.();
    return;
  }

  const upper = (letter || '').toUpperCase();
  const phoneme = LETTER_PHONEMES[upper];
  if (!phoneme) {
    onEnd?.();
    return;
  }

  try {
    window.meSpeak.speak(phoneme, {
      speed: speed,       // words per minute (lower = slower, clearer)
      pitch: 55,          // 0-99
      wordgap: 0,
      volume: 1.0,
    }, function () {
      onEnd?.();
    });
  } catch (e) {
    console.error('meSpeak speak error:', e);
    onEnd?.();
  }
}

/**
 * Initialize meSpeak on app start (call early so voice is ready)
 */
export function preloadMeSpeak() {
  initMeSpeak();
}

export { LETTER_PHONEMES };
