import React from 'react';
import { motion } from 'motion/react';
import { CATEGORY_DESCRIPTIONS } from '../../data/interiorProjects';

export type FilterCategory =
  | 'All'
  | 'Residential Space'
  | 'Residential'
  | 'Commercial'
  | 'Store'
  | 'Hospitality'
  | 'Thesis'
  | 'Thesis Project';

interface FilterBarProps {
  activeFilter: FilterCategory;
  onFilterChange: (category: FilterCategory) => void;
  counts: Record<string, number>;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

const CATEGORIES: FilterCategory[] = [
  'All',
  'Residential Space',
  'Commercial',
  'Hospitality',
  'Thesis',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onFilterChange,
  counts,
  onCursorChange,
}) => {
  return (
    <div
      id="work-filter-sticky-bar"
      className="sticky top-20 z-30 -mx-6 md:-mx-12 px-6 md:px-12 py-4 bg-[#FFFFFF]/90 backdrop-blur-md border-y border-[#E5E3DD] transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* ARIA Accessible Tablist */}
        <div
          role="tablist"
          aria-label="Filter interior design projects by category"
          className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto pb-1 scrollbar-none"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeFilter === category;
            const count = counts[category] ?? 0;

            return (
              <button
                key={category}
                role="tab"
                id={`filter-tab-${category.toLowerCase().replace(/\s+/g, '-')}`}
                aria-selected={isActive}
                aria-controls="work-projects-grid"
                tabIndex={isActive ? 0 : -1}
                onClick={() => onFilterChange(category)}
                onMouseEnter={() => onCursorChange?.('link')}
                onMouseLeave={() => onCursorChange?.('default')}
                className={`relative px-3 sm:px-4 py-2 text-xs md:text-sm font-mono-code whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A47E] rounded-sm flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#141413] font-medium'
                    : 'text-[#7A7770] hover:text-[#141413]'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[11px] tabular-nums transition-colors ${
                    isActive ? 'text-[#C9A47E]' : 'text-[#A09E96]'
                  }`}
                >
                  ({count})
                </span>

                {/* Animated active category underline in accent color #C9A47E */}
                {isActive && (
                  <motion.div
                    layoutId="activeFilterUnderline"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#C9A47E]"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Category-Specific Differentiating Subtitle */}
        <div className="pt-1 overflow-hidden min-h-[22px]">
          <motion.p
            key={activeFilter}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs md:text-sm font-serif italic text-[#6E6C65] tracking-wide"
          >
            {CATEGORY_DESCRIPTIONS[activeFilter]}
          </motion.p>
        </div>
      </div>
    </div>
  );
};
