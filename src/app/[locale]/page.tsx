import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getPostMetaList, buildCategoryTree, getAllTags } from '@/lib/posts';
import { BlogStats } from '@/components/BlogStats';
import { HomePostList } from '@/components/HomePostList';
import Link from 'next/link';

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = getPostMetaList();
  const tTags = await getTranslations('tags');
  const tHome = await getTranslations('home');

  const tree = buildCategoryTree(posts);
  const topCategories = Array.from(tree.children.values()).map((cat) => {
    const count = Array.from(cat.children.values()).reduce(
      (sum, child) => sum + child.posts.length,
      cat.posts.length
    );
    return { name: cat.name, count };
  });

  const tagMap = getAllTags(posts);
  const sortedTags = Array.from(tagMap.entries()).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Title - fixed */}
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-mono">
          {'>'} Lain&apos;s Blog
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          // exploring technology, one post at a time
        </p>
      </div>

      {/* Grid - fills remaining space */}
      <div className="flex-1 min-h-0 grid lg:grid-cols-[1fr_280px] gap-8 items-start">
        {/* Left: scrollable post list */}
        <div className="min-h-0 overflow-y-auto pb-8">
          <HomePostList
            posts={posts}
            categories={topCategories}
            allLabel={tHome('allCategories')}
          />
          <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Lain · Built with Next.js &amp; TypeScript
          </footer>
        </div>

        {/* Right: fixed sidebar (lg only) */}
        <aside className="hidden lg:flex lg:flex-col gap-6 shrink-0">
          {/* Stats */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-blue-500">#</span>
              博客统计
            </h3>
            <BlogStats posts={posts} />
          </div>

          {/* Tags */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex-1 min-h-0 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2 shrink-0">
              <span className="text-blue-500">#</span>
              {tTags('title')}
            </h3>
            <div className="flex flex-wrap gap-1.5 overflow-y-auto flex-1 min-h-0">
              {sortedTags.map(([tag, tagPosts]) => (
                <Link
                  key={tag}
                  href={`/${locale}/tags/${tag}`}
                  className="px-2.5 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  #{tag}
                  <span className="ml-0.5 text-gray-400 dark:text-gray-500">{tagPosts.length}</span>
                </Link>
              ))}
            </div>
            <Link
              href={`/${locale}/tags`}
              className="mt-3 inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
            >
              {tTags('allTags')} →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
