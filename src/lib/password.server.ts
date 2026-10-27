// PBKDF2-SHA256 via Web Crypto (works in the Worker runtime; 100k is the platform max).
export const PBKDF2_ITERATIONS = 100_000;

const toB64 = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
};
const fromB64 = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

async function derive(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
      key,
      256,
    ),
  );
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

export async function hashPassword(password: string, iterations = PBKDF2_ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, iterations);
  return { hash: toB64(hash), salt: toB64(salt), iterations };
}

export async function verifyPassword(
  password: string,
  stored: { hash: string; salt: string; iterations: number },
) {
  const hash = await derive(password, fromB64(stored.salt), stored.iterations);
  return constantTimeEqual(hash, fromB64(stored.hash));
}

/** Timing-safe comparison of two plain strings (hashes both to equal length first). */
export async function stringsMatch(a: string, b: string) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  return constantTimeEqual(new Uint8Array(ha), new Uint8Array(hb));
}

export const PASSWORD_MIN_LENGTH = 8;
export function passwordProblem(pw: string): string | null {
  if (pw.length < PASSWORD_MIN_LENGTH) return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  if (pw.length > 200) return "Password is too long.";
  return null;
}
