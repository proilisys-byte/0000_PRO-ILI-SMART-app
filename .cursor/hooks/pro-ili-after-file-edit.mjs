#!/usr/bin/env node
/**
 * Cursor afterFileEdit hook — fast lint for the edited source file.
 * Input: { "file_path": "<absolute>", "edits": [...] }
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
const abs = typeof payload.file_path === 'string' ? path.normalize(payload.file_path) : '';

if (!abs || !fs.existsSync(abs)) {
  process.exit(0);
}

let rel;
try {
  rel = path.relative(REPO_ROOT, abs);
} catch {
  process.exit(0);
}

if (!rel || rel.startsWith('..' + path.sep) || rel === '..') {
  process.exit(0);
}

const segments = rel.split(path.sep);
const skipDirs = new Set([
  'node_modules',
  '.next',
  'dist',
  'coverage',
  '.git',
  'out',
  'build',
]);
if (segments.some((s) => skipDirs.has(s))) {
  process.exit(0);
}

if (!/\.(tsx?|jsx?|mjs|cjs)$/i.test(rel)) {
  process.exit(0);
}

const isWin = process.platform === 'win32';
/** Prefer `npm run` so hooks work when `pnpm` is not on PATH (Cursor hook subprocess). */
const result = spawnSync(isWin ? 'npm.cmd' : 'npm', ['run', 'lint', '--', '--file', rel], {
  cwd: REPO_ROOT,
  stdio: 'inherit',
  shell: isWin,
});

process.exit(result.status === null ? 1 : result.status);
