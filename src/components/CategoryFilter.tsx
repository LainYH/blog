'use client';

interface Category {
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string[];
  onChange: (selected: string[]) => void;
  allLabel: string;
}

export function CategoryFilter({ categories, selected, onChange, allLabel }: CategoryFilterProps) {
  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((c) => c !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  const isActive = selected.length === 0;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange([])}
        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
          isActive
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {allLabel}
      </button>
      {categories.map((cat) => {
        const active = selected.includes(cat.name);
        return (
          <button
            key={cat.name}
            onClick={() => toggle(cat.name)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              active
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {cat.name}
            <span className={`ml-1 ${active ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
