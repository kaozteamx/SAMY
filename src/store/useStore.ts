import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SamyStore, CustomTask, GameType } from '../types';

const DEFAULT_PIN = '1234';

export const useStore = create<SamyStore>()(
  persist(
    (set, get) => ({
      points: 0,
      streak: 0,
      lastActiveDate: null,
      ownedAccessories: [],
      equippedAccessory: null,
      completedTasks: {},
      customTasks: [],
      phonemeLevel: 1,
      gameLevel: { counting: 1, classify: 1, patterns: 1, associate: 1 },
      consecutiveCorrect: { counting: 0, classify: 0, patterns: 0, associate: 0 },
      consecutiveWrong: { counting: 0, classify: 0, patterns: 0, associate: 0 },

      addPoints: (n: number) => set((state) => ({ points: state.points + n })),

      spendPoints: (n: number): boolean => {
        const { points } = get();
        if (points >= n) {
          set({ points: points - n });
          return true;
        }
        return false;
      },

      completeTask: (routineId: string, taskId: string) => {
        const today = new Date().toDateString();
        set((state) => {
          const completedToday = state.completedTasks[today] ?? [];
          const key = `${routineId}-${taskId}`;
          if (!completedToday.includes(key)) {
            return {
              completedTasks: {
                ...state.completedTasks,
                [today]: [...completedToday, key],
              },
            };
          }
          return state;
        });
      },

      isTaskCompleted: (routineId: string, taskId: string): boolean => {
        const today = new Date().toDateString();
        const key = `${routineId}-${taskId}`;
        return (get().completedTasks[today] ?? []).includes(key);
      },

      getCompletedCount: (): number => {
        const today = new Date().toDateString();
        return (get().completedTasks[today] ?? []).length;
      },

      buyAccessory: (id: string) => set((state) => ({
        ownedAccessories: state.ownedAccessories.includes(id)
          ? state.ownedAccessories
          : [...state.ownedAccessories, id]
      })),

      equipAccessory: (id: string | null) => set({ equippedAccessory: id }),

      addCustomTask: (task: Omit<CustomTask, 'id'>) => set((state) => ({
        customTasks: [...state.customTasks, { id: 'c_' + Date.now(), ...task }]
      })),

      removeCustomTask: (id: string) => set((state) => ({
        customTasks: state.customTasks.filter(t => t.id !== id)
      })),

      adjustDifficulty: (game: GameType, correct: boolean) => set((state) => {
        const prevCorrect = state.consecutiveCorrect[game];
        const prevWrong = state.consecutiveWrong[game];
        const newCorrect = correct ? prevCorrect + 1 : 0;
        const newWrong = !correct ? prevWrong + 1 : 0;

        let newLevel = state.gameLevel[game];
        if (newCorrect >= 3) {
          newLevel = Math.min(newLevel + 1, 5);
        } else if (newWrong >= 2) {
          newLevel = Math.max(newLevel - 1, 1);
        }

        return {
          consecutiveCorrect: { ...state.consecutiveCorrect, [game]: newCorrect >= 3 ? 0 : newCorrect },
          consecutiveWrong: { ...state.consecutiveWrong, [game]: newWrong >= 2 ? 0 : newWrong },
          gameLevel: { ...state.gameLevel, [game]: newLevel },
        };
      }),

      setPhonemeLevel: (level: number) => set({ phonemeLevel: level }),

      checkStreak: () => set((state) => {
        const today = new Date().toDateString();
        if (state.lastActiveDate === today) return state;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1;
        return { streak: newStreak, lastActiveDate: today };
      }),

      verifyPin: (pin: string): boolean => pin === DEFAULT_PIN,

      resetStore: () => set({
        points: 0, streak: 0, lastActiveDate: null, ownedAccessories: [], equippedAccessory: null,
        completedTasks: {}, customTasks: [], phonemeLevel: 1,
        gameLevel: { counting: 1, classify: 1, patterns: 1, associate: 1 },
        consecutiveCorrect: { counting: 0, classify: 0, patterns: 0, associate: 0 },
        consecutiveWrong: { counting: 0, classify: 0, patterns: 0, associate: 0 }
      }),
    }),
    {
      name: 'samy-storage',
    }
  )
);
