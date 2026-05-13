export interface Accessory {
  id: string;
  name: string;
  emoji: string;
  price: number;
}

export interface PhonemeItem {
  word: string;
  emoji: string;
  display: string;
}

export interface PhonemeLevel {
  level: number;
  name: string;
  items: PhonemeItem[];
}

export interface AACItem {
  icon: string;
  text: string;
}

export interface AACCategory {
  id: string;
  name: string;
  items: AACItem[];
}

export interface RoutineTask {
  id: string;
  icon: string;
  name: string;
  minutes: number;
  days?: number[];
  time?: string;
}

export interface Routine {
  id: string;
  name: string;
  icon: string;
  tasks: RoutineTask[];
}

export interface CustomTask extends RoutineTask {
  routineId: string;
}

export type GameType = 'counting' | 'patterns' | 'associate' | 'classify';

export interface PatternSet {
  pattern: string[];
  answer: string;
  options: string[];
}

export interface AssociateWord {
  emoji: string;
  word: string;
  options: string[];
}

export interface ClassifyCategory {
  name: string;
  article: string;
  emoji: string;
  items: string[];
}

export interface SyllableWord {
  word: string;
  syllables: string[];
  emoji: string;
}

export interface GameLevels {
  counting: number;
  classify: number;
  patterns: number;
  associate: number;
}

export interface SamyStore {
  points: number;
  streak: number;
  lastActiveDate: string | null;
  ownedAccessories: string[];
  equippedAccessory: string | null;
  completedTasks: Record<string, string[]>;
  customTasks: CustomTask[];
  phonemeLevel: number;
  gameLevel: GameLevels;
  consecutiveCorrect: GameLevels;
  consecutiveWrong: GameLevels;

  addPoints: (n: number) => void;
  spendPoints: (n: number) => boolean;
  completeTask: (routineId: string, taskId: string) => void;
  isTaskCompleted: (routineId: string, taskId: string) => boolean;
  getCompletedCount: () => number;
  buyAccessory: (id: string) => void;
  equipAccessory: (id: string | null) => void;
  addCustomTask: (task: Omit<CustomTask, 'id'>) => void;
  removeCustomTask: (id: string) => void;
  adjustDifficulty: (game: GameType, correct: boolean) => void;
  setPhonemeLevel: (level: number) => void;
  checkStreak: () => void;
  verifyPin: (pin: string) => boolean;
  resetStore: () => void;
}
