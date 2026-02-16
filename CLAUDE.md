# Leetcode-Journal + Striver SDE Sheet

## Project Overview
Fork of [yashksaini-coder/Leetcode-Journal](https://github.com/yashksaini-coder/Leetcode-Journal) extended with Striver SDE Sheet tracking, auto-sync with LeetCode, and per-problem journaling.

## Tech Stack
- **Framework**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Supabase
- **State**: Zustand
- **Deployment**: Vercel + Supabase free tier

## Setup
```bash
npm install
cp .env.example .env   # Fill in real values
npx prisma migrate dev --name init
npx prisma db seed     # Seeds 145 SDE Sheet problems
npm run dev
```

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `DATABASE_URL` — PostgreSQL connection string (Supabase or local)

## Key Directories
- `prisma/` — Schema, migrations, seed data (145 SDE problems in `seed-data/`)
- `app/api/sde-sheet/` — API routes for problems, sync, progress
- `app/dashboard/sde-sheet/` — SDE Sheet dashboard and problem journal pages
- `components/sdeSheet/` — UI components (CategoryAccordion, ProblemRow, StatusToggle, JournalEditor)
- `store/SdeSheetStore/` — Zustand store for SDE Sheet state
- `GQL_Queries/` — LeetCode GraphQL queries (reused for sync)
- `utils/leetcode/` — LeetCode API helpers

## Database Models (added)
- `SdeSheetProblem` — 145 pre-loaded problems with category, links, difficulty
- `UserSdeProgress` — Per-user progress: status (UNSOLVED/SOLVED/REVISIT), notes, approach, complexities
- `SyncHistory` — Tracks LeetCode sync events

## API Routes (added)
| Route | Method | Purpose |
|---|---|---|
| `/api/sde-sheet/problems` | GET | All problems grouped by category with user progress |
| `/api/sde-sheet/sync` | POST | Auto-sync solved problems from LeetCode |
| `/api/sde-sheet/progress/[problemId]` | GET | Fetch problem detail + journal |
| `/api/sde-sheet/progress/[problemId]` | PUT | Update status, notes, approach, complexities |

## Git Commit Preferences
- Do NOT add Co-Authored-By lines to any commits

## Build & Deploy
```bash
# Build (Vercel)
npx prisma migrate deploy && npx prisma generate && next build

# Seed production DB (run once)
npx prisma db seed
```
