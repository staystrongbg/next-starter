/**
 * Client-safe constants — no `server-only` and no `env` import.
 * Safe to import from any Client Component.
 */
export const LINKS: { href: string; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/test', label: 'Hono' },
];

// getPasswordStrength() returns score 0-4 (max 4). Keep constant aligned.
export const MAX_PASSWORD_STRENGTH = 4;
export const MIN_PASSWORD_STRENGTH_SCORE = 2;
