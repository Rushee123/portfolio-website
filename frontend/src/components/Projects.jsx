import { useMemo, useState } from 'react';
import { site } from '../config/site.js';
import { RateLimitError } from '../services/projectsService.js';
import ProjectCard, { ProjectCardSkeleton } from './ProjectCard.jsx';

const ALL = 'All';

function ErrorState({ error }) {
  const profileUrl = `https://github.com/${site.githubUsername}?tab=repositories`;
  const rateLimited = error instanceof RateLimitError;

  return (
    <div className="card p-6 text-center">
      <p className="font-semibold text-slate-900 dark:text-white">
        {rateLimited ? 'GitHub rate limit reached' : "Couldn't load projects"}
      </p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {rateLimited && error.resetAt
          ? `Try again after ${error.resetAt.toLocaleTimeString()}.`
          : 'Please try again in a moment.'}{' '}
        In the meantime, you can browse them directly on GitHub.
      </p>
      <a href={profileUrl} target="_blank" rel="noreferrer" className="btn-primary mt-4">
        Open GitHub repositories
      </a>
    </div>
  );
}

export default function Projects({ projects, loading, error }) {
  const [filter, setFilter] = useState(ALL);

  const languages = useMemo(
    () => [ALL, ...new Set(projects.map((p) => p.language).filter(Boolean))],
    [projects],
  );
  const visible = filter === ALL ? projects : projects.filter((p) => p.language === filter);

  return (
    <section id="projects" className="container-page py-16">
      <h2 className="section-title">Projects</h2>

      {error ? (
        <ErrorState error={error} />
      ) : (
        <>
          {!loading && languages.length > 2 && (
            <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by language">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setFilter(lang)}
                  aria-pressed={filter === lang}
                  className={`chip ${
                    filter === lang
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }, (_, i) => <ProjectCardSkeleton key={i} />)
              : visible.map((p) => <ProjectCard key={p.name} project={p} />)}
          </div>

          {!loading && visible.length === 0 && (
            <p className="text-slate-500">No projects to show yet.</p>
          )}
        </>
      )}
    </section>
  );
}
