import { PrismaClient } from '@prisma/client';
import problems from './seed-data/sde-sheet-problems.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SDE Sheet problems...');

  for (const problem of problems) {
    await prisma.sdeSheetProblem.upsert({
      where: { titleSlug: problem.titleSlug },
      update: {
        category: problem.category,
        problemName: problem.problemName,
        leetcodeUrl: problem.leetcodeUrl ?? null,
        gfgUrl: problem.gfgUrl ?? null,
        youtubeUrl: problem.youtubeUrl ?? null,
        articleUrl: problem.articleUrl ?? null,
        difficulty: problem.difficulty ?? null,
        orderIndex: problem.orderIndex,
      },
      create: {
        category: problem.category,
        problemName: problem.problemName,
        titleSlug: problem.titleSlug,
        leetcodeUrl: problem.leetcodeUrl ?? null,
        gfgUrl: problem.gfgUrl ?? null,
        youtubeUrl: problem.youtubeUrl ?? null,
        articleUrl: problem.articleUrl ?? null,
        difficulty: problem.difficulty ?? null,
        orderIndex: problem.orderIndex,
      },
    });
  }

  console.log(`Seeded ${problems.length} SDE Sheet problems.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
