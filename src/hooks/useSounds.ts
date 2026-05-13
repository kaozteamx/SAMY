import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

export function useSounds() {
  const audioCtx = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
    if (window.speechSynthesis && !window.speechSynthesis.speaking) {
      const v = new SpeechSynthesisUtterance('');
      v.volume = 0;
      window.speechSynthesis.speak(v);
    }
    return audioCtx.current;
  }, []);

  const playTone = useCallback((freq: number, duration = 0.15, type: OscillatorType = 'sine') => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context may not be initialized
    }
  }, [getCtx]);

  return {
    ensureAudio: getCtx,
    playSuccess: useCallback(() => {
      playTone(523, 0.12);
      setTimeout(() => playTone(659, 0.12), 100);
      setTimeout(() => playTone(784, 0.2), 200);
    }, [playTone]),
    playComplete: useCallback(() => {
      playTone(523, 0.1);
      setTimeout(() => playTone(659, 0.1), 80);
      setTimeout(() => playTone(784, 0.1), 160);
      setTimeout(() => playTone(1047, 0.3), 240);
    }, [playTone]),
    playClick: useCallback(() => playTone(440, 0.08, 'triangle'), [playTone]),
    playWrong: useCallback(() => playTone(200, 0.3, 'triangle'), [playTone]),
    playPop: useCallback(() => playTone(880, 0.06), [playTone]),
  };
}

export function fireConfetti(): void {
  const count = 200;
  const defaults = { origin: { y: 0.7 } };

  function fire(particleRatio: number, opts: Record<string, unknown>) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}
