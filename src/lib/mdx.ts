import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { codeToHtml } from 'shiki';

export async function renderMarkdown(markdown: string): Promise<string> {
  // Process: remark → remark-rehype (with rehype-slug for heading IDs) → stringify
  const result = await remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown);

  let html = result.toString();

  // Shiki code highlighting: find <pre><code class="language-xxx"> blocks
  const codeBlockRegex = /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;
  const matches = [...html.matchAll(codeBlockRegex)];

  for (const match of matches) {
    const lang = match[1];
    const code = decodeHtmlEntities(match[2]);
    try {
      const highlighted = await codeToHtml(code, {
        lang,
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        cssVariablePrefix: '--shiki-',
      });
      html = html.replace(
        match[0],
        `<div class="code-block-wrapper">${highlighted}<button class="copy-btn" data-code="${encodeURIComponent(code)}">Copy</button></div>`
      );
    } catch {
      // Language not supported, keep original
    }
  }

  // Handle code blocks without language
  const plainCodeRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;
  const plainMatches = [...html.matchAll(plainCodeRegex)];
  for (const match of plainMatches) {
    const code = decodeHtmlEntities(match[1]);
    try {
      const highlighted = await codeToHtml(code, {
        lang: 'text',
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        cssVariablePrefix: '--shiki-',
      });
      html = html.replace(
        match[0],
        `<div class="code-block-wrapper">${highlighted}<button class="copy-btn" data-code="${encodeURIComponent(code)}">Copy</button></div>`
      );
    } catch {
      // keep original
    }
  }

  return html;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}
