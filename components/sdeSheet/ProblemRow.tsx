'use client';

import { Badge } from '@/components/ui/badge';
import { SdeProblem, useSdeSheetStore } from '@/store/SdeSheetStore/useSdeSheetStore';
import { ExternalLink, FileText, BookOpen, Youtube } from 'lucide-react';
import Link from 'next/link';
import { StatusToggle } from './StatusToggle';

interface ProblemRowProps {
  problem: SdeProblem;
}

export function ProblemRow({ problem }: ProblemRowProps) {
  const updateProgress = useSdeSheetStore((s) => s.updateProgress);

  const handleStatusToggle = (newStatus: 'UNSOLVED' | 'SOLVED' | 'REVISIT') => {
    updateProgress(problem.id, { status: newStatus });
  };

  const difficultyColor =
    problem.difficulty === 'Easy'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : problem.difficulty === 'Medium'
      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
      <StatusToggle status={problem.status} onToggle={handleStatusToggle} />

      <Link
        href={`/dashboard/sde-sheet/${problem.id}`}
        className="flex-1 min-w-0 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 truncate"
      >
        {problem.problemName}
      </Link>

      {problem.difficulty && (
        <Badge className={`${difficultyColor} text-[10px] px-2 py-0 shrink-0`}>
          {problem.difficulty}
        </Badge>
      )}

      <div className="flex items-center gap-1.5 shrink-0">
        {(problem.leetcodeUrl || problem.gfgUrl) && (
          <a
            href={problem.leetcodeUrl ?? problem.gfgUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-blue-500 transition-colors"
            title={problem.leetcodeUrl ? 'LeetCode' : 'GeeksForGeeks'}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        {problem.youtubeUrl && (
          <a
            href={problem.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-red-500 transition-colors"
            title="YouTube Solution"
            onClick={(e) => e.stopPropagation()}
          >
            <Youtube className="h-3.5 w-3.5" />
          </a>
        )}
        {problem.articleUrl && (
          <a
            href={problem.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-orange-500 transition-colors"
            title="Article"
            onClick={(e) => e.stopPropagation()}
          >
            <BookOpen className="h-3.5 w-3.5" />
          </a>
        )}
        <Link
          href={`/dashboard/sde-sheet/${problem.id}`}
          className="text-neutral-400 hover:text-purple-500 transition-colors"
          title="Journal"
          onClick={(e) => e.stopPropagation()}
        >
          <FileText className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
