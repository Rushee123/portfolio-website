// Hook entry point for PostToolUse (Write|Edit) and FileChanged.
// Starts a background review of the changed file, and hands any finished reviews
// that need attention back to Claude as additionalContext. Never blocks or fails the session.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CHILD_ENV, PROJECT_DIR, fileExists, hashFile, isAlive, isReviewable,
  readState, reportPathFor, toRel, updateState,
} from './lib.mjs';

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf8') || '{}');
  } catch {
    return {};
  }
}

/** Finished reviews with findings that Claude hasn't been shown yet. */
function collectUndelivered() {
  const out = [];
  for (const [rel, s] of Object.entries(readState())) {
    if (s.status !== 'done' || s.delivered || s.verdict === 'ok') continue;
    try {
      out.push(readFileSync(reportPathFor(rel), 'utf8').trim());
      updateState(rel, { delivered: true });
    } catch {
      // report missing; skip
    }
  }
  return out;
}

function startReview(rel, changeType) {
  const abs = join(PROJECT_DIR, rel);
  const hash = hashFile(abs);
  if (!hash) return null;

  const prev = readState()[rel];
  if (prev?.hash === hash && prev.status !== 'failed') return null; // content already reviewed or in review
  if (prev?.status === 'running' && isAlive(prev.pid)) {
    // the worker re-checks the hash when it finishes, so the newest content still gets reviewed
    return `code-reviewer already running for ${rel}; it will re-review the latest version`;
  }

  const worker = spawn(process.execPath, [join(import.meta.dirname, 'review-worker.mjs'), rel, changeType], {
    cwd: PROJECT_DIR,
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    env: { ...process.env, CLAUDE_PROJECT_DIR: PROJECT_DIR },
  });
  worker.unref();
  updateState(rel, { hash, status: 'running', pid: worker.pid, startedAt: new Date().toISOString(), delivered: false });
  return `code-reviewer started for ${rel} → .claude/reviews/`;
}

function main() {
  if (process.env[CHILD_ENV]) return; // inside the reviewer's own session

  const input = readInput();
  const event = input.hook_event_name || 'PostToolUse';
  const changeType = input.change_type || 'modified';
  const filePath = input.tool_input?.file_path || input.tool_response?.filePath || input.file_path;

  let status = null;
  const rel = filePath && toRel(filePath);
  if (rel && changeType !== 'deleted' && isReviewable(rel) && fileExists(join(PROJECT_DIR, rel))) {
    status = startReview(rel, changeType);
  }

  const reports = collectUndelivered();
  const output = {};
  if (status) output.systemMessage = `🔍 ${status}`;
  if (reports.length) {
    output.hookSpecificOutput = {
      hookEventName: event,
      additionalContext:
        'Background code-reviewer subagent reports (from .claude/reviews/). ' +
        'Review these findings; fix real issues or explain why they do not apply:\n\n' +
        reports.join('\n\n---\n\n'),
    };
  }
  if (Object.keys(output).length) process.stdout.write(JSON.stringify(output));
}

try {
  main();
} catch (err) {
  // A review hook must never break editing
  process.stderr.write(`review-hook: ${err.message}\n`);
}
process.exit(0);
