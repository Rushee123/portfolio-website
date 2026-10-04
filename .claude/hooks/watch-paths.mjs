// SessionStart hook: tells Claude Code which files to watch so FileChanged fires
// for edits made outside Claude (e.g. in your editor). New files are picked up next session.
import { CHILD_ENV, listReviewableFiles } from './lib.mjs';

if (!process.env[CHILD_ENV]) {
  try {
    process.stdout.write(
      JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', watchPaths: listReviewableFiles() } }),
    );
  } catch (err) {
    process.stderr.write(`watch-paths: ${err.message}\n`);
  }
}
process.exit(0);
