import matter from 'gray-matter';

export interface FrontmatterData {
  title?: string;
  date?: string;
  tags?: string[];
  summary?: string;
  [key: string]: unknown;
}

/**
 * Parse frontmatter from markdown content.
 * Tries gray-matter (js-yaml) first; if that fails due to special characters
 * or malformed YAML, falls back to regex extraction so deployment never blocks.
 */
export function safeParseFrontmatter(raw: string): { data: FrontmatterData; content: string } {
  // 1. Try gray-matter normally
  try {
    const result = matter(raw);
    if (result.data && Object.keys(result.data).length > 0) {
      return { data: normalizeData(result.data as FrontmatterData), content: result.content };
    }
    // gray-matter succeeded but returned empty data — might still be a parse edge case
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

/** Normalize data from gray-matter: convert Date objects back to YYYY-MM-DD strings */
function normalizeData(data: Record<string, unknown>): FrontmatterData {
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10);
  }
  return data as FrontmatterData;
}

function hasFrontmatter(raw: string): boolean {
  return /^---\s*\n/.test(raw);
}

/** Extract frontmatter block text between the two --- delimiters */
function extractFrontmatterText(raw: string): string {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '');
}

/**
 * Regex-based fallback: extracts key-value pairs from frontmatter.
 * Handles formats like:
 *   key: value
 *   key: "value with special chars"
 *   key: 'single quoted'
 *   key: [item1, item2]
 *   key: [ "item1", "item2" ]
 *   key:
 *     - item1
 *     - item2
 */
function fallbackExtract(raw: string): FrontmatterData {
  const fmText = extractFrontmatterText(raw);
  if (!fmText) return {};

  const data: FrontmatterData = {};
  const lines = fmText.split('\n');
  let currentKey = '';
  let listItems: string[] = [];

  for (const line of lines) {
    // Match "key: value" — key is non-whitespace before first colon
    const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)/);
    if (kvMatch) {
      // Flush any pending list
      if (currentKey && listItems.length) {
        data[currentKey] = listItems;
        listItems = [];
      }

      currentKey = kvMatch[1];
      let value = kvMatch[2].trim();

      // Strip surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Inline array: [a, b, c] or [ "a", "b" ]
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

    // YAML list item: "  - value"
    const listMatch = line.match(/^\s+-\s+(.*)/);
    if (listMatch && currentKey) {
      let item = listMatch[1].trim().replace(/^["']|["']$/g, '');
      listItems.push(item);
    }
  }

  // Flush remaining list
  if (currentKey && listItems.length) {
    data[currentKey] = listItems;
  }

  return data;
}
