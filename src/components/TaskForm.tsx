import { useEffect, useState } from 'react';
import type { Priority, Task } from '../types';

type TaskFormValues = {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  dueDate: string;
};

type TaskFormProps = {
  open: boolean;
  categories: string[];
  initialTask?: Task | null;
  onClose: () => void;
  onSave: (values: TaskFormValues) => void;
};

const defaultValues: TaskFormValues = {
  title: '',
  description: '',
  priority: 'medium',
  category: '',
  dueDate: '',
};

export function TaskForm({ open, categories, initialTask, onClose, onSave }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(defaultValues);

  useEffect(() => {
    if (initialTask) {
      setValues({
        title: initialTask.title,
        description: initialTask.description,
        priority: initialTask.priority,
        category: initialTask.category,
        dueDate: initialTask.dueDate,
      });
    } else {
      setValues(defaultValues);
    }
  }, [initialTask, open]);

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({
      ...values,
      category: values.category.trim() || 'Geral',
    });
  };

  const setField = <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-cyan-950/30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Task Forge</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">
              {initialTask ? 'Editar tarefa' : 'Nova tarefa'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            Fechar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Título</span>
              <input
                required
                value={values.title}
                onChange={(event) => setField('title', event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
                placeholder="Ex: Lançar dashboard"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Vencimento</span>
              <input
                required
                type="date"
                value={values.dueDate}
                onChange={(event) => setField('dueDate', event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm text-slate-300">Descrição</span>
            <textarea
              required
              rows={4}
              value={values.description}
              onChange={(event) => setField('description', event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
              placeholder="Descreva o objetivo, contexto ou próximo passo"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Prioridade</span>
              <select
                value={values.priority}
                onChange={(event) => setField('priority', event.target.value as Priority)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">Categoria</span>
              <input
                list="task-categories"
                value={values.category}
                onChange={(event) => setField('category', event.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
                placeholder="Ex: Produto, Marketing..."
              />
              <datalist id="task-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </label>
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {initialTask ? 'Guardar alterações' : 'Criar tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
