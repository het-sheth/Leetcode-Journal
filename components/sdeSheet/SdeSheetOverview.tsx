'use client';

import { Button } from '@/components/ui/button';
import { useSdeSheetStore } from '@/store/SdeSheetStore/useSdeSheetStore';
import { RefreshCw } from 'lucide-react';

export function SdeSheetOverview() {
  const { totalSolved, totalProblems, isSyncing, lastSynced, syncWithLeetCode } =
    useSdeSheetStore();

  const percentage =
    totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
            Striver SDE Sheet
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {totalSolved}/{totalProblems} solved — {percentage}%
          </p>
        </div>
        <div className="w-32 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {lastSynced && (
          <span className="text-xs text-neutral-400">
            Last sync: {new Date(lastSynced).toLocaleTimeString()}
          </span>
        )}
        <Button
          onClick={syncWithLeetCode}
          disabled={isSyncing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync with LeetCode'}
        </Button>
      </div>
    </div>
  );
}
