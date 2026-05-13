import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, Volume2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSpeech, useSpeechRecognition, compareWords } from '../hooks/useSpeech';
import { useSounds, fireConfetti } from '../hooks/useSounds';
import { aacCategories, phonemeLevels } from '../data/fonemas';
import { syllableWords } from '../data/silabas';
import type { AACCategory, PhonemeItem, SyllableWord } from '../types';

type Section = 'aac' | 'fonemas' | 'silabas';
type FeedbackType = 'success' | 'retry' | 'info' | '';

export default function Habla() {
  const navigate = useNavigate();
  const { playClick, ensureAudio } = useSounds();
  const [section, setSection] = useState<Section>('aac');

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
        <h1 className="text-2xl font-extrabold text-gradient">🗣️ Habla Aventuras</h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-2xl bg-surface border border-white/40">
        {(['aac', 'fonemas', 'silabas'] as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => { ensureAudio(); playClick(); setSection(s); }}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              section === s ? 'text-white shadow-md' : 'text-text-muted hover:text-text'
            }`}
            style={section === s ? {
              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
              boxShadow: '0 2px 12px rgba(124, 58, 237, 0.25)',
            } : undefined}
          >
            {s === 'aac' ? '💬 Comunicador' : s === 'fonemas' ? '🎤 Fonemas' : '🧩 Sílabas'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {section === 'aac' ? <AACBoard /> : section === 'fonemas' ? <PhonemesGame /> : <SyllablesGame />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AACBoard() {
  const [activeCat, setActiveCat] = useState<string>('needs');
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const { speak } = useSpeech();
  const { playClick, ensureAudio } = useSounds();

  const category = aacCategories.find(c => c.id === activeCat) as AACCategory;

  const handleSpeak = (text: string, idx: number) => {
    ensureAudio();
    setSpeakingIdx(idx);
    speak(text, 0.85).then(() => setSpeakingIdx(null));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {aacCategories.map(c => (
          <button
            key={c.id}
            onClick={() => { playClick(); setActiveCat(c.id); }}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
              activeCat === c.id
                ? 'text-white shadow-md'
                : 'bg-surface border border-white/40 text-text hover:bg-surface-hover'
            }`}
            style={activeCat === c.id ? {
              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
              boxShadow: '0 2px 10px rgba(124, 58, 237, 0.25)',
            } : undefined}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {category.items.map((item, i) => (
          <motion.button
            key={item.text}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleSpeak(item.text, i)}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all shadow-sm ${
              speakingIdx === i
                ? 'text-white scale-105'
                : 'glass bg-white hover:bg-white/85 text-text'
            }`}
            style={{
              minHeight: '110px',
              ...(speakingIdx === i ? {
                background: 'linear-gradient(135deg, #EC4899 0%, #F9A8D4 100%)',
                boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)',
              } : {})
            }}
          >
            <span className="text-4xl">{item.icon}</span>
            <span className="text-xs font-bold text-center leading-tight">{item.text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function PhonemesGame() {
  const phonemeLevel = useStore(state => state.phonemeLevel);
  const setPhonemeLevel = useStore(state => state.setPhonemeLevel);
  const addPoints = useStore(state => state.addPoints);
  const { speak } = useSpeech();
  const { playSuccess, playClick, ensureAudio } = useSounds();
  const { listen, isRecording, hasSupport } = useSpeechRecognition();

  const [item, setItem] = useState<PhonemeItem | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: FeedbackType }>({ text: '', type: '' });

  const levelData = phonemeLevels.find(l => l.level === phonemeLevel) ?? phonemeLevels[0];

  const pickRandom = () => {
    const nextItem = levelData.items[Math.floor(Math.random() * levelData.items.length)];
    setItem(nextItem);
    setFeedback({ text: '', type: '' });
  };

  useEffect(() => {
    pickRandom();
  }, [phonemeLevel]);

  const handleHear = () => {
    ensureAudio();
    if (item) speak(item.word, 0.7);
  };

  const handleRecord = async () => {
    if (!item) return;
    ensureAudio();
    setFeedback({ text: '🎧 Escuchando...', type: 'info' });
    try {
      const results = await listen();
      const match = compareWords(results, item.word);

      if (match === 'exact' || match === 'close') {
        setFeedback({ text: '🌟 ¡Excelente!', type: 'success' });
        playSuccess();
        fireConfetti();
        addPoints(15);
        if (match === 'exact' && phonemeLevel < 3) {
          setPhonemeLevel(phonemeLevel + 1);
        }
      } else {
        setFeedback({ text: '💪 ¡Casi! Intentemos de nuevo', type: 'retry' });
        setTimeout(() => speak(item.word, 0.6), 1000);
      }
    } catch {
      setFeedback({ text: '🔄 Intenta de nuevo', type: 'retry' });
    }
  };

  if (!item) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Level indicator */}
      <div className="flex items-center gap-2 text-sm font-bold text-text-muted bg-surface border border-white/40 p-3 rounded-2xl">
        <span>Nivel</span>
        <div className="flex gap-1.5">
          {phonemeLevels.map(l => (
            <div
              key={l.level}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                l.level <= phonemeLevel ? 'scale-110' : 'opacity-30'
              }`}
              style={l.level <= phonemeLevel ? {
                background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                boxShadow: '0 0 6px rgba(124, 58, 237, 0.3)',
              } : { background: '#D4D4D8' }}
            />
          ))}
        </div>
        <span className="ml-1 font-extrabold text-text">{levelData.name}</span>
      </div>

      <div className="glass rounded-[28px] p-8 flex flex-col items-center text-center gap-6">
        <motion.div
          key={item.emoji}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[80px] drop-shadow-md"
        >
          {item.emoji}
        </motion.div>
        <motion.div
          key={item.display}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-black text-gradient tracking-wide"
        >
          {item.display}
        </motion.div>

        <button
          onClick={handleHear}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white shadow-md active:scale-95 transition-all"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
          }}
        >
          <Volume2 size={18} /> Escuchar
        </button>

        {hasSupport ? (
          <div className="flex flex-col items-center gap-3 mt-2">
            <button
              onClick={handleRecord}
              disabled={isRecording}
              className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-95 ${
                isRecording ? 'pulse-ring' : ''
              }`}
              style={{
                background: isRecording
                  ? 'linear-gradient(135deg, #EF4444, #F87171)'
                  : 'linear-gradient(135deg, #EC4899, #F472B6)',
                boxShadow: isRecording
                  ? '0 0 0 0 rgba(239, 68, 68, 0.5)'
                  : '0 8px 24px rgba(236, 72, 153, 0.35)',
              }}
            >
              <Mic size={32} fill="currentColor" />
            </button>
            <div className={`text-xl font-extrabold h-8 ${
              feedback.type === 'success' ? 'text-success' :
              feedback.type === 'retry' ? 'text-warning' : 'text-text'
            }`}>
              {feedback.text}
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-muted font-semibold mt-2">
            El micrófono no está disponible en este navegador.
          </p>
        )}

        <button
          onClick={() => { playClick(); pickRandom(); }}
          className="mt-2 text-primary font-bold px-6 py-3 rounded-2xl bg-surface border border-primary-light/30 active:bg-primary-light/10 transition-colors"
        >
          Siguiente palabra →
        </button>
      </div>
    </div>
  );
}

function SyllablesGame() {
  const addPoints = useStore(state => state.addPoints);
  const { speak } = useSpeech();
  const { playSuccess, playClick, playWrong, ensureAudio } = useSounds();

  const [wordData, setWordData] = useState<SyllableWord | null>(null);
  const [shuffledSilabas, setShuffledSilabas] = useState<string[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; type: string }>({ text: '', type: '' });

  const initGame = () => {
    setFeedback({ text: '', type: '' });
    const w = syllableWords[Math.floor(Math.random() * syllableWords.length)];
    setWordData(w);
    setShuffledSilabas(shuffleArray([...w.syllables]));
    setPicked([]);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleSilabaClick = (idx: number) => {
    if (picked.includes(idx) || !wordData) return;
    ensureAudio();
    playClick();

    const newPicked = [...picked, idx];
    setPicked(newPicked);
    speak(shuffledSilabas[idx].toLowerCase());

    if (newPicked.length === wordData.syllables.length) {
      const composed = newPicked.map(i => shuffledSilabas[i]).join('');
      if (composed === wordData.word) {
        setFeedback({ text: '🌟 ¡Excelente!', type: 'success' });
        playSuccess();
        fireConfetti();
        addPoints(15);
        speak(wordData.word.toLowerCase());
        setTimeout(() => initGame(), 2500);
      } else {
        setFeedback({ text: '💪 Casi... intenta de nuevo', type: 'retry' });
        playWrong();
        setTimeout(() => {
          setPicked([]);
          setFeedback({ text: '', type: '' });
        }, 1500);
      }
    }
  };

  if (!wordData) return null;

  const composedSoFar = picked.map(i => shuffledSilabas[i]).join('');

  return (
    <div className="flex flex-col gap-4">
      <div className="glass rounded-[28px] p-6 flex flex-col items-center text-center gap-6">
        <div className="text-7xl drop-shadow-md">{wordData.emoji}</div>
        <h3 className="text-xl font-extrabold text-gradient">Forma la palabra</h3>

        <div className="flex flex-wrap justify-center gap-3 min-h-[60px]">
          {Array.from({ length: wordData.syllables.length }).map((_, i) => (
            <div
              key={i}
              className={`w-16 h-16 rounded-2xl border-[3px] flex items-center justify-center text-2xl font-black transition-all ${
                i < picked.length
                  ? 'bg-success/10 border-success text-success shadow-sm'
                  : 'border-primary-light/20 bg-white/30'
              }`}
            >
              {i < picked.length ? shuffledSilabas[picked[i]] : '?'}
            </div>
          ))}
        </div>

        {composedSoFar && (
          <p className="text-2xl font-extrabold text-text tracking-widest">{composedSoFar}</p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {shuffledSilabas.map((sil, i) => {
            const used = picked.includes(i);
            return (
              <motion.button
                key={i}
                whileTap={!used ? { scale: 0.92 } : undefined}
                onClick={() => handleSilabaClick(i)}
                disabled={used}
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black transition-all ${
                  used
                    ? 'bg-gray-100 text-gray-300 scale-90'
                    : 'bg-white shadow-md border-2 border-primary-light/20 active:bg-primary-light/10 text-text'
                }`}
              >
                {sil}
              </motion.button>
            );
          })}
        </div>

        <div className={`text-xl font-extrabold h-8 ${
          feedback.type === 'success' ? 'text-success' :
          feedback.type === 'retry' ? 'text-warning' : 'text-transparent'
        }`}>
          {feedback.text}
        </div>

        <button
          onClick={() => { playClick(); initGame(); }}
          className="text-primary font-bold px-6 py-3 rounded-2xl bg-surface border border-primary-light/30 active:bg-primary-light/10 transition-colors"
        >
          Siguiente palabra →
        </button>
      </div>
    </div>
  );
}

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
