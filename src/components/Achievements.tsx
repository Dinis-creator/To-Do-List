import type { Achievement } from '../types';

type AchievementsProps = {
  achievements: Achievement[];
};

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Conquistas</p>
          <h3 className="text-xl font-semibold text-white">Badges desbloqueados</h3>
        </div>
        <span className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
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
                : 'border-white/10 bg-slate-950/40 opacity-70'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-xl">
                {achievement.icon}
              </span>
              <div>
                <h4 className="font-semibold text-white">{achievement.title}</h4>
                <p className="text-sm text-slate-400">{achievement.description}</p>
              </div>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
              {achievement.unlocked ? 'Desbloqueado' : 'Bloqueado'}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
