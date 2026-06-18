import type { Achievement, Priority, Task, UserStats } from './types';
import { achievementCatalog } from './data';

export const pointsByPriority: Record<Priority, number> = {
  low: 10,
  medium: 20,
  high: 35,
};

export const levelThreshold = 120;

export function createTaskPoints(task: Pick<Task, 'priority'>) {
  return pointsByPriority[task.priority];
}

export function getLevel(totalPoints: number) {
  const level = Math.floor(totalPoints / levelThreshold) + 1;
  const currentPoints = totalPoints % levelThreshold;
  const pointsToNextLevel = levelThreshold - currentPoints;

  return { level, currentPoints, pointsToNextLevel };
}

export function getStreak(tasks: Task[]) {
  const completedDates = tasks
    .filter((task) => task.completedAt)
    .map((task) => task.completedAt!.slice(0, 10));

  if (!completedDates.length) return 0;

  const uniqueDates = Array.from(new Set(completedDates)).sort().reverse();
  const today = new Date();
  const oneDay = 86400000;
  let streak = 0;

  for (let i = 0; i < uniqueDates.length; i += 1) {
    const expected = new Date(today.getTime() - streak * oneDay).toISOString().slice(0, 10);
    if (uniqueDates.includes(expected)) {
      streak += 1;
    } else if (streak === 0 && uniqueDates[0] === today.toISOString().slice(0, 10)) {
      streak = 1;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateStats(tasks: Task[]): UserStats {
  const completedTasks = tasks.filter((task) => task.completed);
  const totalPoints = completedTasks.reduce((sum, task) => sum + createTaskPoints(task), 0);
  const stats = getLevel(totalPoints);
  const completionRate = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return {
    level: stats.level,
    currentPoints: stats.currentPoints,
    pointsToNextLevel: stats.pointsToNextLevel,
    totalPoints,
    completedTasks: completedTasks.length,
    totalTasks: tasks.length,
    streak: getStreak(tasks),
    completionRate,
  };
}

export function buildAchievements(tasks: Task[], categories: string[]): Achievement[] {
  const completed = tasks.filter((task) => task.completed);
  const totalPoints = completed.reduce((sum, task) => sum + createTaskPoints(task), 0);
  const uniqueCategories = new Set(tasks.map((task) => task.category));
  const hasOverdueControl = tasks.filter((task) => task.completed || new Date(task.dueDate) >= new Date()).length;

  return achievementCatalog.map((achievement) => {
    switch (achievement.id) {
      case 'first-blood':
        return { ...achievement, unlocked: completed.length >= 1 };
      case 'combo-3':
        return { ...achievement, unlocked: completed.length >= 3 };
      case 'combo-10':
        return { ...achievement, unlocked: completed.length >= 10 };
      case 'points-100':
        return { ...achievement, unlocked: totalPoints >= 100 };
      case 'categories-5':
        return { ...achievement, unlocked: Math.max(uniqueCategories.size, categories.length) >= 5 };
      case 'due-master':
        return { ...achievement, unlocked: hasOverdueControl >= 5 };
      default:
        return { ...achievement, unlocked: false };
    }
  });
}

export function taskPriorityLabel(priority: Priority) {
  return priority === 'high' ? 'Alta' : priority === 'medium' ? 'Média' : 'Baixa';
}

export function taskPriorityClass(priority: Priority) {
  if (priority === 'high') return 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30';
  if (priority === 'medium') return 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30';
  return 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30';
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(value),
  );
}
