import axios from 'axios';
import { create } from 'zustand';

export interface SdeProblem {
  id: string;
  problemName: string;
  titleSlug: string;
  leetcodeUrl: string | null;
  gfgUrl: string | null;
  youtubeUrl: string | null;
  articleUrl: string | null;
  difficulty: string | null;
  orderIndex: number;
  status: 'UNSOLVED' | 'SOLVED' | 'REVISIT';
  progressId: string | null;
  solvedAt: string | null;
  hasNotes: boolean;
}

export interface SdeCategory {
  name: string;
  problems: SdeProblem[];
  solved: number;
  total: number;
}

interface SdeSheetStore {
  categories: SdeCategory[];
  totalSolved: number;
  totalProblems: number;
  isLoading: boolean;
  isSyncing: boolean;
  lastSynced: string | null;
  error: string | null;
  fetchProblems: () => Promise<void>;
  syncWithLeetCode: () => Promise<{ problemsSynced: number } | null>;
  updateProgress: (
    problemId: string,
    data: Record<string, unknown>
  ) => Promise<void>;
}

export const useSdeSheetStore = create<SdeSheetStore>((set, get) => ({
  categories: [],
  totalSolved: 0,
  totalProblems: 0,
  isLoading: false,
  isSyncing: false,
  lastSynced: null,
  error: null,

  fetchProblems: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get('/api/sde-sheet/problems');
      set({
        categories: response.data.categories,
        totalSolved: response.data.totalSolved,
        totalProblems: response.data.totalProblems,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch SDE sheet problems', isLoading: false });
      console.error(error);
    }
  },

  syncWithLeetCode: async () => {
    try {
      set({ isSyncing: true, error: null });
      const response = await axios.post('/api/sde-sheet/sync');
      set({ lastSynced: new Date().toISOString(), isSyncing: false });
      await get().fetchProblems();
      return { problemsSynced: response.data.problemsSynced };
    } catch (error) {
      set({ error: 'Failed to sync with LeetCode', isSyncing: false });
      console.error(error);
      return null;
    }
  },

  updateProgress: async (problemId: string, data: Record<string, unknown>) => {
    try {
      await axios.put(`/api/sde-sheet/progress/${problemId}`, data);
      await get().fetchProblems();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  },
}));
