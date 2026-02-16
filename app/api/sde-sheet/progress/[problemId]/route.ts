import prisma from '@/lib/database/prismaClient';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const { problemId } = await params;
    const supabase = await createClient();
    const supabaseId = (await supabase.auth.getUser()).data.user?.id;

    if (!supabaseId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { supabaseId } });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const problem = await prisma.sdeSheetProblem.findUnique({
      where: { id: problemId },
      include: {
        userProgress: {
          where: { userId: user.id },
        },
      },
    });

    if (!problem) {
      return NextResponse.json({ message: 'Problem not found' }, { status: 404 });
    }

    const progress = problem.userProgress[0] ?? null;

    return NextResponse.json({
      problem: {
        id: problem.id,
        category: problem.category,
        problemName: problem.problemName,
        titleSlug: problem.titleSlug,
        leetcodeUrl: problem.leetcodeUrl,
        gfgUrl: problem.gfgUrl,
        youtubeUrl: problem.youtubeUrl,
        articleUrl: problem.articleUrl,
        difficulty: problem.difficulty,
      },
      progress: progress
        ? {
            id: progress.id,
            status: progress.status,
            solvedAt: progress.solvedAt,
            language: progress.language,
            notes: progress.notes,
            approach: progress.approach,
            timeComplexity: progress.timeComplexity,
            spaceComplexity: progress.spaceComplexity,
            retryDate: progress.retryDate,
          }
        : null,
    });
  } catch (err) {
    console.error('Error fetching problem progress:', err);
    return NextResponse.json({ message: 'Error fetching progress' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const { problemId } = await params;
    const supabase = await createClient();
    const supabaseId = (await supabase.auth.getUser()).data.user?.id;

    if (!supabaseId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { supabaseId } });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { status, notes, approach, timeComplexity, spaceComplexity, retryDate, language } = body;

    const progress = await prisma.userSdeProgress.upsert({
      where: { userId_problemId: { userId: user.id, problemId } },
      update: {
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
        ...(approach !== undefined && { approach }),
        ...(timeComplexity !== undefined && { timeComplexity }),
        ...(spaceComplexity !== undefined && { spaceComplexity }),
        ...(retryDate !== undefined && { retryDate: retryDate ? new Date(retryDate) : null }),
        ...(language !== undefined && { language }),
        ...(status === 'SOLVED' && { solvedAt: new Date() }),
      },
      create: {
        userId: user.id,
        problemId,
        status: status ?? 'UNSOLVED',
        notes: notes ?? '',
        approach: approach ?? '',
        timeComplexity: timeComplexity ?? '',
        spaceComplexity: spaceComplexity ?? '',
        retryDate: retryDate ? new Date(retryDate) : null,
        language: language ?? null,
        ...(status === 'SOLVED' && { solvedAt: new Date() }),
      },
    });

    return NextResponse.json({ progress }, { status: 200 });
  } catch (err) {
    console.error('Error updating progress:', err);
    return NextResponse.json({ message: 'Error updating progress' }, { status: 500 });
  }
}
