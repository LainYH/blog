'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current) return;

    // Clear existing giscus
    ref.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'Lainnevergiveup/blog');
    script.setAttribute('data-repo-id', 'R_kgDOSBQOkw');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOSBQOk84C63vo');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', 'zh-CN');
    script.crossOrigin = 'anonymous';
    script.async = true;

    ref.current.appendChild(script);
  }, [resolvedTheme]);

  return (
    <div className="mt-12">
      <div ref={ref} />
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Giscus comments: Replace REPO_ID and CATEGORY_ID in src/components/GiscusComments.tsx after enabling GitHub Discussions.
      </p>
    </div>
  );
}
