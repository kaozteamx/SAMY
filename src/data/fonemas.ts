import type { PhonemeLevel, AACCategory } from '../types';

export const phonemeLevels: PhonemeLevel[] = [
  {
    level: 1, name: 'Sílabas simples',
    items: [
      { word: 'ma', emoji: '👩', display: 'MA' },
      { word: 'pa', emoji: '👨', display: 'PA' },
      { word: 'ta', emoji: '👋', display: 'TA' },
      { word: 'sa', emoji: '💃', display: 'SA' },
      { word: 'la', emoji: '🎵', display: 'LA' },
      { word: 'no', emoji: '🙅', display: 'NO' },
      { word: 'si', emoji: '✅', display: 'SI' },
      { word: 'mi', emoji: '💗', display: 'MI' },
      { word: 'sol', emoji: '☀️', display: 'SOL' },
    ]
  },
  {
    level: 2, name: 'Palabras de 2 sílabas',
    items: [
      { word: 'mamá', emoji: '👩', display: 'MAMÁ' },
      { word: 'papá', emoji: '👨', display: 'PAPÁ' },
      { word: 'mesa', emoji: '🪑', display: 'MESA' },
      { word: 'casa', emoji: '🏠', display: 'CASA' },
      { word: 'gato', emoji: '🐱', display: 'GATO' },
      { word: 'luna', emoji: '🌙', display: 'LUNA' },
      { word: 'agua', emoji: '💧', display: 'AGUA' },
      { word: 'sopa', emoji: '🍜', display: 'SOPA' },
    ]
  },
  {
    level: 3, name: 'Palabras de 3+ sílabas',
    items: [
      { word: 'pelota', emoji: '⚽', display: 'PELOTA' },
      { word: 'zapato', emoji: '👟', display: 'ZAPATO' },
      { word: 'mariposa', emoji: '🦋', display: 'MARIPOSA' },
      { word: 'estrella', emoji: '⭐', display: 'ESTRELLA' },
      { word: 'conejo', emoji: '🐰', display: 'CONEJO' },
      { word: 'manzana', emoji: '🍎', display: 'MANZANA' },
      { word: 'helado', emoji: '🍦', display: 'HELADO' },
      { word: 'perrito', emoji: '🐶', display: 'PERRITO' },
    ]
  }
];

export const aacCategories: AACCategory[] = [
  {
    id: 'needs', name: '😋 Necesidades',
    items: [
      { icon: '💧', text: 'Tengo sed' },
      { icon: '🍽️', text: 'Tengo hambre' },
      { icon: '🚽', text: 'Quiero ir al baño' },
      { icon: '😴', text: 'Estoy cansada' },
      { icon: '🤒', text: 'Me duele' },
      { icon: '🤗', text: 'Quiero un abrazo' },
    ]
  },
  {
    id: 'emotions', name: '😊 Emociones',
    items: [
      { icon: '😊', text: 'Estoy feliz' },
      { icon: '😢', text: 'Estoy triste' },
      { icon: '😠', text: 'Estoy enojada' },
      { icon: '😨', text: 'Tengo miedo' },
      { icon: '🥱', text: 'Estoy aburrida' },
      { icon: '🥰', text: 'Te quiero' },
    ]
  },
  {
    id: 'actions', name: '🎮 Acciones',
    items: [
      { icon: '🎮', text: 'Quiero jugar' },
      { icon: '📺', text: 'Quiero ver tele' },
      { icon: '🏃', text: 'Quiero salir' },
      { icon: '🎵', text: 'Quiero música' },
      { icon: '🙋', text: 'Necesito ayuda' },
      { icon: '🛑', text: 'Para, por favor' },
    ]
  },
  {
    id: 'people', name: '👨‍👩‍👧 Personas',
    items: [
      { icon: '👩', text: 'Mamá' },
      { icon: '👨', text: 'Papá' },
      { icon: '👧', text: 'Hermana' },
      { icon: '👦', text: 'Hermano' },
      { icon: '👩‍🏫', text: 'Profesora' },
      { icon: '🧑‍🤝‍🧑', text: 'Amigo' },
    ]
  }
];
