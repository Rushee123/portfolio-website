// Phase 1 source: public GitHub REST API, called from the browser.
// Unauthenticated limit is 60 req/hour per IP, so responses are cached in sessionStorage.
const API = 'https://api.github.com';
const CACHE_TTL_MS = 60 * 60 * 1000;

export class RateLimitError extends Error {
  constructor(resetAt) {
    super('GitHub API rate limit reached');
    this.name = 'RateLimitError';
    this.resetAt = resetAt;
  }
}

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    return Date.now() - at < CACHE_TTL_MS ? data : null;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // storage full or blocked; caching is best-effort
  }
}

async function getJson(path) {
  const key = `gh:${path}`;
  const cached = readCache(key);
  if (cached) return cached;

  const res = await fetch(`${API}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if ((res.status === 403 || res.status === 429) && res.headers.get('x-ratelimit-remaining') === '0') {
    const reset = Number(res.headers.get('x-ratelimit-reset'));
    throw new RateLimitError(reset ? new Date(reset * 1000) : null);
  }
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${path}`);

  const data = await res.json();
  writeCache(key, data);
  return data;
}

export async function fetchProfile(username) {
  const u = await getJson(`/users/${username}`);
  return {
    name: u.name || u.login,
    username: u.login,
    bio: u.bio,
    location: u.location,
    avatarUrl: u.avatar_url,
    htmlUrl: u.html_url,
    publicRepos: u.public_repos,
    followers: u.followers,
  };
}

export async function fetchProjects(username) {
  const repos = await getJson(`/users/${username}/repos?per_page=100&sort=updated`);
  return repos.map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    isFork: r.fork,
    htmlUrl: r.html_url,
    homepage: r.homepage || null,
    topics: r.topics || [],
    updatedAt: r.pushed_at || r.updated_at,
  }));
}
