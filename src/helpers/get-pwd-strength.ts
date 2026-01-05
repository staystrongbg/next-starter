export type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string; color: string };

export function getPasswordStrength(pw: string): Strength {
  if (!pw) return { score: 0, label: 'Too weak', color: 'bg-red-500' };

  const length = pw.length;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);

  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (length >= 8) score = (score + 1) as Strength['score'];
  if (length >= 12) score = (score + 1) as Strength['score'];
  const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (variety >= 2) score = (score + 1) as Strength['score'];
  if (variety >= 3) score = (score + 1) as Strength['score'];

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'bg-yellow-500' };
  if (score === 3) return { score: 3, label: 'Good', color: 'bg-green-500' };
  return { score: 4, label: 'Strong', color: 'bg-emerald-600' };
}
