import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSpeech } from '../hooks/useSpeech';
import { useSounds, fireConfetti } from '../hooks/useSounds';
import { getRoutinesWithCustom, shouldShowTask } from '../data/rutinas';
import Timer from '../components/Timer';
import type { RoutineTask } from '../types';

export default function MiMapa() {
  const navigate = useNavigate();
  const customTasks = useStore(state => state.customTasks);
  const completeTask = useStore(state => state.completeTask);
  const isTaskCompleted = useStore(state => state.isTaskCompleted);
  const addPoints = useStore(state => state.addPoints);
  const { speak } = useSpeech();
  const { playSuccess, playClick, ensureAudio } = useSounds();

  const routines = getRoutinesWithCustom(customTasks);
  const [activeRoutine, setActiveRoutine] = useState<string>('manana');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleBack = () => {
    playClick();
    navigate('/');
  };

  const handleTabClick = (rid: string, name: string) => {
    ensureAudio();
    playClick();
    setActiveRoutine(rid);
    setActiveTaskId(null);
    speak(`Rutina de ${name.replace(/[^\w\sáéíóúñ]/gi, '')}`);
  };

  const handleTaskClick = (task: RoutineTask) => {
    ensureAudio();
    playClick();
    setActiveTaskId(task.id);
    speak(`Vamos a ${task.name}. Tienes ${task.minutes} minutos.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTimerComplete = (task: RoutineTask | null, allTasks: RoutineTask[]) => {
    playSuccess();
    fireConfetti();
    addPoints(10);

    if (task) {
      completeTask(activeRoutine, task.id);
      const allDone = allTasks.every(t => isTaskCompleted(activeRoutine, t.id) || t.id === task.id);
      if (allDone) {
        addPoints(25);
        setTimeout(() => speak('¡Excelente! Terminaste toda la rutina.'), 1000);
      }
    }

    setActiveTaskId(null);
  };

  const routine = routines.find(r => r.id === activeRoutine);
  const tasks = routine ? routine.tasks.filter(shouldShowTask) : [];
  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <div className="flex flex-col gap-5 w-full min-w-0 max-w-full pb-20">
      {/* Header: min-w-0 + shrink on title so the row never overflows the viewport (body overflow-x hidden was clipping everything to the right) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 min-w-0 w-full"
      >
        <button type="button" onClick={handleBack} className="shrink-0 w-11 h-11 rounded-2xl bg-surface border border-white/40 flex items-center justify-center text-primary shadow-sm active:scale-90 transition-transform">
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="min-w-0 flex-1 text-xl sm:text-2xl font-extrabold text-gradient leading-tight [overflow-wrap:anywhere]">
          📋 Mi Mapa del Día
        </h1>
      </motion.div>

      {/* Tabs: full-width column — no side-by-side layout, nothing can be “half cut” at the screen edge */}
      <div className="flex flex-col gap-2 w-full min-w-0">
        {routines.map((r, i) => (
          <motion.button
            type="button"
            key={r.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleTabClick(r.id, r.name)}
            className={`w-full min-w-0 box-border text-center px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
              activeRoutine === r.id
                ? 'text-white shadow-lg'
                : 'bg-surface border border-white/40 text-text hover:bg-surface-hover'
            }`}
            style={activeRoutine === r.id ? {
              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
            } : undefined}
          >
            {r.name}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRoutine + (activeTaskId || '')}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {activeTask ? (
            <div className="glass rounded-[28px] p-6 flex flex-col items-center">
              <div className="text-6xl mb-3">{activeTask.icon}</div>
              <h2 className="text-2xl font-extrabold text-gradient mb-5">{activeTask.name}</h2>
              <Timer durationMinutes={activeTask.minutes} onComplete={() => handleTimerComplete(activeTask, tasks)} />
              <button
                onClick={() => setActiveTaskId(null)}
                className="mt-6 text-text-muted font-bold px-5 py-2.5 bg-gray-100 rounded-2xl active:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tasks.map((t, i) => {
                const done = isTaskCompleted(activeRoutine, t.id);
                return (
                  <motion.button
                    key={t.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => !done && handleTaskClick(t)}
                    disabled={done}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                      done
                        ? 'bg-white/30 opacity-50'
                        : 'glass bg-white/70 hover:bg-white/85 active:scale-[0.98]'
                    }`}
                  >
                    <span className="text-[42px] drop-shadow-sm">{t.icon}</span>
                    <div className="flex-1">
                      <div className={`text-lg font-extrabold ${done ? 'text-text-muted line-through' : 'text-text'}`}>
                        {t.name}
                      </div>
                      <div className="text-sm font-semibold text-text-muted">
                        {t.minutes} min {t.time && `· ${t.time}`}
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full border-[3px] flex items-center justify-center transition-all ${
                      done ? 'bg-success border-success text-white' : 'border-primary-light/30 text-transparent'
                    }`}>
                      <CheckCircle2 strokeWidth={3} size={20} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
