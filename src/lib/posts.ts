import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Post, PostMeta, CategoryNode } from './types';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

function getAllMdFiles(dir: string, base: string = ''): { filePath: string; relativePath: string }[] {
  const results: { filePath: string; relativePath: string }[] = [];
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

function parsePost(filePath: string, relativePath: string): Post {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  // e.g. "frontend/react/hooks.md" -> slug "frontend-react-hooks", categoryPath ["frontend", "react"]
  const parts = relativePath.replace(/\.(md|mdx)$/, '').split('/');
  const slug = parts.join('-');
  const categoryPath = parts.slice(0, -1);

  return {
    title: data.title || slug,
    date: data.date || '2026-01-01',
    tags: data.tags || [],
    summary: data.summary || '',
    slug,
    categoryPath,
    readingTime: stats.text,
    content,
  };
}

export function getAllPosts(): Post[] {
  const files = getAllMdFiles(POSTS_DIR);
  return files
    .map((f) => parsePost(f.filePath, f.relativePath))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostMetaList(): PostMeta[] {
  return getAllPosts().map(({ content, ...meta }) => meta);
}

export function buildCategoryTree(posts: PostMeta[]): CategoryNode {
  const root: CategoryNode = {
    name: 'root',
    slug: '',
    path: '',
    children: new Map(),
    posts: [],
  };

  for (const post of posts) {
    let current = root;
    for (const segment of post.categoryPath) {
      if (!current.children.has(segment)) {
        current.children.set(segment, {
          name: segment,
          slug: segment,
          path: current.path ? `${current.path}/${segment}` : segment,
          children: new Map(),
          posts: [],
        });
      }
      current = current.children.get(segment)!;
    }
    current.posts.push(post);
  }

  return root;
}

export function getAllTags(posts: PostMeta[]): Map<string, PostMeta[]> {
  const tagMap = new Map<string, PostMeta[]>();
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagMap.has(tag)) tagMap.set(tag, []);
      tagMap.get(tag)!.push(post);
    }
  }
  return tagMap;
}

export function getCategoryNodeByPath(root: CategoryNode, categoryPath: string[]): CategoryNode | undefined {
  let current: CategoryNode | undefined = root;
  for (const segment of categoryPath) {
    if (!current || !current.children.has(segment)) return undefined;
    current = current.children.get(segment);
  }
  return current;
}
