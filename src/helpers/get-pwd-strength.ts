export type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string; color: string };

export function getPasswordStrength(pw: string): Strength {
  if (!pw) return { score: 0, label: 'Too weak', color: 'bg-red-500' };

  let score = 0;
  const length = pw.length;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);

  if (length >= 8) score++;
  if (length >= 12) score++;
  const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (variety >= 2) score++;
  if (variety >= 3) score++;

  const results: Record<number, Strength> = {
    0: { score: 0, label: 'Too weak', color: 'bg-red-500' },
    1: { score: 1, label: 'Weak', color: 'bg-red-500' },
    2: { score: 2, label: 'Fair', color: 'bg-yellow-500' },
    3: { score: 3, label: 'Good', color: 'bg-green-500' },
    4: { score: 4, label: 'Strong', color: 'bg-emerald-600' },
  };

  return results[score] || results[0];
}
