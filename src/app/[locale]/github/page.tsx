import { setRequestLocale } from 'next-intl/server';
import { GitHubRepos } from '@/components/GitHubRepos';

export function generateStaticParams() {
  return [{ locale: 'zh' }, { locale: 'en' }];
}

export default async function GitHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <GitHubRepos username="LainYH" />
    </div>
  );
}
