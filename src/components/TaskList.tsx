import type { Task } from '../types';
import { formatDate, taskPriorityClass, taskPriorityLabel } from '../utils';

type TaskListProps = {
  tasks: Task[];
  emptyMessage?: string;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

export function TaskList({ tasks, emptyMessage, onToggle, onEdit, onDelete }: TaskListProps) {
  if (!tasks.length) {
    return (
      <div className="surface-card rounded-3xl border-dashed p-10 text-center theme-text-muted">
        {emptyMessage ?? 'Nenhuma tarefa encontrada. Crie a primeira para começar a acumular pontos.'}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <article
          key={task.id}
          className="surface-strong rounded-3xl p-5 transition hover:border-cyan-400/30"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => onToggle(task)}
                className={`mt-1 h-6 w-6 rounded-full border transition ${
                  task.completed
                    ? 'border-cyan-400 bg-cyan-400'
                    : 'border-white/20 bg-transparent hover:border-cyan-400/60'
                }`}
                aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
              />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className={`text-lg font-semibold ${task.completed ? 'text-slate-400 line-through' : 'theme-title'}`}>
                    {task.title}
                  </h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${taskPriorityClass(task.priority)}`}>
                    {taskPriorityLabel(task.priority)}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs theme-text">
                    {task.category}
                  </span>
                </div>
                <p className="theme-text-muted mt-2 max-w-3xl text-sm leading-6">{task.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Vence em {formatDate(task.dueDate)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="theme-button theme-button-secondary px-4 py-2 text-sm"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="theme-button theme-button-danger px-4 py-2 text-sm"
              >
                Apagar
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
