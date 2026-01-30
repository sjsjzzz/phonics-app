// Web Audio API based sound effects (no external files needed)
let audioCtx = null;
let audioUnlocked = false;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Always try to resume on mobile
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Unlock audio on mobile - MUST be called synchronously from user tap
export function unlockAudio() {
  if (audioUnlocked) return;

  try {
    // Create and resume AudioContext
    const ctx = getCtx();

    // Play a short beep to force unlock (iOS requires actual sound)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0.001; // Nearly silent
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.001);

    // Unlock speechSynthesis - speak actual word (empty string doesn't work on iOS)
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('.');
      utterance.volume = 0.01;
      utterance.rate = 10; // Fast
      window.speechSynthesis.speak(utterance);
    }

    audioUnlocked = true;
    console.log('Audio unlocked!');
  } catch (e) {
    console.log('Audio unlock failed:', e);
  }
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
