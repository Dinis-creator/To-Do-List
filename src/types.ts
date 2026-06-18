export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
};

export type UserStats = {
  level: number;
  currentPoints: number;
  pointsToNextLevel: number;
  totalPoints: number;
  completedTasks: number;
  totalTasks: number;
  streak: number;
  completionRate: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type AppState = {
  tasks: Task[];
  categories: string[];
  darkMode: boolean;
};
