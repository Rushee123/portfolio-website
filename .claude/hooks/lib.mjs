// Shared helpers for the auto code-review hooks.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join, relative, resolve, sep } from 'node:path';

export const PROJECT_DIR = resolve(process.env.CLAUDE_PROJECT_DIR || join(import.meta.dirname, '..', '..'));
export const REVIEWS_DIR = join(PROJECT_DIR, '.claude', 'reviews');
export const STATE_FILE = join(REVIEWS_DIR, '.state.json');

// Set on the reviewer's own `claude -p` process so its hooks don't start more reviews
export const CHILD_ENV = 'PORTFOLIO_REVIEWER_CHILD';

const CODE_EXTS = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.py', '.css', '.html', '.conf', '.yml', '.yaml', '.sh', '.sql']);
const CODE_FILES = new Set(['Dockerfile', 'docker-compose.yml', 'package.json', '.env.example']);
const IGNORED_DIRS = new Set(['node_modules', 'dist', 'build', '.git', '.venv', '__pycache__', 'reviews']);

/** Repo-relative POSIX path, or null if outside the project. */
export function toRel(absPath) {
  const rel = relative(PROJECT_DIR, resolve(absPath));
  if (!rel || rel.startsWith('..')) return null;
  return rel.split(sep).join('/');
}

/** True when a file is source code worth reviewing. */
export function isReviewable(rel) {
  if (!rel) return false;
  const parts = rel.split('/');
  if (parts.some((p) => IGNORED_DIRS.has(p))) return false;
  if (rel.startsWith('.claude/') && !rel.startsWith('.claude/hooks/')) return false;
  const name = basename(rel);
  if (name === '.env' || name.endsWith('.lock') || name === 'package-lock.json') return false;
  return CODE_FILES.has(name) || CODE_EXTS.has(extname(name));
}

/** Every reviewable file currently in the repo (absolute paths). */
export function listReviewableFiles(dir = PROJECT_DIR, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) listReviewableFiles(join(dir, entry.name), out);
    } else if (isReviewable(toRel(join(dir, entry.name)))) {
      out.push(join(dir, entry.name));
    }
  }
  return out;
}

export function hashFile(absPath) {
  try {
    return createHash('sha1').update(readFileSync(absPath)).digest('hex');
  } catch {
    return null; // deleted or unreadable
  }
}

export function reportPathFor(rel) {
  return join(REVIEWS_DIR, `${rel.replace(/[\\/]/g, '__')}.md`);
}

// state: { [rel]: { hash, status: 'running'|'done'|'failed', pid, startedAt, finishedAt, verdict, delivered } }
export function readState() {
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

export function updateState(rel, patch) {
  mkdirSync(REVIEWS_DIR, { recursive: true });
  const state = readState();
  state[rel] = { ...state[rel], ...patch };
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  return state[rel];
}

export function isAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export function fileExists(p) {
  return existsSync(p) && statSync(p).isFile();
}
