'use client';

import { useState, useMemo } from 'react';
import type { PostMeta } from '@/lib/types';
import { CategoryFilter } from './CategoryFilter';
import { Pagination } from './Pagination';

interface Category {
  name: string;
  count: number;
}

interface HomePostListProps {
  posts: PostMeta[];
  categories: Category[];
  allLabel: string;
}

export function HomePostList({ posts, categories, allLabel }: HomePostListProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const filteredPosts = useMemo(() => {
    if (selected.length === 0) return posts;
    return posts.filter((p) => selected.includes(p.categoryPath[0]));
  }, [posts, selected]);

  return (
    <div className="space-y-6">
      <CategoryFilter
        categories={categories}
        selected={selected}
        onChange={setSelected}
        allLabel={allLabel}
      />
      <Pagination key={selected.join(',')} posts={filteredPosts} />
    </div>
  );
}
