import fs from 'fs';
import path from 'path';
import { safeParseFrontmatter } from './lib/frontmatter.mjs';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const OUTPUT = path.join(process.cwd(), 'public/search-index.json');

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
const index = files.map(({ filePath, relativePath }) => {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = safeParseFrontmatter(raw);
  const parts = relativePath.replace(/\.(md|mdx)$/, '').split('/');
  const slug = parts.join('-');
  const categoryPath = parts.slice(0, -1);

  return {
    slug,
    title: data.title || slug,
    summary: data.summary || '',
    content: content.slice(0, 2000),
    categoryPath,
    tags: data.tags || [],
    date: data.date || '2026-01-01',
  };
});

fs.writeFileSync(OUTPUT, JSON.stringify(index));
console.log(`Search index built: ${index.length} posts`);
