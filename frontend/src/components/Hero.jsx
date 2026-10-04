import { site } from '../config/site.js';
import { GitHubIcon, LinkedInIcon, MapPinIcon } from './Icons.jsx';

export default function Hero({ profile, loading }) {
  const name = profile?.name ?? site.name ?? site.githubUsername;

  return (
    <section id="top" className="container-page flex flex-col-reverse items-center gap-10 py-16 sm:py-24 md:flex-row">
      <div className="flex-1 text-center md:text-left">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-500">Hi, I'm</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          {loading ? <span className="inline-block h-12 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" /> : name}
        </h1>
        <p className="mt-3 text-xl font-medium text-slate-600 dark:text-slate-300">{site.title}</p>
        {profile?.bio && <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-400">{profile.bio}</p>}
        {profile?.location && (
          <p className="mt-3 inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <MapPinIcon /> {profile.location}
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
          <a href="#projects" className="btn-primary">
            View projects
          </a>
          <a
            href={profile?.htmlUrl ?? `https://github.com/${site.githubUsername}`}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            <GitHubIcon /> GitHub
          </a>
          {site.contact.linkedin && (
            <a href={site.contact.linkedin} target="_blank" rel="noreferrer" className="btn-secondary">
              <LinkedInIcon /> LinkedIn
            </a>
          )}
        </div>

        {profile && (
          <dl className="mt-8 flex justify-center gap-8 md:justify-start">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Public repos</dt>
              <dd className="text-2xl font-bold text-slate-900 dark:text-white">{profile.publicRepos}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Followers</dt>
              <dd className="text-2xl font-bold text-slate-900 dark:text-white">{profile.followers}</dd>
            </div>
          </dl>
        )}
      </div>

      <div className="shrink-0">
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={name}
            width={224}
            height={224}
            className="h-44 w-44 rounded-full border-4 border-white object-cover shadow-xl ring-4 ring-indigo-500/30 sm:h-56 sm:w-56 dark:border-slate-900"
          />
        ) : (
          <div className="h-44 w-44 animate-pulse rounded-full bg-slate-200 sm:h-56 sm:w-56 dark:bg-slate-800" />
        )}
      </div>
    </section>
  );
}
