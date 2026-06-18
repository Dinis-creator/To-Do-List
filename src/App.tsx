import { useEffect, useMemo, useState } from 'react';
import { Achievement, AppState, Task } from './types';
import { defaultCategories, defaultTasks } from './data';
import { useLocalStorageState } from './hooks/useLocalStorage';
import { buildAchievements, calculateStats, createTaskPoints } from './utils';
import { MetricCard } from './components/MetricCard';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Charts } from './components/Charts';
import { Achievements } from './components/Achievements';

const initialState: AppState = {
  tasks: defaultTasks,
  categories: defaultCategories,
  darkMode: true,
};

export default function App() {
  const [storedState, setStoredState] = useLocalStorageState<AppState>('task-forge-state', initialState);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const stats = useMemo(() => calculateStats(storedState.tasks), [storedState.tasks]);
  const achievements = useMemo(
    () => buildAchievements(storedState.tasks, storedState.categories),
    [storedState.tasks, storedState.categories],
  );

  const filteredTasks = useMemo(() => {
    return storedState.tasks
      .filter((task) => {
        const matchesSearch = [task.title, task.description, task.category].join(' ').toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
        const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
        return matchesSearch && matchesCategory && matchesPriority;
      })
      .sort((left, right) => Number(left.completed) - Number(right.completed) || left.dueDate.localeCompare(right.dueDate));
  }, [search, selectedCategory, selectedPriority, storedState.tasks]);

  const byPriority = useMemo(
    () => [
      { label: 'Baixa', value: storedState.tasks.filter((task) => task.priority === 'low').length, color: '#34d399' },
      { label: 'Média', value: storedState.tasks.filter((task) => task.priority === 'medium').length, color: '#fbbf24' },
      { label: 'Alta', value: storedState.tasks.filter((task) => task.priority === 'high').length, color: '#fb7185' },
    ],
    [storedState.tasks],
  );

  const toggleDarkMode = () => {
    setStoredState((current) => ({ ...current, darkMode: !current.darkMode }));
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', storedState.darkMode);
  }, [storedState.darkMode]);

  const saveTask = (values: { title: string; description: string; priority: Task['priority']; category: string; dueDate: string }) => {
    const category = values.category.trim();
    const taskToStore = editingTask
      ? {
          ...editingTask,
          ...values,
          category,
        }
      : {
          id: crypto.randomUUID(),
          title: values.title,
          description: values.description,
          priority: values.priority,
          category,
          dueDate: values.dueDate,
          completed: false,
          createdAt: new Date().toISOString(),
        };

    const nextCategories = storedState.categories.includes(category)
      ? storedState.categories
      : [...storedState.categories, category].sort((left, right) => left.localeCompare(right));

    setStoredState((current) => ({
      ...current,
      tasks: editingTask
        ? current.tasks.map((task) => (task.id === editingTask.id ? taskToStore : task))
        : [taskToStore, ...current.tasks],
      categories: nextCategories,
    }));

    setTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleToggleTask = (task: Task) => {
    setStoredState((current) => ({
      ...current,
      tasks: current.tasks.map((item) =>
        item.id === task.id
          ? {
              ...item,
              completed: !item.completed,
              completedAt: !item.completed ? new Date().toISOString() : undefined,
            }
          : item,
      ),
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setStoredState((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== taskId),
    }));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  const totalPoints = stats.totalPoints;
  const totalCategories = storedState.categories.length;

  return (
    <div className="min-h-screen bg-aurora-soft text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 lg:px-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Task Forge</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                Lista de Tarefas Gamificada para portfólio profissional.
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
                Organize o trabalho, suba de nível, desbloqueie badges e acompanhe métricas com uma experiência de SaaS moderna.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingTask(null);
                  setTaskFormOpen(true);
                }}
                className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Nova tarefa
              </button>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="rounded-2xl border border-white/10 px-5 py-3 font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/5"
              >
                {storedState.darkMode ? 'Modo escuro' : 'Modo claro'}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Nível atual" value={stats.level} hint={`+${stats.pointsToNextLevel} pontos para o próximo nível`} accent="bg-cyan-300" />
            <MetricCard label="Pontos totais" value={totalPoints} hint="Pontuação acumulada por tarefas concluídas" accent="bg-emerald-300" />
            <MetricCard label="Conclusão" value={`${stats.completionRate}%`} hint={`${stats.completedTasks}/${stats.totalTasks} tarefas finalizadas`} accent="bg-amber-300" />
            <MetricCard label="Streak" value={`${stats.streak} dias`} hint="Sequência recente de produtividade" accent="bg-rose-300" />
          </div>
        </header>

        <main className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="grid gap-4 lg:grid-cols-[1.4fr_0.5fr_0.5fr]">
                <label className="grid gap-2">
                  <span className="text-sm text-slate-400">Pesquisar</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Título, descrição ou categoria"
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-slate-400">Categoria</span>
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
                  >
                    <option value="all">Todas</option>
                    {storedState.categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-slate-400">Prioridade</span>
                  <select
                    value={selectedPriority}
                    onChange={(event) => setSelectedPriority(event.target.value)}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
                  >
                    <option value="all">Todas</option>
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Tarefas</p>
                  <h2 className="text-2xl font-semibold text-white">Fluxo operacional</h2>
                </div>
                <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
                  {filteredTasks.length} itens visíveis
                </span>
              </div>
              <div className="mt-6">
                <TaskList
                  tasks={filteredTasks}
                  onToggle={handleToggleTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            </div>

            <Charts
              completed={stats.completedTasks}
              pending={stats.totalTasks - stats.completedTasks}
              byPriority={byPriority}
            />
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Categorias</p>
                  <h3 className="text-xl font-semibold text-white">Arquitetura flexível</h3>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">{totalCategories}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {storedState.categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
                  >
                    {category}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Novas categorias são criadas automaticamente quando você salva uma tarefa com um nome diferente.
              </p>
            </section>

            <Achievements achievements={achievements} />

            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-sm text-slate-400">Resumo rápido</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl bg-slate-950/50 px-4 py-3">
                  <span>Valor por alta prioridade</span>
                  <strong className="text-white">35 pts</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-950/50 px-4 py-3">
                  <span>Task concluída hoje</span>
                  <strong className="text-white">{stats.completedTasks}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-950/50 px-4 py-3">
                  <span>Badges desbloqueados</span>
                  <strong className="text-white">{achievements.filter((achievement: Achievement) => achievement.unlocked).length}</strong>
                </div>
              </div>
            </section>
          </aside>
        </main>
      </div>

      <TaskForm
        open={taskFormOpen}
        categories={storedState.categories}
        initialTask={editingTask}
        onClose={() => {
          setTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSave={saveTask}
      />
    </div>
  );
}
