import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getPostMetaList, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import Link from 'next/link';

export function generateStaticParams() {
  const posts = getPostMetaList();
  const tagMap = getAllTags(posts);
  const locales = ['zh', 'en'];
  return locales.flatMap((locale) =>
    Array.from(tagMap.keys()).map((tag) => ({ locale, tag }))
  );
}

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  setRequestLocale(locale);
  const t = await getTranslations('tags');

  const posts = getPostMetaList();
  const tagMap = getAllTags(posts);
  const tagPosts = tagMap.get(tag);

  if (!tagPosts) notFound();

  return (
    <div>
      <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <Link href={`/${locale}/tags`} className="hover:text-blue-600 dark:hover:text-blue-400">
          {t('allTags')}
        </Link>
        {' / '}
        <span className="text-gray-900 dark:text-white">#{tag}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        <span className="text-blue-500">#</span> #{tag}
      </h1>

      <div className="grid gap-4">
        {tagPosts.map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} />
        ))}
      </div>
    </div>
  );
}
