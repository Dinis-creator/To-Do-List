import type { Achievement } from '../types';

type AchievementsProps = {
  achievements: Achievement[];
};

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <section className="panel-soft rounded-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm theme-text-muted">Conquistas</p>
          <h3 className="text-xl font-semibold theme-title">Badges desbloqueados</h3>
        </div>
        <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-500 dark:text-cyan-200">
          {achievements.filter((achievement) => achievement.unlocked).length}/{achievements.length}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement) => (
          <article
            key={achievement.id}
            className={`rounded-3xl border p-4 transition ${
              achievement.unlocked
                ? 'border-cyan-400/30 bg-cyan-400/10'
                : 'border-white/10 bg-white/10 opacity-80'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-xl">
                {achievement.icon}
              </span>
              <div>
                <h4 className="font-semibold theme-title">{achievement.title}</h4>
                <p className="text-sm theme-text-muted">{achievement.description}</p>
              </div>
            </div>
            <p className="theme-text-muted mt-4 text-xs uppercase tracking-[0.2em]">
              {achievement.unlocked ? 'Desbloqueado' : 'Bloqueado'}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
