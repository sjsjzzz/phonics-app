// meSpeak.js wrapper for IPA phonics sounds
// Loads meSpeak lazily to avoid blocking page load or navigation

let initPromise = null;
let meSpeakReady = false;

// meSpeak phonemes - 단어 형태로 발음 (더 확실함)
const LETTER_PHONEMES = {
  A: 'ah',         // short a sound
  B: 'buh',        // b sound
  C: 'kuh',        // hard c sound
  D: 'duh',        // d sound
  E: 'eh',         // short e sound
  F: 'fuh',        // f sound
  G: 'guh',        // hard g sound
  H: 'huh',        // h sound
  I: 'ih',         // short i sound
  J: 'juh',        // j sound
  K: 'kuh',        // k sound
  L: 'luh',        // l sound
  M: 'muh',        // m sound
  N: 'nuh',        // n sound
  O: 'ah',         // short o sound
  P: 'puh',        // p sound
  Q: 'kwuh',       // qu sound
  R: 'ruh',        // r sound
  S: 'suh',        // s sound
  T: 'tuh',        // t sound
  U: 'uh',         // short u sound
  V: 'vuh',        // v sound
  W: 'wuh',        // w sound
  X: 'ks',         // x sound
  Y: 'yuh',        // y sound
  Z: 'zuh',        // z sound
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Don't load twice
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Script load failed: ' + src)));
      }
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => { script.dataset.loaded = 'true'; resolve(); };
    script.onerror = () => reject(new Error('Script load failed: ' + src));
    document.head.appendChild(script);
  });
}

function initMeSpeak() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // 1) Load meSpeak front-end
      await loadScript('/mespeak/mespeak.js');
      const ms = window.meSpeak;
      if (!ms) {
        console.warn('meSpeak: window.meSpeak not available after script load');
        return false;
      }

      // 2) Wait for meSpeak core to be ready
      //    mespeak.js auto-loads mespeak-core.js via dynamic <script>
      const coreReady = await new Promise((resolve) => {
        let attempts = 0;
        const check = () => {
          attempts++;
          if (ms.isConfigLoaded()) {
            resolve(true);
          } else if (attempts > 50) { // 5 seconds max
            resolve(false);
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });

      if (!coreReady) {
        console.warn('meSpeak: core did not initialize');
        return false;
      }

      // 3) Verify voice file is valid JSON before passing to meSpeak
      const voiceUrl = window.location.origin + '/mespeak/en-us.json';
      const resp = await fetch(voiceUrl);
      if (!resp.ok) {
        console.warn('meSpeak: voice fetch failed', resp.status);
        return false;
      }
      const text = await resp.text();
      if (!text.startsWith('{')) {
        console.warn('meSpeak: voice file is not JSON');
        return false;
      }

      // 4) Load voice
      const voiceOk = await new Promise((resolve) => {
        ms.loadVoice(voiceUrl, (success) => resolve(success));
      });

      if (voiceOk) {
        meSpeakReady = true;
        console.log('meSpeak: ready');
      } else {
        console.warn('meSpeak: voice load returned false');
      }
      return voiceOk;
    } catch (e) {
      console.error('meSpeak init error:', e);
      return false;
    }
  })();

  return initPromise;
}

export async function playPhonicsSound(letter, options = {}) {
  const { speed = 100, onEnd = null } = options;

  const ok = await initMeSpeak();
  if (!ok || !meSpeakReady) {
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
    // 일반 텍스트로 발음 (더 자연스러움)
    window.meSpeak.speak(phoneme, {
      speed: 130,      // 약간 느리게
      pitch: 50,       // 중간 톤
      wordgap: 0,
      volume: 1.0,
    }, () => onEnd?.());
  } catch (e) {
    console.error('meSpeak speak error:', e);
    onEnd?.();
  }
}

export function preloadMeSpeak() {
  // Fire and forget — never blocks anything
  initMeSpeak().catch(() => {});
}

export { LETTER_PHONEMES };
