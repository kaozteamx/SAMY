import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useSounds } from '../hooks/useSounds';
import Timer from './Timer';

interface QuickTimerProps {
  onComplete: () => void;
}

export default function QuickTimer({ onComplete }: QuickTimerProps) {
  const [activeMins, setActiveMins] = useState<number | null>(null);
  const { speak } = useSpeech();
  const { ensureAudio } = useSounds();

  const handleStart = (m: number) => {
    ensureAudio();
    setActiveMins(m);
    speak(`Temporizador de ${m} minutos.`);
  };

  if (activeMins) {
    return (
      <div className="glass rounded-[28px] p-6 flex flex-col items-center overflow-hidden">
        <h2 className="text-2xl font-extrabold text-gradient mb-5">⏱️ {activeMins} minutos</h2>
        <Timer durationMinutes={activeMins} onComplete={() => { setActiveMins(null); onComplete(); }} />
        <button
          onClick={() => setActiveMins(null)}
          className="mt-5 text-text-muted font-bold px-5 py-2.5 bg-gray-100 rounded-2xl active:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-[28px] p-6 overflow-hidden">
      <h3 className="text-xl font-extrabold text-center text-gradient mb-6">
        ⏱️ Temporizador Rápido
      </h3>
      <p className="text-text-muted text-center font-semibold text-sm mb-5">
        ¿Cuánto tiempo necesitas?
      </p>
      <div className="grid grid-cols-3 gap-3 max-w-full">
        {[1, 3, 5, 10, 15, 30].map(m => (
          <button
            key={m}
            onClick={() => handleStart(m)}
            className="flex flex-col items-center justify-center p-4 bg-surface rounded-2xl border-2 border-primary-light/20 active:scale-95 active:bg-primary-light/10 transition-all min-w-0"
          >
            <span className="text-2xl font-extrabold text-text truncate">{m}</span>
            <span className="text-xs font-bold text-text-muted">min</span>
          </button>
        ))}
      </div>
    </div>
  );
}
