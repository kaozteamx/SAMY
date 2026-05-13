import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Check } from 'lucide-react';

interface TimerProps {
  durationMinutes: number;
  onComplete: () => void;
}

export default function Timer({ durationMinutes, onComplete }: TimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [remaining, setRemaining] = useState<number>(totalSeconds);
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining(r => {
        const next = r - 1;
        if (next <= 0) {
          setRunning(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, remaining]);

  useEffect(() => {
    if (remaining === 0 && !running) {
      onComplete();
    }
  }, [remaining, running, onComplete]);

  const progress = 1 - (remaining / totalSeconds);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const pct = remaining / totalSeconds;

  const formatTime = (s: number): string => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-full overflow-hidden">
      <div className="relative w-[180px] h-[180px] shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90 drop-shadow-lg">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#E8E5F0" strokeWidth="10" />
          <motion.circle
            cx="100" cy="100" r={radius}
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: circumference * progress }}
            transition={{ duration: 1, ease: "linear" }}
            strokeDasharray={circumference}
            style={{ filter: 'drop-shadow(0 0 4px rgba(124, 58, 237, 0.3))' }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={pct > 0.5 ? '#7C3AED' : pct > 0.2 ? '#F59E0B' : '#EF4444'} />
              <stop offset="100%" stopColor={pct > 0.5 ? '#A78BFA' : pct > 0.2 ? '#FBBF24' : '#F97316'} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={remaining}
            initial={{ scale: 1.15 }} animate={{ scale: 1 }}
            className="text-[38px] font-black text-text"
          >
            {formatTime(remaining)}
          </motion.span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 w-full">
        {!running ? (
          <button
            onClick={() => setRunning(true)}
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
            }}
            className="flex items-center gap-1.5 px-5 py-3 rounded-2xl font-extrabold text-white active:scale-95 transition-all text-sm"
          >
            <Play fill="currentColor" size={16} />
            {remaining === totalSeconds ? 'Iniciar' : 'Seguir'}
          </button>
        ) : (
          <button
            onClick={() => setRunning(false)}
            style={{
              background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
              boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)',
            }}
            className="flex items-center gap-1.5 px-5 py-3 rounded-2xl font-extrabold text-white active:scale-95 transition-all text-sm"
          >
            <Pause fill="currentColor" size={16} />
            Pausa
          </button>
        )}
        <button
          onClick={() => { setRunning(false); onComplete(); }}
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
          }}
          className="flex items-center gap-1.5 px-5 py-3 rounded-2xl font-extrabold text-white active:scale-95 transition-all text-sm"
        >
          <Check strokeWidth={3} size={16} />
          ¡Listo!
        </button>
      </div>
    </div>
  );
}
