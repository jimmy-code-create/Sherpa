/**
 * Pure password rules — safe to import from client components (no node:crypto).
 * The hashing itself lives in src/lib/auth.ts (server-only).
 */
export interface PasswordStrength {
  score: 0 | 1 | 2 | 3;
  label: "weak" | "ok" | "strong";
  problems: string[];
}

export function passwordStrength(password: string): PasswordStrength {
  const problems: string[] = [];
  if (password.length < 8) problems.push("Use at least 8 characters");
  if (!/[A-Za-z]/.test(password)) problems.push("Include at least one letter");
  if (!/\d/.test(password)) problems.push("Include at least one number");
  if (problems.length > 0) {
    return { score: password.length >= 6 ? 1 : 0, label: "weak", problems };
  }
  const bonus = /[^A-Za-z0-9]/.test(password) && password.length >= 12;
  return { score: bonus ? 3 : 2, label: bonus ? "strong" : "ok", problems: [] };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
