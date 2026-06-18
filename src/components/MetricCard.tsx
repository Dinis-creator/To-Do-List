type MetricCardProps = {
  label: string;
  value: string | number;
  hint: string;
  accent: string;
};

export function MetricCard({ label, value, hint, accent }: MetricCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20">
      <p className="text-sm text-slate-300">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <strong className="text-3xl font-semibold tracking-tight text-white">{value}</strong>
        <span className={`h-3 w-3 rounded-full ${accent}`} />
      </div>
      <p className="mt-3 text-sm text-slate-400">{hint}</p>
    </article>
  );
}
