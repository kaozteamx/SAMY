import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer as TimerIcon, ArrowLeft, RotateCcw } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useSounds, fireConfetti } from '../hooks/useSounds';
import { useStore } from '../store/useStore';
import Timer from '../components/Timer';

const TIME_OPTIONS = [
  { label: '1 min', mins: 1 },
  { label: '3 min', mins: 3 },
  { label: '5 min', mins: 5 },
  { label: '10 min', mins: 10 },
  { label: '15 min', mins: 15 },
  { label: '20 min', mins: 20 },
  { label: '30 min', mins: 30 },
  { label: '45 min', mins: 45 },
  { label: '1 hora', mins: 60 },
  { label: '1.5 h', mins: 90 },
  { label: '2 horas', mins: 120 },
  { label: '3 horas', mins: 180 },
];

export default function Rapido() {
  const [activeMins, setActiveMins] = useState<number | null>(null);
  const { speak } = useSpeech();
  const { playClick, playSuccess, ensureAudio } = useSounds();
  const addPoints = useStore(state => state.addPoints);

  const handleStart = (m: number) => {
    ensureAudio();
    playClick();
    setActiveMins(m);
    
    let text = `${m} minutos`;
    if (m === 60) text = 'una hora';
    if (m === 90) text = 'una hora y media';
    if (m === 120) text = 'dos horas';
    if (m === 180) text = 'tres horas';
    
    speak(`Temporizador de ${text}.`);
  };

  const handleComplete = () => {
    playSuccess();
    fireConfetti();
    addPoints(10);
    setActiveMins(null);
    speak('¡Tiempo completado! ¡Muy bien!');
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-[calc(100vh-180px)]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
          style={{
            background: 'linear-gradient(135deg, #06B6D4, #67E8F9)',
            boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)',
          }}
        >
          <TimerIcon size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-black text-gradient">Conteo Rápido</h1>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeMins ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center glass rounded-[40px] p-8 text-center"
          >
            <div className="mb-8">
              <span className="text-sm font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block">
                Tiempo en curso
              </span>
              <h2 className="text-4xl font-black text-gradient">
                {activeMins >= 60 
                  ? `${Math.floor(activeMins/60)}h ${activeMins%60 > 0 ? (activeMins%60 + 'm') : ''}` 
                  : `${activeMins} minutos`}
              </h2>
            </div>

            <div className="w-full max-w-[320px]">
              <Timer durationMinutes={activeMins} onComplete={handleComplete} />
            </div>

            <div className="flex gap-4 mt-12 w-full max-w-[320px]">
              <button
                onClick={() => { playClick(); setActiveMins(null); }}
                className="flex-1 py-4 rounded-2xl font-bold text-text-muted bg-surface border border-white/40 active:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} /> Cancelar
              </button>
              <button
                onClick={() => { playClick(); const m = activeMins; setActiveMins(null); setTimeout(() => setActiveMins(m), 10); }}
                className="w-14 h-14 rounded-2xl bg-surface border border-white/40 flex items-center justify-center text-text-muted active:scale-90 transition-transform"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            <div className="glass rounded-[32px] p-6">
              <p className="text-text-muted font-bold text-center mb-6 text-lg">
                ¿Cuánto tiempo quieres poner?
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {TIME_OPTIONS.map((opt, i) => (
                  <motion.button
                    key={opt.mins}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleStart(opt.mins)}
                    className="flex flex-col items-center justify-center p-6 rounded-[24px] transition-all relative overflow-hidden group"
                    style={{
                      background: 'white',
                      border: '2px solid rgba(167, 139, 250, 0.15)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-3xl font-black text-text group-hover:text-primary transition-colors">
                      {opt.mins >= 60 ? Math.floor(opt.mins/60) : opt.mins}
                    </span>
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">
                      {opt.mins >= 60 ? (opt.mins === 60 ? 'Hora' : 'Horas') : 'Minutos'}
                    </span>
                    {opt.mins % 60 !== 0 && opt.mins > 60 && (
                      <span className="text-[10px] font-bold text-primary-light absolute top-3 right-3">
                        +30m
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
