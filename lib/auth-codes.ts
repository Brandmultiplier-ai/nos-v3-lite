/**
 * Allowlist of valid dashboard access codes.
 *
 * Each code is independently revocable (remove/blank its env var) and can
 * optionally expire on its own, without touching any other code. Actual
 * secret values live only in environment variables — never hardcode a
 * passcode string here.
 */
export interface AccessCode {
  id: string;
  label: string;
  password: string | undefined;
  /** ISO date string; null means the code never expires. */
  expiresAt: string | null;
}

const ACCESS_CODES: AccessCode[] = [
  {
    id: "internal",
    label: "Sales / Internal",
    password: process.env.DASHBOARD_PASSWORD,
    expiresAt: null,
  },
  {
    id: "spc",
    label: "SPC",
    password: process.env.SPC_ACCESS_CODE,
    // Interview invitations go out by Aug 30; process runs past that.
    // Comfortably past any interview, short enough to die on its own.
    expiresAt: "2026-10-31T23:59:59-04:00",
  },
];

/**
 * Resolves a submitted passcode against the allowlist. Returns the matching
 * (non-expired) code, or null if it's wrong, unset, or expired.
 */
export function resolveAccessCode(input: string): AccessCode | null {
  const now = Date.now();
  return (
    ACCESS_CODES.find(
      (c) =>
        !!c.password &&
        c.password === input &&
        (!c.expiresAt || new Date(c.expiresAt).getTime() > now),
    ) ?? null
  );
}
