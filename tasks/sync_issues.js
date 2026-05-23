const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const tasksDir = __dirname;
const files = fs.readdirSync(tasksDir).filter(f => f.endsWith('.md'));

console.log('Fetching existing issues to prevent duplicates...');
let existingIssues = [];
try {
  const output = execFileSync('gh', ['issue', 'list', '--limit', '1000', '--state', 'all', '--json', 'title'], { encoding: 'utf-8' });
  existingIssues = JSON.parse(output).map(issue => issue.title.trim());
} catch (e) {
  console.error('Failed to fetch existing issues:', e.message);
  process.exit(1);
}

for (const file of files) {
  const filePath = path.join(tasksDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let title = file; // fallback
  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
      break;
    }
  }

  if (existingIssues.includes(title)) {
    console.log(`[SKIP] Issue already exists: ${title}`);
    continue;
  }

  console.log(`[CREATE] Creating issue: ${title} (from ${file})`);
  try {
    execFileSync('gh', ['issue', 'create', '--title', title, '--body-file', filePath, '--label', 'Issue Automation'], { stdio: 'inherit' });
    console.log(`[SUCCESS] Created issue for ${file}`);
  } catch (e) {
    console.error(`[ERROR] Failed to create issue for ${file}:`, e.message);
  }
}
