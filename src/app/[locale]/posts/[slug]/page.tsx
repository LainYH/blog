import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { renderMarkdown } from '@/lib/mdx';
import { extractToc } from '@/lib/toc';
import { Toc } from '@/components/Toc';
import { GiscusComments } from '@/components/GiscusComments';
import Link from 'next/link';

export function generateStaticParams() {
  const posts = getAllPosts();
  const locales = ['zh', 'en'];
  return locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  setRequestLocale(locale);
  const t = await getTranslations('post');

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await renderMarkdown(post.content);
  const toc = extractToc(post.content);

  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <time>{post.date}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
            {post.categoryPath.length > 0 && (
              <>
                <span>·</span>
                <Link
                  href={`/${locale}/categories/${post.categoryPath.map((s) => encodeURIComponent(s)).join('/')}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {post.categoryPath.join(' / ')}
                </Link>
              </>
            )}
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/${locale}/tags/${tag}`}
                  className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <GiscusComments />
      </article>

      <Toc items={toc} />
    </div>
  );
}
