'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JournalEditor } from '@/components/sdeSheet/JournalEditor';
import { StatusToggle } from '@/components/sdeSheet/StatusToggle';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  ExternalLink,
  Youtube,
  BookOpen,
  Save,
} from 'lucide-react';

interface ProblemDetail {
  id: string;
  category: string;
  problemName: string;
  titleSlug: string;
  leetcodeUrl: string | null;
  gfgUrl: string | null;
  youtubeUrl: string | null;
  articleUrl: string | null;
  difficulty: string | null;
}

interface ProgressDetail {
  id: string;
  status: 'UNSOLVED' | 'SOLVED' | 'REVISIT';
  solvedAt: string | null;
  language: string | null;
  notes: string | null;
  approach: string | null;
  timeComplexity: string | null;
  spaceComplexity: string | null;
  retryDate: string | null;
}

const JOURNAL_TEMPLATE = `## Approach\n\n\n## Time Complexity\n\n\n## Space Complexity\n\n\n## Key Insights\n\n\n## Mistakes / Edge Cases\n`;

export default function ProblemJournalPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.problemId as string;

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [status, setStatus] = useState<'UNSOLVED' | 'SOLVED' | 'REVISIT'>('UNSOLVED');
  const [notes, setNotes] = useState('');
  const [approach, setApproach] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('');
  const [spaceComplexity, setSpaceComplexity] = useState('');
  const [retryDate, setRetryDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`/api/sde-sheet/progress/${problemId}`);
      setProblem(res.data.problem);
      const progress: ProgressDetail | null = res.data.progress;
      if (progress) {
        setStatus(progress.status);
        setNotes(progress.notes ?? '');
        setApproach(progress.approach ?? '');
        setTimeComplexity(progress.timeComplexity ?? '');
        setSpaceComplexity(progress.spaceComplexity ?? '');
        setRetryDate(progress.retryDate ? progress.retryDate.split('T')[0] : '');
      } else {
        setNotes(JOURNAL_TEMPLATE);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/sde-sheet/progress/${problemId}`, {
        status,
        notes,
        approach,
        timeComplexity,
        spaceComplexity,
        retryDate: retryDate || null,
      });
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (newStatus: 'UNSOLVED' | 'SOLVED' | 'REVISIT') => {
    setStatus(newStatus);
    try {
      await axios.put(`/api/sde-sheet/progress/${problemId}`, { status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-4">
        <p className="text-neutral-500">Problem not found.</p>
      </div>
    );
  }

  const difficultyColor =
    problem.difficulty === 'Easy'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : problem.difficulty === 'Medium'
      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => router.push('/dashboard/sde-sheet')}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to SDE Sheet
      </button>

      {/* Problem Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <StatusToggle status={status} onToggle={handleStatusToggle} size="md" />
              <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                {problem.problemName}
              </h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-neutral-500">{problem.category}</span>
              {problem.difficulty && (
                <Badge className={`${difficultyColor} text-xs`}>
                  {problem.difficulty}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Resource Links */}
        <div className="flex items-center gap-3 mt-4">
          {(problem.leetcodeUrl || problem.gfgUrl) && (
            <a
              href={problem.leetcodeUrl ?? problem.gfgUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {problem.leetcodeUrl ? 'LeetCode' : 'GeeksForGeeks'}
            </a>
          )}
          {problem.youtubeUrl && (
            <a
              href={problem.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600"
            >
              <Youtube className="h-3.5 w-3.5" />
              YouTube
            </a>
          )}
          {problem.articleUrl && (
            <a
              href={problem.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Article
            </a>
          )}
        </div>
      </div>

      {/* Structured Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Approach
          </label>
          <input
            type="text"
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Two Pointers, Binary Search"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Time Complexity
          </label>
          <input
            type="text"
            value={timeComplexity}
            onChange={(e) => setTimeComplexity(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. O(n log n)"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">
            Space Complexity
          </label>
          <input
            type="text"
            value={spaceComplexity}
            onChange={(e) => setSpaceComplexity(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. O(1)"
          />
        </div>
      </div>

      {/* Retry Date */}
      <div className="max-w-xs">
        <label className="block text-xs font-medium text-neutral-500 mb-1">
          Retry Date
        </label>
        <input
          type="date"
          value={retryDate}
          onChange={(e) => setRetryDate(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Journal Editor */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-2">
          Notes (Markdown)
        </label>
        <JournalEditor value={notes} onChange={setNotes} />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
