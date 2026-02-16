import prisma from '@/lib/database/prismaClient';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
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

    const problems = await prisma.sdeSheetProblem.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        userProgress: {
          where: { userId: user.id },
          select: {
            id: true,
            status: true,
            solvedAt: true,
            language: true,
            notes: true,
            retryDate: true,
          },
        },
      },
    });

    // Group by category
    const grouped: Record<string, typeof problems> = {};
    for (const problem of problems) {
      if (!grouped[problem.category]) {
        grouped[problem.category] = [];
      }
      grouped[problem.category].push(problem);
    }

    // Convert to array of categories
    const categories = Object.entries(grouped).map(([name, problems]) => ({
      name,
      problems: problems.map((p) => ({
        id: p.id,
        problemName: p.problemName,
        titleSlug: p.titleSlug,
        leetcodeUrl: p.leetcodeUrl,
        gfgUrl: p.gfgUrl,
        youtubeUrl: p.youtubeUrl,
        articleUrl: p.articleUrl,
        difficulty: p.difficulty,
        orderIndex: p.orderIndex,
        status: p.userProgress[0]?.status ?? 'UNSOLVED',
        progressId: p.userProgress[0]?.id ?? null,
        solvedAt: p.userProgress[0]?.solvedAt ?? null,
        hasNotes: !!p.userProgress[0]?.notes,
      })),
      solved: problems.filter((p) => p.userProgress[0]?.status === 'SOLVED').length,
      total: problems.length,
    }));

    const totalSolved = categories.reduce((acc, c) => acc + c.solved, 0);
    const totalProblems = categories.reduce((acc, c) => acc + c.total, 0);

    return NextResponse.json({ categories, totalSolved, totalProblems }, { status: 200 });
  } catch (err) {
    console.error('Error fetching SDE sheet problems:', err);
    return NextResponse.json({ message: 'Error fetching problems' }, { status: 500 });
  }
}
