import matter from 'gray-matter';

/**
 * Parse frontmatter from markdown content.
 * Tries gray-matter (js-yaml) first; if that fails due to special characters
 * or malformed YAML, falls back to regex extraction so deployment never blocks.
 */
export function safeParseFrontmatter(raw) {
  // 1. Try gray-matter normally
  try {
    const result = matter(raw);
    if (result.data && Object.keys(result.data).length > 0) {
      return { data: normalizeData(result.data), content: result.content };
    }
    if (hasFrontmatter(raw)) {
      return { data: fallbackExtract(raw), content: stripFrontmatter(raw) };
    }
    return { data: {}, content: raw };
  } catch {
    // 2. Fallback: regex-based extraction
    if (hasFrontmatter(raw)) {
      return { data: fallbackExtract(raw), content: stripFrontmatter(raw) };
    }
    return { data: {}, content: raw };
  }
}

function normalizeData(data) {
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10);
  }
  return data;
}

function hasFrontmatter(raw) {
  return /^---\s*\n/.test(raw);
}

function extractFrontmatterText(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

function stripFrontmatter(raw) {
  return raw.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '');
}

function fallbackExtract(raw) {
  const fmText = extractFrontmatterText(raw);
  if (!fmText) return {};

  const data = {};
  const lines = fmText.split('\n');
  let currentKey = '';
  let listItems = [];

  for (const line of lines) {
    const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)/);
    if (kvMatch) {
      if (currentKey && listItems.length) {
        data[currentKey] = listItems;
        listItems = [];
      }

      currentKey = kvMatch[1];
      let value = kvMatch[2].trim();

      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (value.startsWith('[') && value.endsWith(']')) {
        const inner = value.slice(1, -1);
        data[currentKey] = inner
          .split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
        currentKey = '';
        continue;
      }

      if (value) {
        data[currentKey] = value;
        currentKey = '';
      }
      continue;
    }

    const listMatch = line.match(/^\s+-\s+(.*)/);
    if (listMatch && currentKey) {
      let item = listMatch[1].trim().replace(/^["']|["']$/g, '');
      listItems.push(item);
    }
  }

  if (currentKey && listItems.length) {
    data[currentKey] = listItems;
  }

  return data;
}
