import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSpeech } from '../hooks/useSpeech';
import { useSounds, fireConfetti } from '../hooks/useSounds';
import { gameEmojis, patternSets, associateWords, classifyCategories, emojiNames } from '../data/juegos';
import type { GameType, ClassifyCategory } from '../types';

type FeedbackState = 'success' | 'wrong' | null;

interface CountingState {
  count: number;
  emoji: string;
  options: number[];
  instruction: string;
}

interface PatternGameState {
  pattern: string[];
  answer: string;
  options: string[];
  instruction: string;
}

interface AssociateGameState {
  emoji: string;
  word: string;
  options: string[];
  instruction: string;
}

interface ClassifyGameState {
  targetCat: ClassifyCategory;
  items: string[];
  found: number;
  disabledIdx: number[];
  instruction: string;
}

type GameState = CountingState | PatternGameState | AssociateGameState | ClassifyGameState;

export default function Retos() {
  const navigate = useNavigate();
  const { playClick, ensureAudio } = useSounds();
  const { speak } = useSpeech();
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);

  useEffect(() => {
    if (!currentGame) {
      speak('¡Elige un juego para empezar!');
    }
  }, [currentGame, speak]);

  const handleBack = () => {
    playClick();
    if (currentGame) setCurrentGame(null);
    else navigate('/');
  };

  const games: { id: GameType; icon: string; title: string; desc: string; color: string }[] = [
    { id: 'counting', icon: '🔢', title: 'Conteo', desc: 'Cuenta los objetos', color: '#7C3AED' },
    { id: 'patterns', icon: '🧠', title: 'Patrones', desc: 'Completa la secuencia', color: '#EC4899' },
    { id: 'associate', icon: '🔤', title: 'Asociación', desc: 'Imagen y palabra', color: '#06B6D4' },
    { id: 'classify', icon: '🎨', title: 'Clasificar', desc: 'Encuentra el grupo', color: '#F59E0B' },
  ];

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
        <h1 className="text-2xl font-extrabold text-gradient">
          {currentGame ? 'Juego en curso' : '🧩 Micro-Retos'}
        </h1>
      </motion.div>

      <AnimatePresence mode="wait">
        {!currentGame ? (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
            {games.map((g, i) => (
              <motion.button
                key={g.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => { ensureAudio(); playClick(); setCurrentGame(g.id); }}
                className="flex items-center gap-4 p-5 rounded-2xl glass bg-white/70 hover:bg-white/85 text-left active:scale-[0.98] transition-all"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: `${g.color}15` }}
                >
                  {g.icon}
                </div>
                <div>
                  <div className="text-lg font-extrabold text-text">{g.title}</div>
                  <div className="text-sm font-semibold text-text-muted">{g.desc}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div key="game" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <GamePlay gameType={currentGame} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GamePlay({ gameType }: { gameType: GameType }) {
  const gameLevel = useStore(state => state.gameLevel);
  const adjustDifficulty = useStore(state => state.adjustDifficulty);
  const addPoints = useStore(state => state.addPoints);
  const level = gameLevel[gameType] || 1;
  const { speak } = useSpeech();
  const { playSuccess, playWrong, playClick } = useSounds();

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const initGame = useCallback(() => {
    setFeedback(null);
    let state: GameState;

    if (gameType === 'counting') {
      const maxCount = level <= 2 ? 5 : level <= 4 ? 10 : 15;
      const count = Math.floor(Math.random() * maxCount) + 1;
      const emojiSets = Object.values(gameEmojis);
      const emojiSet = emojiSets[Math.floor(Math.random() * emojiSets.length)];
      state = {
        count,
        emoji: emojiSet[Math.floor(Math.random() * emojiSet.length)],
        options: generateOptions(count, maxCount),
        instruction: '¿Cuántos hay?'
      } as CountingState;
    } else if (gameType === 'patterns') {
      const pSet = patternSets[Math.floor(Math.random() * patternSets.length)];
      state = { ...pSet, options: shuffleArray([...pSet.options]), instruction: '¿Qué sigue?' } as PatternGameState;
    } else if (gameType === 'associate') {
      const item = associateWords[Math.floor(Math.random() * associateWords.length)];
      state = { ...item, options: shuffleArray([...item.options]), instruction: '¿Qué palabra es?' } as AssociateGameState;
    } else {
      const cats = shuffleArray([...classifyCategories]).slice(0, 2);
      const targetCat = cats[0];
      state = {
        targetCat,
        items: shuffleArray([...targetCat.items.slice(0, 3), ...cats[1].items.slice(0, 3)]),
        found: 0,
        disabledIdx: [],
        instruction: `Toca ${targetCat.article} ${targetCat.name}`
      } as ClassifyGameState;
    }
    setGameState(state);
    speak(state.instruction);
  }, [gameType, level]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const triggerWin = () => {
    playSuccess();
    fireConfetti();
    addPoints(20);
    adjustDifficulty(gameType, true);
    setFeedback('success');
    speak('¡Muy bien!');
    setTimeout(() => initGame(), 2000);
  };

  const handleAnswer = (val: string | number, idx: number) => {
    if (feedback === 'success' || !gameState) return;

    if (gameType === 'classify') {
      const gs = gameState as ClassifyGameState;
      if (gs.disabledIdx.includes(idx)) return;
    }

    let isCorrect = false;
    if (gameType === 'counting') isCorrect = val === (gameState as CountingState).count;
    else if (gameType === 'patterns') isCorrect = val === (gameState as PatternGameState).answer;
    else if (gameType === 'associate') isCorrect = val === (gameState as AssociateGameState).word;
    else if (gameType === 'classify') isCorrect = (gameState as ClassifyGameState).targetCat.items.includes(val as string);

    if (isCorrect) {
      if (gameType === 'classify') {
        const gs = gameState as ClassifyGameState;
        const newFound = gs.found + 1;
        setGameState({ ...gs, found: newFound, disabledIdx: [...gs.disabledIdx, idx] });
        speak(emojiNames[val as string] ?? (val as string));
        playClick();
        if (newFound >= 3) {
          triggerWin();
        }
      } else {
        triggerWin();
      }
    } else {
      playWrong();
      adjustDifficulty(gameType, false);
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (!gameState) return null;

  const isCounting = gameType === 'counting';
  const isPatterns = gameType === 'patterns';
  const isAssociate = gameType === 'associate';
  const isClassify = gameType === 'classify';

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-surface border border-white/40 p-3 rounded-2xl">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map(l => (
            <div
              key={l}
              className={`w-2.5 h-2.5 rounded-full transition-all ${l <= level ? 'scale-110' : 'opacity-30'}`}
              style={l <= level ? {
                background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                boxShadow: '0 0 6px rgba(124, 58, 237, 0.3)',
              } : { background: '#D4D4D8' }}
            />
          ))}
        </div>
        <button
          onClick={() => speak(gameState.instruction)}
          className="flex items-center gap-1.5 text-primary font-bold text-sm"
        >
          <Volume2 size={16} /> Repetir
        </button>
      </div>

      <div className="glass rounded-[28px] p-6 min-h-[300px] flex flex-col items-center justify-center gap-8">
        <h2 className="text-2xl font-extrabold text-center text-text">
          {gameState.instruction}
        </h2>

        {/* Game display */}
        <div className="flex flex-wrap justify-center gap-2">
          {isCounting && Array.from({ length: (gameState as CountingState).count }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="text-5xl drop-shadow-sm"
            >
              {(gameState as CountingState).emoji}
            </motion.span>
          ))}
          {isPatterns && (gameState as PatternGameState).pattern.map((p, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="text-5xl drop-shadow-sm"
            >
              {p}
            </motion.span>
          ))}
          {isPatterns && <span className="text-5xl opacity-30">❓</span>}
          {isAssociate && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="text-[80px] drop-shadow-md"
            >
              {(gameState as AssociateGameState).emoji}
            </motion.span>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-wrap justify-center gap-3 w-full">
          {(isClassify
            ? (gameState as ClassifyGameState).items
            : (isCounting ? (gameState as CountingState).options : (gameState as PatternGameState).options)
          ).map((opt, i) => {
            const val = isCounting ? opt : opt as string;
            const isDisabled = isClassify && (gameState as ClassifyGameState).disabledIdx.includes(i);
            return (
              <motion.button
                key={i}
                whileTap={!isDisabled ? { scale: 0.92 } : undefined}
                onClick={() => handleAnswer(val, i)}
                className={`flex items-center justify-center font-extrabold transition-all
                  ${isAssociate ? 'w-full text-xl py-4 rounded-2xl' : 'text-4xl min-w-[72px] min-h-[72px] p-4 rounded-2xl'}
                  ${isDisabled ? 'text-white shadow-none scale-95' : 'bg-white shadow-sm border-2 border-primary-light/20 active:bg-primary-light/10'}
                  ${feedback === 'success' && !isDisabled ? 'opacity-40' : ''}
                `}
                style={isDisabled ? {
                  background: 'linear-gradient(135deg, #10B981, #34D399)',
                } : undefined}
              >
                {val}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function generateOptions(correct: number, max: number): number[] {
  const opts = new Set([correct]);
  while (opts.size < 3) {
    const n = Math.floor(Math.random() * max) + 1;
    if (n !== correct) opts.add(n);
  }
  return shuffleArray([...opts]);
}

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
