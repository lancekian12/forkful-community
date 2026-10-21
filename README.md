# Forkful

A community cookbook: browse home recipes, filter and search them, cook from an ingredient checklist, like and review dishes, and share your own with a photo.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **Tailwind CSS v4** with light/dark design tokens (`app/globals.css`)
- **Drizzle ORM + Turso** (libSQL, SQLite-compatible) — schema in `db/schema.ts`, migrations in `db/migrations`
- **Vercel Blob** for uploaded photos
- **Zod** for form validation (`lib/validation.ts`)

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` (and `npm run build`) first runs `db:setup`, which applies migrations and seeds starter recipes if the DB is empty. With no env vars set, it uses a local SQLite file (`data/food.db`) and stores uploads in `data/uploads`. Open http://localhost:3000.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run db:setup` | Apply migrations, seed if empty |
| `npm run db:reset` | Wipe all data and reseed |
| `npm run db:generate` | Create a migration after editing `db/schema.ts` |
| `npm run db:studio` | Browse the DB in Drizzle Studio |
| `npm run typecheck` / `npm run lint` | Static checks |

## Where things live

- `app/` — routes: `/`, `/meals` (search, category, sort via URL params), `/meals/[mealSlug]`, `/meals/share`, `/community`
- `lib/queries.ts` — read queries; `lib/actions.ts` — Server Actions (share, review, like, subscribe)
- `components/` — UI
- `lib/storage.ts` — saves uploads to Vercel Blob, or to `data/uploads` locally (served by `app/uploads/[file]/route.ts`)
- `data/` — local SQLite DB and uploads (git-ignored)

## Deploying to Vercel

Vercel's filesystem isn't persistent, so production needs Turso and Vercel Blob (both have free tiers).

1. Create a Turso database:
   ```bash
   turso db create forkful
   turso db show forkful --url
   turso db tokens create forkful
   ```
2. In the Vercel project, add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` env vars.
3. In the Vercel project's **Storage** tab, create a Blob store and connect it. That adds `BLOB_READ_WRITE_TOKEN` automatically.
4. Deploy. The build runs migrations and seeds the database on first deploy.

See `.env.example` for all variables.

Likes are tied to an anonymous browser cookie; there are no user accounts yet.
