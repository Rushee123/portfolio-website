// Detached worker: runs the code-reviewer subagent headlessly and saves its report.
// Usage: node review-worker.mjs <repo-relative-path> <change_type>
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CHILD_ENV, PROJECT_DIR, REVIEWS_DIR, hashFile, reportPathFor, updateState } from './lib.mjs';

const [rel, changeType = 'modified'] = process.argv.slice(2);
const MAX_PASSES = 3; // re-review if the file keeps changing, but don't loop forever
const TIMEOUT_MS = 5 * 60 * 1000;

function runReview() {
  const prompt =
    `Review the ${changeType} file \`${rel}\` in this repository. ` +
    'Follow your process and output format exactly.';
  return spawnSync(
    'claude',
    ['-p', '--agent', 'code-reviewer', '--allowedTools', 'Read', 'Grep', 'Glob', '--permission-mode', 'dontAsk', prompt],
    {
      cwd: PROJECT_DIR,
      encoding: 'utf8',
      timeout: TIMEOUT_MS,
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024,
      env: { ...process.env, [CHILD_ENV]: '1' },
    },
  );
}

// Classify by the report's Verdict line only, so words in prose don't skew it
function verdictOf(report) {
  const line = report.match(/\*\*Verdict:\*\*.*$/m)?.[0] ?? '';
  if (line.includes('✅')) return 'ok';
  if (line.includes('❌')) return 'needs-changes';
  return 'minor'; // ⚠️, or an unrecognised verdict worth a look
}

mkdirSync(REVIEWS_DIR, { recursive: true });
const abs = join(PROJECT_DIR, rel);

for (let pass = 1; pass <= MAX_PASSES; pass++) {
  const hash = hashFile(abs);
  if (!hash) break; // deleted meanwhile
  updateState(rel, { hash, status: 'running', pid: process.pid });

  const res = runReview();
  const ok = res.status === 0 && res.stdout?.trim();
  const header = `<!-- reviewed ${new Date().toISOString()} · sha1 ${hash.slice(0, 12)} -->\n`;
  const body = ok
    ? res.stdout.trim()
    : `## Review: ${rel}\n**Verdict:** review failed\n\n\`\`\`\n${(res.error?.message || res.stderr || 'no output').slice(0, 2000)}\n\`\`\``;
  writeFileSync(reportPathFor(rel), header + body + '\n');

  updateState(rel, {
    status: ok ? 'done' : 'failed',
    verdict: ok ? verdictOf(body) : 'failed',
    finishedAt: new Date().toISOString(),
    delivered: false,
    pid: null,
  });

  if (hashFile(abs) === hash) break; // still current; done
}
