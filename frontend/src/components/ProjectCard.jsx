import { ExternalIcon, GitHubIcon, StarIcon } from './Icons.jsx';

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
};

const prettyName = (name) => name.replace(/[_-]+/g, ' ');

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });

export default function ProjectCard({ project }) {
  const { name, description, language, stars, htmlUrl, homepage, topics, updatedAt, featured } = project;

  return (
    <article className="card flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold capitalize text-slate-900 dark:text-white">{prettyName(name)}</h3>
        {featured && (
          <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
            Featured
          </span>
        )}
      </div>

      <p className="line-clamp-4 flex-1 text-sm text-slate-600 dark:text-slate-400" title={description || undefined}>
        {description || 'No description yet.'}
      </p>

      {topics.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {topics.slice(0, 4).map((t) => (
            <li key={t} className="rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        {language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANGUAGE_COLORS[language] ?? '#94a3b8' }} />
            {language}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <StarIcon /> {stars}
        </span>
        <span>Updated {formatDate(updatedAt)}</span>
      </div>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <a href={htmlUrl} target="_blank" rel="noreferrer" className="btn-secondary !px-3 !py-1.5 !text-xs">
          <GitHubIcon width={14} height={14} /> Code
        </a>
        {homepage && (
          <a href={homepage} target="_blank" rel="noreferrer" className="btn-primary !px-3 !py-1.5 !text-xs">
            <ExternalIcon /> Live
          </a>
        )}
      </div>
    </article>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="card animate-pulse space-y-3 p-5">
      <div className="h-5 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
