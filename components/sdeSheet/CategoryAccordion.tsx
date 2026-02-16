'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SdeCategory } from '@/store/SdeSheetStore/useSdeSheetStore';
import { ProblemRow } from './ProblemRow';

interface CategoryAccordionProps {
  categories: SdeCategory[];
}

export function CategoryAccordion({ categories }: CategoryAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {categories.map((category) => {
        const percentage =
          category.total > 0
            ? Math.round((category.solved / category.total) * 100)
            : 0;

        return (
          <AccordionItem
            key={category.name}
            value={category.name}
            className="border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-4 flex-1 mr-4">
                <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">
                  {category.name}
                </span>
                <span className="text-xs text-neutral-500">
                  {category.solved}/{category.total}
                </span>
                <div className="flex-1 max-w-[200px] h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {category.problems.map((problem) => (
                  <ProblemRow key={problem.id} problem={problem} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
