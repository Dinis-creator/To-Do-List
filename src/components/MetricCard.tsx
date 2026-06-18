type MetricCardProps = {
  label: string;
  value: string | number;
  hint: string;
  accent: string;
};

export function MetricCard({ label, value, hint, accent }: MetricCardProps) {
  return (
    <article className="surface-card rounded-3xl p-5 shadow-glow backdrop-blur-xl transition hover:-translate-y-1">
      <p className="text-sm theme-text-muted">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <strong className="theme-title text-3xl font-semibold tracking-tight">{value}</strong>
        <span className={`h-3 w-3 rounded-full ${accent}`} />
      </div>
      <p className="mt-3 text-sm theme-text-muted">{hint}</p>
    </article>
  );
}
