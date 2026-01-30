// Web Audio API based sound effects (no external files needed)
let audioCtx = null;
let audioUnlocked = false;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// Unlock audio on mobile - must be called from user interaction (click/tap)
export function unlockAudio() {
  if (audioUnlocked) return Promise.resolve();

  return new Promise((resolve) => {
    try {
      const ctx = getCtx();

      // Resume AudioContext if suspended
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          audioUnlocked = true;
          resolve();
        }).catch(() => resolve());
      } else {
        audioUnlocked = true;
        resolve();
      }

      // Play silent sound to fully unlock on iOS
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);

      // Also unlock speechSynthesis on iOS
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      resolve();
    }
  });
}

// Happy "ding!" chime for correct answers
export function playDing() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Two quick ascending notes
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.3);
    });
  } catch (e) {
    // Audio not supported, silently fail
  }
}

// Star collect sound
export function playStarSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
    // silently fail
  }
}
