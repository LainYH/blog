import fs from 'fs';
import path from 'path';
import { safeParseFrontmatter } from './lib/frontmatter.mjs';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
let hasErrors = false;

function getAllMdFiles(dir, base = '') {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...getAllMdFiles(fullPath, relPath));
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      results.push({ filePath: fullPath, relativePath: relPath });
    }
  }
  return results;
}

const files = getAllMdFiles(POSTS_DIR);

for (const { filePath, relativePath } of files) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = safeParseFrontmatter(raw);

  if (!data.title && !data.date && !data.summary) {
    console.log(`⏭️  ${relativePath}: Skipped (no frontmatter, treated as draft)`);
    continue;
  }

  if (!data.title || typeof data.title !== 'string') {
    console.error(`❌ ${relativePath}: Missing or invalid "title" field`);
    hasErrors = true;
  }

  if (!data.date) {
    console.error(`❌ ${relativePath}: Missing "date" field`);
    hasErrors = true;
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date))) {
    console.error(`❌ ${relativePath}: Invalid date format "${data.date}" (expected YYYY-MM-DD)`);
    hasErrors = true;
  }

  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      console.error(`❌ ${relativePath}: "tags" must be an array`);
      hasErrors = true;
    }
  }

  if (!data.summary || typeof data.summary !== 'string') {
    console.error(`❌ ${relativePath}: Missing or invalid "summary" field`);
    hasErrors = true;
  }

  console.log(`✅ ${relativePath}`);
}

if (hasErrors) {
  console.error('\n❌ Content validation failed!');
  process.exit(1);
} else {
  console.log(`\n✅ All ${files.length} posts validated successfully!`);
}
