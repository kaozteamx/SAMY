import type { PatternSet, AssociateWord, ClassifyCategory } from '../types';

export const gameEmojis: Record<string, string[]> = {
  fruits: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌', '🍑', '🍒'],
  animals: ['🐶', '🐱', '🐰', '🐻', '🐸', '🦊', '🐷', '🐮'],
  shapes: ['🔴', '🟡', '🔵', '🟢', '🟣', '🟠'],
  stars: ['⭐', '🌟', '✨', '💫'],
  flowers: ['🌸', '🌺', '🌻', '🌹', '🌷', '💐'],
};

export const classifyCategories: ClassifyCategory[] = [
  { name: 'Frutas', article: 'las', emoji: '🍎', items: ['🍎', '🍊', '🍌', '🍇', '🍓'] },
  { name: 'Animales', article: 'los', emoji: '🐶', items: ['🐶', '🐱', '🐰', '🐻', '🐸'] },
  { name: 'Flores', article: 'las', emoji: '🌸', items: ['🌸', '🌺', '🌻', '🌹', '🌷'] },
  { name: 'Comida', article: 'la', emoji: '🍕', items: ['🍕', '🍔', '🌮', '🍩', '🍰'] },
];

export const patternSets: PatternSet[] = [
  { pattern: ['🔴', '🔵', '🔴', '🔵'], answer: '🔴', options: ['🔴', '🟡', '🔵'] },
  { pattern: ['⭐', '⭐', '🌙', '⭐', '⭐'], answer: '🌙', options: ['⭐', '🌙', '☀️'] },
  { pattern: ['🐱', '🐶', '🐱', '🐶'], answer: '🐱', options: ['🐱', '🐰', '🐶'] },
  { pattern: ['🍎', '🍊', '🍎', '🍊'], answer: '🍎', options: ['🍎', '🍇', '🍊'] },
  { pattern: ['🔴', '🔴', '🔵', '🔴', '🔴'], answer: '🔵', options: ['🔴', '🟢', '🔵'] },
  { pattern: ['🌸', '🌸', '🌺', '🌸', '🌸'], answer: '🌺', options: ['🌸', '🌺', '🌻'] },
  { pattern: ['🟢', '🟢', '🔴', '🟢', '🟢'], answer: '🔴', options: ['🟢', '🟡', '🔴'] },
  { pattern: ['🟢', '🟡', '🔴', '🟢', '🟡'], answer: '🔴', options: ['🟢', '🟡', '🔴'] },
];

export const emojiNames: Record<string, string> = {
  '🍎': 'manzana', '🍊': 'naranja', '🍋': 'limón', '🍇': 'uva', '🍓': 'fresa',
  '🍌': 'plátano', '🍑': 'durazno', '🍒': 'cereza',
  '🐶': 'perro', '🐱': 'gato', '🐰': 'conejo', '🐻': 'oso', '🐸': 'rana',
  '🦊': 'zorro', '🐷': 'cerdo', '🐮': 'vaca',
  '🌸': 'flor', '🌺': 'hibisco', '🌻': 'girasol', '🌹': 'rosa', '🌷': 'tulipán', '💐': 'ramo',
  '🍕': 'pizza', '🍔': 'hamburguesa', '🌮': 'taco', '🍩': 'dona', '🍰': 'pastel',
};

export const associateWords: AssociateWord[] = [
  { emoji: '🐱', word: 'GATO', options: ['GATO', 'PERRO', 'OSO'] },
  { emoji: '🍎', word: 'MANZANA', options: ['PERA', 'MANZANA', 'UVA'] },
  { emoji: '☀️', word: 'SOL', options: ['LUNA', 'NUBE', 'SOL'] },
  { emoji: '🏠', word: 'CASA', options: ['CASA', 'MESA', 'SILLA'] },
  { emoji: '🌙', word: 'LUNA', options: ['SOL', 'LUNA', 'NUBE'] },
  { emoji: '💧', word: 'AGUA', options: ['AGUA', 'FUEGO', 'AIRE'] },
  { emoji: '🐶', word: 'PERRO', options: ['GATO', 'PERRO', 'RATÓN'] },
  { emoji: '🌺', word: 'FLOR', options: ['FLOR', 'HOJA', 'ÁRBOL'] },
  { emoji: '🍌', word: 'PLÁTANO', options: ['NARANJA', 'PLÁTANO', 'LIMÓN'] },
  { emoji: '⭐', word: 'ESTRELLA', options: ['ESTRELLA', 'LUNA', 'SOL'] },
];
