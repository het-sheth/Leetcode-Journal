'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, RotateCcw } from 'lucide-react';

type Status = 'UNSOLVED' | 'SOLVED' | 'REVISIT';

const statusCycle: Status[] = ['UNSOLVED', 'SOLVED', 'REVISIT'];

interface StatusToggleProps {
  status: Status;
  onToggle: (newStatus: Status) => void;
  size?: 'sm' | 'md';
}

export function StatusToggle({ status, onToggle, size = 'sm' }: StatusToggleProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = statusCycle.indexOf(status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    onToggle(nextStatus);
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <button
      onClick={handleClick}
      className={cn(
        'rounded-full p-1 transition-colors',
        status === 'SOLVED' && 'text-green-500 hover:text-green-600',
        status === 'REVISIT' && 'text-yellow-500 hover:text-yellow-600',
        status === 'UNSOLVED' && 'text-neutral-400 hover:text-neutral-500'
      )}
      title={`Status: ${status} (click to change)`}
    >
      {status === 'SOLVED' && <CheckCircle2 className={iconSize} />}
      {status === 'REVISIT' && <RotateCcw className={iconSize} />}
      {status === 'UNSOLVED' && <Circle className={iconSize} />}
    </button>
  );
}
