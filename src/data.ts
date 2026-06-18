import type { Achievement, Task } from './types';

export const defaultCategories = ['Produto', 'Design', 'Marketing', 'Estudo'];

export const defaultTasks: Task[] = [
  {
    id: 'seed-1',
    title: 'Finalizar landing page do projeto',
    description: 'Polir hero, métricas e CTA com visual SaaS.',
    priority: 'high',
    category: 'Produto',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Organizar backlog de funcionalidades',
    description: 'Separar tarefas em épicos e prioridades.',
    priority: 'medium',
    category: 'Estudo',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 10),
    completed: true,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    title: 'Criar sistema de badges',
    description: 'Recompensas para consistência e produtividade.',
    priority: 'low',
    category: 'Design',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const achievementCatalog: Omit<Achievement, 'unlocked'>[] = [
  {
    id: 'first-blood',
    title: 'Primeira Vitória',
    description: 'Conclua a primeira tarefa.',
    icon: '⭐',
  },
  {
    id: 'combo-3',
    title: 'Ritmo de Trabalho',
    description: 'Complete 3 tarefas.',
    icon: '🔥',
  },
  {
    id: 'combo-10',
    title: 'Máquina de Execução',
    description: 'Complete 10 tarefas.',
    icon: '🏅',
  },
  {
    id: 'points-100',
    title: 'Cento e Pouco',
    description: 'Acumule 100 pontos.',
    icon: '💎',
  },
  {
    id: 'categories-5',
    title: 'Mentor Multitópico',
    description: 'Use 5 categorias diferentes.',
    icon: '🧭',
  },
  {
    id: 'due-master',
    title: 'No Prazo',
    description: 'Mantenha 5 tarefas vencidas sob controle.',
    icon: '⏱️',
  },
];
