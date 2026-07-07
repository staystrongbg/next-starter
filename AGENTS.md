# Agent Instructions for next-starter

## Environment Setup

- **Database URL**: Set in `.env` as `DATABASE_URL="postgresql://..."` (Neon PostgreSQL)
- **Auth secret**: `BETTER_AUTH_SECRET="HiIX74SFC4HicrpJO8kGDTdCsqW6RUhk"`
- **Base URL**: `BETTER_AUTH_URL="http://localhost:3000"`
- **Email configuration**: Set `NODEMAILER_EMAIL` and `EMAIL_FROM` in `.env`

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier formatting

## Database Operations

- `npm run db:push` - Push schema changes and generate client
- `npm run db:studio` - Open database Studio (requires free tier account or local setup)

## Key Code Structure

- **Root layout**: `src/app/layout.tsx` - App providers and global setup
- **Providers**: `src/providers.tsx` - QueryClient for TanStack Query
- **Auth**: `src/lib/auth.ts` - Better Auth configuration with PostgreSQL
- **Prisma**: Generated in `src/generated/prisma/`
- **Theme**: `next-themes` with system preference support
- **Notifications**: Sonner toasts positioned bottom-right

## Build Artifacts

- `.next/` - Next.js build output
- `prisma/migrations/` - Database migration history
- `tsconfig.tsbuildinfo` - TypeScript incremental compilation cache

## Auth Flow

- Email verification required on sign-up
- Password reset emails sent via Nodemailer
- Social providers (GitHub, Google) disabled by default
- Email change requires verification

## Testing Notes

- Query data fetching uses TanStack Query
- Forms use react-hook-form with Zod validation
- Error handling centralized across mutations
- Session management through Better Auth middleware

## Tailwind Configuration

- CSS: `src/app/globals.css`
- Configured via `components.json` with new-york style
- Uses Tailwind CSS v4 with tw-animate-css plugin

## React Compiler

- React Compiler enabled via `reactCompiler: true` in next.config.ts
- Experimental optimizations for React rendering

## VS Code Settings

- Auto-format on save: `"editor.formatOnSave": true`
- Auto-fixes on save: `"source.fixAll": "always"`
- Auto-organize imports: `"source.organizeImports": "always"`

## Architecture Notes

- Hybrid app/router pattern (`src/app/`)
- Component architecture with UI primitives in `src/components/ui/`
- Shared logic in `src/lib/`, hooks in `src/app/hooks/`
- Custom providers wrapper around QueryClient
