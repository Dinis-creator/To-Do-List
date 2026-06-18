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
import { DataManager } from './components/DataManager';

const initialState: AppState = {
  tasks: defaultTasks,
  categories: defaultCategories,
  darkMode: true,
};

function createInitialState(): AppState {
  return {
    tasks: structuredClone(initialState.tasks),
    categories: [...initialState.categories],
    darkMode: initialState.darkMode,
  };
}

export default function App() {
  const [storedState, setStoredState] = useLocalStorageState<AppState>('task-forge-state', createInitialState());
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

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedPriority('all');
  };

  const handleExportState = () => {
    const payload = JSON.stringify(storedState, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `task-forge-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportState = async (file: File) => {
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw) as Partial<AppState>;

      if (!Array.isArray(parsed.tasks) || !Array.isArray(parsed.categories) || typeof parsed.darkMode !== 'boolean') {
        throw new Error('Formato inválido');
      }

      setStoredState({
        tasks: parsed.tasks,
        categories: parsed.categories,
        darkMode: parsed.darkMode,
      });
    } catch {
      window.alert('Não foi possível importar o ficheiro. Use um backup JSON do Task Forge.');
    }
  };

  const handleResetState = () => {
    const confirmed = window.confirm('Restaurar a demo irá apagar as alterações guardadas. Continuar?');
    if (!confirmed) return;

    setStoredState(createInitialState());
  };

  const totalPoints = stats.totalPoints;
  const totalCategories = storedState.categories.length;

  return (
    <div className="app-shell">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 pb-10 lg:px-8">
        <header className="panel rounded-[2rem] p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-500/80">Task Forge</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight theme-title lg:text-5xl">
                Lista de Tarefas Gamificada para portfólio profissional.
              </h1>
              <p className="theme-text-muted mt-3 max-w-3xl text-base leading-7">
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
                className="theme-button theme-button-primary"
              >
                Nova tarefa
              </button>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="theme-button theme-button-secondary"
              >
                {storedState.darkMode ? 'Modo claro' : 'Modo escuro'}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Nível atual" value={stats.level} hint={`+${stats.pointsToNextLevel} pontos para o próximo nível`} accent="bg-cyan-400" />
            <MetricCard label="Pontos totais" value={totalPoints} hint="Pontuação acumulada por tarefas concluídas" accent="bg-emerald-400" />
            <MetricCard label="Conclusão" value={`${stats.completionRate}%`} hint={`${stats.completedTasks}/${stats.totalTasks} tarefas finalizadas`} accent="bg-amber-400" />
            <MetricCard label="Streak" value={`${stats.streak} dias`} hint="Sequência recente de produtividade" accent="bg-rose-400" />
          </div>
        </header>

        <main className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="space-y-6">
            <div className="panel-soft rounded-3xl p-6">
              <div className="grid gap-4 lg:grid-cols-[1.4fr_0.5fr_0.5fr]">
                <label className="grid gap-2">
                  <span className="text-sm theme-text-muted">Pesquisar</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Título, descrição ou categoria"
                    className="theme-input"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm theme-text-muted">Categoria</span>
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="theme-input"
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
                  <span className="text-sm theme-text-muted">Prioridade</span>
                  <select
                    value={selectedPriority}
                    onChange={(event) => setSelectedPriority(event.target.value)}
                    className="theme-input"
                  >
                    <option value="all">Todas</option>
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </label>
              </div>

              {(search || selectedCategory !== 'all' || selectedPriority !== 'all') && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm">
                  <span className="theme-text-muted">Filtros ativos. Limpe para ver todas as tarefas.</span>
                  <button type="button" onClick={clearFilters} className="theme-button theme-button-secondary px-4 py-2 text-sm">
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>

            <div className="panel-soft rounded-3xl p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm theme-text-muted">Tarefas</p>
                  <h2 className="text-2xl font-semibold theme-title">Fluxo operacional</h2>
                </div>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm theme-text">
                  {filteredTasks.length} itens visíveis
                </span>
              </div>
              <div className="mt-6">
                <TaskList
                  tasks={filteredTasks}
                  emptyMessage="Nenhuma tarefa corresponde aos filtros atuais. Limpa os filtros para voltar a ver tudo."
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
            <section className="panel-soft rounded-3xl p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm theme-text-muted">Categorias</p>
                  <h3 className="text-xl font-semibold theme-title">Arquitetura flexível</h3>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm theme-text">{totalCategories}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {storedState.categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm theme-text transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                  >
                    {category}
                  </button>
                ))}
              </div>

              <p className="theme-text-muted mt-4 text-sm leading-6">
                Novas categorias são criadas automaticamente quando você salva uma tarefa com um nome diferente.
              </p>
            </section>

            <Achievements achievements={achievements} />

            <DataManager onExport={handleExportState} onImport={handleImportState} onReset={handleResetState} />

            <section className="panel-soft rounded-3xl p-6">
              <p className="text-sm theme-text-muted">Resumo rápido</p>
              <div className="theme-text mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span>Valor por alta prioridade</span>
                  <strong className="theme-title">35 pts</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span>Task concluída hoje</span>
                  <strong className="theme-title">{stats.completedTasks}</strong>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                  <span>Badges desbloqueados</span>
                  <strong className="theme-title">{achievements.filter((achievement: Achievement) => achievement.unlocked).length}</strong>
                </div>
              </div>
            </section>
          </aside>
        </main>

        <footer className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-4 text-sm backdrop-blur-xl">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="theme-text">Feito por: Dinis da Silva Gonçalves</p>
            <p className="theme-text-muted">React · Tailwind CSS · Local Storage · Dark mode · Charts</p>
          </div>
        </footer>
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
