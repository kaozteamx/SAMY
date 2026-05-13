import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { defaultRoutines } from '../data/rutinas';
import { accessories } from '../data/accesorios';
import { useSounds, fireConfetti } from '../hooks/useSounds';
import Mascot from '../components/Mascot';
import type { Accessory } from '../types';

type ConfigSection = 'tasks' | 'store' | 'stats';

export default function Config() {
  const navigate = useNavigate();
  const { playClick } = useSounds();
  const [section, setSection] = useState<ConfigSection>('tasks');

  const handleBack = () => {
    playClick();
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-5 w-full pb-20">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button onClick={handleBack} className="w-11 h-11 rounded-2xl bg-surface border border-white/40 flex items-center justify-center text-primary shadow-sm active:scale-90 transition-transform">
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
        <h1 className="text-2xl font-extrabold text-gradient">⚙️ Modo Padres</h1>
      </motion.div>

      <div className="flex gap-2 p-1 rounded-2xl bg-surface border border-white/40">
        {(['tasks', 'store', 'stats'] as ConfigSection[]).map(s => (
          <button
            key={s}
            onClick={() => { playClick(); setSection(s); }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all capitalize ${
              section === s ? 'text-white shadow-md' : 'text-text-muted hover:text-text'
            }`}
            style={section === s ? {
              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
              boxShadow: '0 2px 12px rgba(124, 58, 237, 0.25)',
            } : undefined}
          >
            {s === 'tasks' ? 'Tareas' : s === 'store' ? 'Tienda' : 'Stats'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {section === 'tasks' && <TasksConfig />}
          {section === 'store' && <StoreConfig />}
          {section === 'stats' && <StatsConfig />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface TaskForm {
  routineId: string;
  icon: string;
  name: string;
  minutes: string;
}

function TasksConfig() {
  const customTasks = useStore(state => state.customTasks);
  const addCustomTask = useStore(state => state.addCustomTask);
  const removeCustomTask = useStore(state => state.removeCustomTask);
  const { playSuccess } = useSounds();
  const [form, setForm] = useState<TaskForm>({ routineId: 'manana', icon: '', name: '', minutes: '' });

  const handleAdd = () => {
    if (!form.name || !form.minutes) return;
    addCustomTask({ ...form, icon: form.icon || '📌', minutes: parseInt(form.minutes), routineId: form.routineId });
    setForm({ routineId: 'manana', icon: '', name: '', minutes: '' });
    playSuccess();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="glass rounded-[28px] p-6">
        <h3 className="text-lg font-extrabold text-gradient mb-4">Agregar Tarea Especial</h3>
        <div className="flex flex-col gap-3">
          <select
            value={form.routineId} onChange={e => setForm({ ...form, routineId: e.target.value })}
            className="p-3 rounded-2xl border-2 border-primary-light/20 bg-surface outline-none font-bold text-text"
          >
            {defaultRoutines.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <div className="flex gap-2">
            <input
              placeholder="🧸" maxLength={2} value={form.icon}
              onChange={e => setForm({ ...form, icon: e.target.value })}
              className="p-3 w-16 text-center rounded-2xl border-2 border-primary-light/20 bg-surface outline-none text-xl"
            />
            <input
              placeholder="Nombre de tarea" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="p-3 flex-1 rounded-2xl border-2 border-primary-light/20 bg-surface outline-none font-semibold"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number" placeholder="Minutos" value={form.minutes}
              onChange={e => setForm({ ...form, minutes: e.target.value })}
              className="p-3 flex-1 rounded-2xl border-2 border-primary-light/20 bg-surface outline-none font-semibold"
            />
            <button
              onClick={handleAdd}
              className="flex items-center justify-center px-6 text-white font-bold rounded-2xl active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
              }}
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      <div className="glass rounded-[28px] p-6">
        <h3 className="text-lg font-extrabold text-gradient mb-4">Tareas Personalizadas</h3>
        {customTasks.length === 0 ? (
          <p className="text-text-muted font-semibold text-center py-4">No hay tareas agregadas.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {customTasks.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-white/60 rounded-2xl">
                <span className="font-bold text-text">{t.icon} {t.name} <span className="text-text-muted text-sm">({t.minutes}m)</span></span>
                <button onClick={() => removeCustomTask(t.id)} className="w-10 h-10 bg-red-50 text-danger rounded-xl flex items-center justify-center active:scale-90 transition-transform">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StoreConfig() {
  const points = useStore(state => state.points);
  const ownedAccessories = useStore(state => state.ownedAccessories);
  const equippedAccessory = useStore(state => state.equippedAccessory);
  const buyAccessory = useStore(state => state.buyAccessory);
  const equipAccessory = useStore(state => state.equipAccessory);
  const spendPoints = useStore(state => state.spendPoints);
  const { playSuccess, playClick } = useSounds();

  const handleBuy = (acc: Accessory) => {
    if (spendPoints(acc.price)) {
      buyAccessory(acc.id);
      equipAccessory(acc.id);
      playSuccess();
      fireConfetti();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="glass rounded-[28px] p-4 text-center">
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-extrabold text-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.04))',
            color: '#D97706',
          }}
        >
          ⭐ {points} estrellas
        </div>
      </div>
      <Mascot size={150} />

      <div className="grid grid-cols-2 gap-3">
        {accessories.map(acc => {
          const owned = ownedAccessories.includes(acc.id);
          const equipped = equippedAccessory === acc.id;
          return (
            <div
              key={acc.id}
              className={`glass rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-all ${
                equipped ? 'ring-[3px] ring-success/50' : ''
              } ${owned && !equipped ? 'opacity-70' : ''}`}
            >
              <span className="text-4xl">{acc.emoji}</span>
              <span className="font-extrabold text-sm leading-tight text-text">{acc.name}</span>
              <span className={`text-xs font-bold ${owned ? 'text-text-muted' : ''}`}
                style={!owned ? { color: '#D97706' } : undefined}
              >
                {owned ? (equipped ? 'Equipado' : 'Comprado') : `⭐ ${acc.price}`}
              </span>

              {owned ? (
                equipped ? (
                  <button
                    onClick={() => { playClick(); equipAccessory(null); }}
                    className="mt-auto px-4 py-2 text-xs font-bold bg-gray-100 text-text-muted rounded-xl w-full active:bg-gray-200"
                  >
                    Quitar
                  </button>
                ) : (
                  <button
                    onClick={() => { playClick(); equipAccessory(acc.id); }}
                    className="mt-auto px-4 py-2 text-xs font-bold text-white rounded-xl w-full active:scale-95 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #10B981, #34D399)',
                    }}
                  >
                    Equipar
                  </button>
                )
              ) : (
                <button
                  onClick={() => handleBuy(acc)}
                  disabled={points < acc.price}
                  className={`mt-auto px-4 py-2 text-xs font-bold text-white rounded-xl w-full transition-all ${
                    points >= acc.price ? 'active:scale-95' : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={points >= acc.price ? {
                    background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                  } : { background: '#D4D4D8' }}
                >
                  Comprar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatsConfig() {
  const store = useStore();
  const [showReset, setShowReset] = useState(false);

  const stats = [
    { label: 'Puntos totales', val: `⭐ ${store.points}`, color: '#F59E0B' },
    { label: 'Racha actual', val: `🔥 ${store.streak} días`, color: '#EF4444' },
    { label: 'Tareas hoy', val: `✅ ${store.getCompletedCount()}`, color: '#10B981' },
    { label: 'Nivel Fonemas', val: `🎤 Nv ${store.phonemeLevel}`, color: '#7C3AED' },
    { label: 'Nivel Conteo', val: `🔢 Nv ${store.gameLevel.counting}`, color: '#7C3AED' },
    { label: 'Nivel Patrones', val: `🧠 Nv ${store.gameLevel.patterns}`, color: '#EC4899' },
    { label: 'Nivel Asociación', val: `🔤 Nv ${store.gameLevel.associate}`, color: '#06B6D4' },
    { label: 'Nivel Clasificar', val: `🎨 Nv ${store.gameLevel.classify}`, color: '#F59E0B' },
  ];

  return (
    <div className="glass rounded-[28px] p-6 flex flex-col gap-3">
      <h3 className="text-lg font-extrabold text-gradient mb-2">Estadísticas</h3>
      {stats.map((s, i) => (
        <div key={i} className="flex items-center justify-between p-3.5 bg-white/60 rounded-2xl font-semibold text-text">
          <span className="text-sm">{s.label}</span>
          <span className="font-extrabold text-text">{s.val}</span>
        </div>
      ))}
      {!showReset ? (
        <button
          onClick={() => setShowReset(true)}
          className="mt-6 p-3.5 bg-red-50 text-danger font-bold rounded-2xl active:bg-red-100 transition-colors"
        >
          Resetear Todos los Datos
        </button>
      ) : (
        <div className="mt-6 p-5 bg-red-50 rounded-2xl flex flex-col gap-3 items-center">
          <p className="text-danger font-extrabold text-center text-sm">
            ¿Estás segur@? Esto borrará todo el progreso de Samy.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => { store.resetStore(); setShowReset(false); }}
              className="flex-1 py-2.5 bg-danger text-white font-bold rounded-xl active:scale-95 transition-all"
            >
              Sí, borrar
            </button>
            <button
              onClick={() => setShowReset(false)}
              className="flex-1 py-2.5 bg-gray-200 text-text-muted font-bold rounded-xl active:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
