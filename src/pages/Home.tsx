import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Flame, Star, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSpeech } from '../hooks/useSpeech';
import { useSounds } from '../hooks/useSounds';
import Mascot from '../components/Mascot';

interface Module {
  path: string;
  emoji: string;
  title: string;
  desc: string;
  gradient: string;
}

export default function Home() {
  const navigate = useNavigate();
  const points = useStore(state => state.points);
  const streak = useStore(state => state.streak);
  const getCompletedCount = useStore(state => state.getCompletedCount);
  const verifyPin = useStore(state => state.verifyPin);
  const { speak } = useSpeech();
  const { playClick, ensureAudio } = useSounds();
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const completedToday = getCompletedCount();

  const handleNav = (mod: Module) => {
    ensureAudio();
    playClick();
    speak(mod.title);
    setTimeout(() => navigate(mod.path), 300);
  };

  const handlePinSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (verifyPin(pin)) {
      setShowPin(false);
      navigate('/config');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
      setPin('');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-24">
      {/* Stats Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-elevated rounded-[28px] p-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
            }}
          >
            <Star fill="white" className="text-white drop-shadow-sm" size={22} />
          </div>
          <div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wide">Estrellas</div>
            <div className="text-2xl font-black text-text">{points}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-full"
            style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(239, 68, 68, 0.08))' }}
          >
            <Flame fill="#F59E0B" className="text-orange-500" size={18} />
            <span className="font-extrabold text-sm text-text">{streak} <span className="text-xs text-text-muted font-semibold">días</span></span>
          </div>
          <button
            onClick={() => setShowPin(true)}
            className="w-10 h-10 rounded-2xl bg-surface flex items-center justify-center active:scale-90 transition-transform border border-white/40"
          >
            <Settings size={18} className="text-text-muted" />
          </button>
        </div>
      </motion.div>

      {/* Hero */}
      <div className="text-center pt-2">
        <motion.h1
          initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[42px] font-black leading-tight"
        >
          <span className="text-gradient">¡Hola Samy!</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="text-text-muted font-semibold mt-1.5 text-base"
        >
          Hoy completaste <span className="text-primary font-extrabold">{completedToday}</span> tareas
        </motion.p>
      </div>

      {/* Mascot */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
      >
        <Mascot size={170} />
      </motion.div>

      {/* Module Cards */}
      <div className="flex flex-col gap-3.5 mt-1">
        {([
          {
            path: '/mapa', emoji: '📋', title: 'Mi Mapa del Día',
            desc: 'Organiza tus actividades',
            gradient: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
          },
          {
            path: '/habla', emoji: '💬', title: 'Habla Aventuras',
            desc: 'Comunícate y practica',
            gradient: 'linear-gradient(135deg, #F9A8D4 0%, #EC4899 100%)',
          },
          {
            path: '/retos', emoji: '🧩', title: 'Micro-Retos',
            desc: 'Juegos y desafíos',
            gradient: 'linear-gradient(135deg, #67E8F9 0%, #06B6D4 100%)',
          },
        ] as Module[]).map((mod, i) => (
          <motion.button
            key={mod.path}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleNav(mod)}
            className="relative overflow-hidden flex items-center gap-4 p-5 rounded-[24px] text-white text-left active:scale-[0.97] transition-transform"
            style={{
              background: mod.gradient,
              boxShadow: '0 8px 32px -6px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full bg-white/10" />
            <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/8" />
            <span className="text-[42px] relative z-10 drop-shadow-md">{mod.emoji}</span>
            <div className="flex-1 relative z-10">
              <div className="text-xl font-extrabold drop-shadow-sm">{mod.title}</div>
              <div className="text-sm font-semibold opacity-85">{mod.desc}</div>
            </div>
            <ChevronRight className="relative z-10 opacity-70" size={24} strokeWidth={2.5} />
          </motion.button>
        ))}
      </div>

      {/* Pin Modal */}
      <AnimatePresence>
        {showPin && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(30, 27, 75, 0.6)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-white rounded-[32px] p-7 w-full max-w-[340px] shadow-2xl"
            >
              <h2 className="text-2xl font-extrabold text-center mb-1">
                <span className="text-gradient">Modo Padres</span>
              </h2>
              <p className="text-text-muted text-center text-sm font-semibold mb-5">Ingresa el PIN para continuar</p>
              <form onSubmit={handlePinSubmit}>
                <input
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="••••"
                  className={`w-full p-4 rounded-2xl border-2 text-center text-xl font-black tracking-[6px] outline-none transition-all ${
                    pinError
                      ? 'border-red-300 bg-red-50 text-red-500'
                      : 'border-primary-light/40 bg-surface focus:border-primary focus:bg-white'
                  }`}
                  maxLength={4}
                  inputMode="numeric"
                  autoFocus
                />
                {pinError && <p className="text-red-500 text-sm font-bold text-center mt-2">PIN Incorrecto</p>}
                <div className="flex gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => { setShowPin(false); setPin(''); setPinError(false); }}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-text-muted bg-gray-100 active:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl font-bold text-white active:scale-95 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                      boxShadow: '0 4px 16px rgba(124, 58, 237, 0.35)',
                    }}
                  >
                    Entrar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
