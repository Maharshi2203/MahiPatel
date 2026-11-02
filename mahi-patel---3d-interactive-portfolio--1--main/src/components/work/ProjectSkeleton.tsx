import React from 'react';
import { motion } from 'motion/react';

export const ProjectSkeletonGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-pulse">
      {/* 1 Large Wide Skeleton */}
      <div className="col-span-1 md:col-span-2 aspect-[16/9] bg-[#F0EDE6] rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E5E2DA]/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* 2 Standard Skeletons */}
      <div className="col-span-1 aspect-[4/5] bg-[#F0EDE6] rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E5E2DA]/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
      <div className="col-span-1 aspect-[4/5] bg-[#F0EDE6] rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E5E2DA]/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>
    </div>
  );
};

interface EmptyCategoryProps {
  category: string;
}

export const EmptyCategoryState: React.FC<EmptyCategoryProps> = ({ category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="py-24 text-center border border-dashed border-[#E5E3DD] rounded-sm bg-[#FAF8F5]/60 max-w-xl mx-auto my-12"
    >
      <div className="space-y-3">
        <p className="font-mono-code text-xs uppercase tracking-widest text-[#9A773E]">
          Index Archive
        </p>
        <h4 className="font-serif italic text-xl md:text-2xl text-[#141413]">
          New {category} work coming soon
        </h4>
        <p className="text-xs font-mono-code text-[#7A7770] max-w-sm mx-auto">
          Currently documenting active projects, spatial drawings, and material specifications.
        </p>
      </div>
    </motion.div>
  );
};
