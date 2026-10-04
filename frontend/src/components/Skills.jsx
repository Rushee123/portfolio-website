import { useMemo } from 'react';
import { site } from '../config/site.js';

export default function Skills({ projects }) {
  // Count repos per language so the "From my GitHub" group reflects real usage
  const repoLanguages = useMemo(() => {
    const counts = {};
    for (const p of projects) if (p.language) counts[p.language] = (counts[p.language] || 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [projects]);

  return (
    <section id="skills" className="container-page py-16">
      <h2 className="section-title">Skills</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(site.skills).map(([group, items]) => (
          <div key={group} className="card p-5">
            <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">{group}</h3>
            <ul className="flex flex-wrap gap-2">
              {items.map((s) => (
                <li key={s} className="chip border-slate-200 dark:border-slate-700">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {repoLanguages.length > 0 && (
          <div className="card p-5">
            <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">From my GitHub</h3>
            <ul className="space-y-2">
              {repoLanguages.map(([lang, count]) => (
                <li key={lang} className="flex items-center gap-3 text-sm">
                  <span className="w-24 shrink-0">{lang}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <span
                      className="block h-full rounded-full bg-indigo-500"
                      style={{ width: `${(count / repoLanguages[0][1]) * 100}%` }}
                    />
                  </span>
                  <span className="w-14 text-right text-slate-500">
                    {count} repo{count > 1 ? 's' : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
