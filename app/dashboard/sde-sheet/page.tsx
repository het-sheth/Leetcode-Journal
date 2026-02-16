'use client';

import { useEffect } from 'react';
import { useSdeSheetStore } from '@/store/SdeSheetStore/useSdeSheetStore';
import { SdeSheetOverview } from '@/components/sdeSheet/SdeSheetOverview';
import { CategoryAccordion } from '@/components/sdeSheet/CategoryAccordion';
import { Skeleton } from '@/components/ui/skeleton';

export default function SdeSheetPage() {
  const { categories, isLoading, fetchProblems } = useSdeSheetStore();

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-20 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <SdeSheetOverview />
      <CategoryAccordion categories={categories} />
    </div>
  );
}
