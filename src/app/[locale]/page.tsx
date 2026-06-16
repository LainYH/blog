import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getPostMetaList, buildCategoryTree, getAllTags } from '@/lib/posts';
import { Pagination } from '@/components/Pagination';
import { BlogStats } from '@/components/BlogStats';
import Link from 'next/link';

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = getPostMetaList();
  const t = await getTranslations('home');
  const tCat = await getTranslations('categories');
  const tTags = await getTranslations('tags');

  const tree = buildCategoryTree(posts);
  const tagMap = getAllTags(posts);
  const sortedTags = Array.from(tagMap.entries()).sort((a, b) => b[1].length - a[1].length);
  const topCategories = Array.from(tree.children.values());

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-mono">
          {'>'} Lain&apos;s Blog
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          // exploring technology, one post at a time
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        {/* Main content */}
        <div>
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="text-blue-500">#</span>
              {t('latestPosts')}
            </h2>
            <Pagination posts={posts} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Stats */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-blue-500">#</span>
              博客统计
            </h3>
            <BlogStats posts={posts} />
          </div>

          {/* Categories */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-blue-500">#</span>
              {tCat('title')}
            </h3>
            <div className="space-y-1">
              {topCategories.map((cat) => {
                const count = Array.from(cat.children.values()).reduce(
                  (sum, child) => sum + child.posts.length,
                  cat.posts.length
                );
                return (
                  <Link
                    key={cat.slug}
                    href={`/${locale}/categories/${encodeURIComponent(cat.slug)}`}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{count}</span>
                  </Link>
                );
              })}
            </div>
            <Link
              href={`/${locale}/categories`}
              className="mt-3 inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {tCat('allCategories')} →
            </Link>
          </div>

          {/* Tags */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-blue-500">#</span>
              {tTags('title')}
            </h3>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
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
              className="mt-3 inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {tTags('allTags')} →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
