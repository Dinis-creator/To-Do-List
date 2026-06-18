type DataManagerProps = {
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
};

export function DataManager({ onExport, onImport, onReset }: DataManagerProps) {
  return (
    <section className="panel-soft rounded-3xl p-6">
      <div>
        <p className="text-sm theme-text-muted">Gestão de dados</p>
        <h3 className="text-xl font-semibold theme-title">Backup e restauro</h3>
      </div>

      <p className="theme-text-muted mt-3 text-sm leading-6">
        Exporte um backup do estado atual, importe um ficheiro JSON compatível ou volte ao conteúdo inicial de demonstração.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onExport}
          className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/5"
        >
          Exportar JSON
        </button>

        <label className="cursor-pointer rounded-2xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/5">
          Importar JSON
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImport(file);
              event.currentTarget.value = '';
            }}
          />
        </label>

        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
        >
          Restaurar demo
        </button>
      </div>
    </section>
  );
}
