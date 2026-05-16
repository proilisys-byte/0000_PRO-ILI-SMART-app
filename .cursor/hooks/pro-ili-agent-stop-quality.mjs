#!/usr/bin/env node
/**
 * Cursor stop hook — when the agent run completes successfully, run full typecheck + lint.
 * Input: { "status": "completed" | "aborted" | "error", "loop_count": number }
 */
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');

function readPayload() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const payload = readPayload();
if (payload.status !== 'completed') {
  process.exit(0);
}

const isWin = process.platform === 'win32';
const npm = isWin ? 'npm.cmd' : 'npm';

const tsc = spawnSync(npm, ['run', 'typecheck'], {
  cwd: REPO_ROOT,
  stdio: 'inherit',
  shell: isWin,
});
if (tsc.status !== 0) {
  process.exit(tsc.status === null ? 1 : tsc.status);
}

const lint = spawnSync(npm, ['run', 'lint'], {
  cwd: REPO_ROOT,
  stdio: 'inherit',
  shell: isWin,
});
process.exit(lint.status === null ? 1 : lint.status);
