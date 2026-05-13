import type { Routine, RoutineTask, CustomTask } from '../types';

export const defaultRoutines: Routine[] = [
  {
    id: 'manana',
    name: '🌅 Mañana',
    icon: '🌅',
    tasks: [
      { id: 'm1', icon: '🛏️', name: 'Levantarse', minutes: 5 },
      { id: 'm2', icon: '🚿', name: 'Ducharse', minutes: 10 },
      { id: 'm3', icon: '👗', name: 'Vestirse', minutes: 10 },
      { id: 'm4', icon: '🥣', name: 'Desayunar', minutes: 15 },
      { id: 'm5', icon: '🎒', name: 'Preparar mochila', minutes: 5 },
    ]
  },
  {
    id: 'tarde',
    name: '🌞 Tarde',
    icon: '🌞',
    tasks: [
      { id: 't1', icon: '🍽️', name: 'Almorzar', minutes: 20 },
      { id: 't2', icon: '📚', name: 'Hacer tareas', minutes: 20 },
      { id: 't3', icon: '🎮', name: 'Jugar', minutes: 30 },
      { id: 't4', icon: '🥋', name: 'Karate', minutes: 60, days: [2, 4], time: '19:00' },
    ]
  },
  {
    id: 'noche',
    name: '🌙 Noche',
    icon: '🌙',
    tasks: [
      { id: 'n1', icon: '🍽️', name: 'Cenar', minutes: 20 },
      { id: 'n2', icon: '🪥', name: 'Cepillar dientes', minutes: 3 },
      { id: 'n3', icon: '📖', name: 'Leer un cuento', minutes: 15 },
      { id: 'n4', icon: '😴', name: 'Dormir', minutes: 5 },
    ]
  }
];

export function getRoutinesWithCustom(customTasks: CustomTask[]): Routine[] {
  const routines: Routine[] = JSON.parse(JSON.stringify(defaultRoutines));
  for (const ct of customTasks) {
    const routine = routines.find(r => r.id === ct.routineId);
    if (routine) {
      routine.tasks.push({
        id: ct.id,
        icon: ct.icon,
        name: ct.name,
        minutes: ct.minutes,
        days: ct.days,
        time: ct.time,
      });
    }
  }
  return routines;
}

export function shouldShowTask(task: RoutineTask): boolean {
  if (!task.days) return true;
  const today = new Date().getDay();
  return task.days.includes(today);
}
