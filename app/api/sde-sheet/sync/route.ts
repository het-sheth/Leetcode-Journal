import prisma from '@/lib/database/prismaClient';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { queryLeetCodeAPI } from '@/utils/leetcode/queryLeetCodeAPI';
import recentAcSubmitQuery from '@/GQL_Queries/recentAcSubmit';

export async function POST() {
  try {
    const supabase = await createClient();
    const supabaseId = (await supabase.auth.getUser()).data.user?.id;

    if (!supabaseId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { supabaseId } });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!user.leetcodeUsername) {
      return NextResponse.json({ message: 'LeetCode username not set' }, { status: 400 });
    }

    // Fetch recent accepted submissions from LeetCode
    const response = await queryLeetCodeAPI(recentAcSubmitQuery, {
      username: user.leetcodeUsername,
      limit: 200,
    });

    const acSubmissions = response.data.recentAcSubmissionList ?? [];

    // Build set of accepted title slugs
    const acSlugs = new Set<string>(acSubmissions.map((s: { titleSlug: string }) => s.titleSlug));

    // Get all SDE sheet problems
    const sdeProblems = await prisma.sdeSheetProblem.findMany();

    // Match and upsert progress
    let syncedCount = 0;
    for (const problem of sdeProblems) {
      if (acSlugs.has(problem.titleSlug)) {
        const existing = await prisma.userSdeProgress.findUnique({
          where: { userId_problemId: { userId: user.id, problemId: problem.id } },
        });

        if (!existing || existing.status !== 'SOLVED') {
          const journalTemplate = existing?.notes
            ? undefined
            : `## Approach\n\n\n## Time Complexity\n\n\n## Space Complexity\n\n\n## Key Insights\n\n\n## Mistakes / Edge Cases\n`;

          await prisma.userSdeProgress.upsert({
            where: { userId_problemId: { userId: user.id, problemId: problem.id } },
            update: {
              status: 'SOLVED',
              solvedAt: existing?.solvedAt ?? new Date(),
              language: acSubmissions.find((s: { titleSlug: string }) => s.titleSlug === problem.titleSlug)?.lang ?? null,
              notes: journalTemplate ?? existing?.notes,
            },
            create: {
              userId: user.id,
              problemId: problem.id,
              status: 'SOLVED',
              solvedAt: new Date(),
              language: acSubmissions.find((s: { titleSlug: string }) => s.titleSlug === problem.titleSlug)?.lang ?? null,
              notes: journalTemplate ?? '',
            },
          });
          syncedCount++;
        }
      }
    }

    // Record sync history
    await prisma.syncHistory.create({
      data: {
        userId: user.id,
        problemsSynced: syncedCount,
      },
    });

    return NextResponse.json(
      { message: `Synced ${syncedCount} problems`, problemsSynced: syncedCount },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error syncing with LeetCode:', err);
    return NextResponse.json({ message: 'Error syncing with LeetCode' }, { status: 500 });
  }
}
