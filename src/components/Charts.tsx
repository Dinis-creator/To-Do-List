type ChartsProps = {
  completed: number;
  pending: number;
  byPriority: { label: string; value: number; color: string }[];
};

function ProgressRing({ completed, pending }: Pick<ChartsProps, 'completed' | 'pending'>) {
  const total = completed + pending || 1;
  const ratio = completed / total;
  const circumference = 2 * Math.PI * 54;
  const dash = circumference * ratio;

  return (
    <div className="flex items-center justify-center">
      <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
        <circle cx="70" cy="70" r="54" className="fill-none stroke-white/10" strokeWidth="14" />
        <circle
          cx="70"
          cy="70"
          r="54"
          className="fill-none stroke-cyan-300"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-semibold text-white">{Math.round(ratio * 100)}%</p>
        <p className="text-sm text-slate-400">concluído</p>
      </div>
    </div>
  );
}

export function Charts({ completed, pending, byPriority }: ChartsProps) {
  const max = Math.max(...byPriority.map((item) => item.value), 1);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="panel-soft rounded-3xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm theme-text-muted">Progresso geral</p>
            <h3 className="text-xl font-semibold theme-title">Distribuição de tarefas</h3>
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-sm theme-text">
            {completed} concluídas · {pending} pendentes
          </div>
        </div>

        <div className="mt-6 grid place-items-center">
          <ProgressRing completed={completed} pending={pending} />
        </div>
      </section>

      <section className="panel-soft rounded-3xl p-6">
        <div>
          <p className="text-sm theme-text-muted">Prioridades</p>
          <h3 className="text-xl font-semibold theme-title">Volume por nível</h3>
        </div>

        <div className="mt-6 space-y-4">
          {byPriority.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm theme-text">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="h-3 rounded-full bg-white/10">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
