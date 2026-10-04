// The only data entry point for components. See decisions/0001-phased-architecture.md.
import { site } from '../config/site.js';
import * as githubSource from './sources/githubSource.js';
import * as apiSource from './sources/apiSource.js';

export { RateLimitError } from './sources/githubSource.js';

/**
 * @typedef {Object} Profile
 * @property {string} name
 * @property {string} username
 * @property {string|null} bio
 * @property {string|null} location
 * @property {string} avatarUrl
 * @property {string} htmlUrl
 * @property {number} publicRepos
 * @property {number} followers
 */

/**
 * @typedef {Object} Project
 * @property {string} name
 * @property {string|null} description
 * @property {string|null} language
 * @property {number} stars
 * @property {number} forks
 * @property {boolean} isFork
 * @property {string} htmlUrl
 * @property {string|null} homepage   Live demo URL if any
 * @property {string[]} topics
 * @property {string} updatedAt       ISO timestamp
 */

const SOURCES = { github: githubSource, api: apiSource };
const sourceName = import.meta.env.VITE_DATA_SOURCE || 'github';
const source = SOURCES[sourceName];
if (!source) throw new Error(`Unknown VITE_DATA_SOURCE "${sourceName}"`);

/** @returns {Promise<Profile>} */
export async function getProfile() {
  const p = await source.fetchProfile(site.githubUsername);
  return {
    ...p,
    name: site.name ?? p.name,
    bio: site.bio ?? p.bio,
    location: site.location ?? p.location,
  };
}

/** @returns {Promise<Project[]>} Featured first (in config order), then by most recently updated */
export async function getProjects() {
  const all = await source.fetchProjects(site.githubUsername);
  const hidden = new Set(site.hiddenRepos.map((n) => n.toLowerCase()));
  const featuredOrder = site.featuredRepos.map((n) => n.toLowerCase());

  return all
    .filter((p) => !p.isFork && !hidden.has(p.name.toLowerCase()))
    .map((p) => ({ ...p, featured: featuredOrder.includes(p.name.toLowerCase()) }))
    .sort((a, b) => {
      const fa = featuredOrder.indexOf(a.name.toLowerCase());
      const fb = featuredOrder.indexOf(b.name.toLowerCase());
      if (fa !== -1 || fb !== -1) {
        if (fa === -1) return 1;
        if (fb === -1) return -1;
        return fa - fb;
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
}
