import type { Task } from '../types';
import { formatDate, taskPriorityClass, taskPriorityLabel } from '../utils';

type TaskListProps = {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

export function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  if (!tasks.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-slate-300">
        Nenhuma tarefa encontrada. Crie a primeira para começar a acumular pontos.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <article
          key={task.id}
          className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-white/20 hover:bg-slate-900/80"
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
                  <h3 className={`text-lg font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${taskPriorityClass(task.priority)}`}>
                    {taskPriorityLabel(task.priority)}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {task.category}
                  </span>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{task.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                  Vence em {formatDate(task.dueDate)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-500/20"
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
