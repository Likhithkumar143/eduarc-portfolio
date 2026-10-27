// Server-only staff auth: separate password + session cookie for the admin and the reception desk.
import { useSession } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { hashPassword, passwordProblem, verifyPassword } from "./password.server";

export type StaffRole = "admin" | "reception";
type SessionData = { ok?: boolean; v?: string };

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

const ROLES = {
  admin: {
    table: "admin_credentials",
    cookie: "eduarc-admin",
    seedEnv: "ADMIN_INITIAL_PASSWORD",
    username: "eduarc",
  },
  reception: {
    table: "reception_credentials",
    cookie: "eduarc-reception",
    seedEnv: null,
    username: "reception",
  },
} as const;

// Both credential tables share the same columns, so one typed accessor serves both.
const credTable = (role: StaffRole) => supabaseAdmin.from(ROLES[role].table as "admin_credentials");
const COLS = "password_hash, salt, iterations, failed_attempts, locked_until, updated_at";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function getSessionConfig(role: StaffRole) {
  const password = process.env["SESSION_SECRET"] || "eduarc-default-session-secret-key-32chars";
  const sameSite = (process.env["COOKIE_SAMESITE"] as "lax" | "strict" | "none") ?? "lax";
  return {
    password,
    name: ROLES[role].cookie,
    maxAge: 60 * 60 * 8, // 8 hours
    cookie: {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production" || process.env["COOKIE_SECURE"] === "true",
      sameSite,
      path: "/",
    },
  };
}

export function getStaffSession(role: StaffRole) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSession<SessionData>(getSessionConfig(role));
}

export type Credentials = {
  password_hash: string;
  salt: string;
  iterations: number;
  failed_attempts: number;
  locked_until: string | null;
  updated_at: string;
};

/**
 * Loads the role's single credential row. The admin row is created on first use from the
 * ADMIN_INITIAL_PASSWORD secret; the reception row only exists once the admin sets it.
 */
export async function loadCredentials(role: StaffRole): Promise<Credentials | null> {
  const { data, error } = await credTable(role).select(COLS).eq("id", 1).maybeSingle();
  if (error) {
    console.error(`[loadCredentials] error loading ${role}:`, error.message);
    throw new Error(`Database error: ${error.message}. Make sure table '${ROLES[role].table}' exists in Supabase.`);
  }
  if (data) return data;

  const seedEnv = ROLES[role].seedEnv;
  const initial = seedEnv ? process.env[seedEnv] : undefined;
  if (!initial) return null;
  const h = await hashPassword(initial);
  const { data: created, error: insertError } = await credTable(role)
    .upsert(
      {
        id: 1,
        username: ROLES[role].username,
        password_hash: h.hash,
        salt: h.salt,
        iterations: h.iterations,
      },
      { onConflict: "id", ignoreDuplicates: true },
    )
    .select(COLS)
    .maybeSingle();
  if (insertError) {
    console.error(`[loadCredentials] init ${role} error:`, insertError.message);
    throw new Error(`Could not initialize credentials: ${insertError.message}`);
  }
  if (created) return created;
  return loadCredentials(role);
}

/** Throws unless the request carries a valid session for this role and its current password. */
export async function requireStaff(role: StaffRole) {
  const session = await getStaffSession(role);
  if (!session.data.ok || !session.data.v) throw new Error("Unauthorized");
  const creds = await loadCredentials(role);
  if (!creds || creds.updated_at !== session.data.v) {
    await session.clear();
    throw new Error("Unauthorized");
  }
  return { session, creds };
}

export const requireAdmin = () => requireStaff("admin");
export const requireReception = () => requireStaff("reception");

export async function staffStatus(role: StaffRole) {
  try {
    await requireStaff(role);
    return { authenticated: true as const };
  } catch {
    return { authenticated: false as const };
  }
}

type Result = { ok: true } | { ok: false; message: string };

export async function staffLogin(role: StaffRole, password: string): Promise<Result> {
  try {
    const creds = await loadCredentials(role);
    if (!creds) {
      return {
        ok: false,
        message:
          role === "admin"
            ? "Admin password has not been initialized. Please set ADMIN_INITIAL_PASSWORD in Vercel environment variables."
            : "Reception access hasn't been set up yet. Ask the admin to set a reception password.",
      };
    }
    if (creds.locked_until && new Date(creds.locked_until) > new Date()) {
      return { ok: false, message: `Too many attempts. Try again in ${LOCKOUT_MINUTES} minutes.` };
    }

    const valid = await verifyPassword(password, {
      hash: creds.password_hash,
      salt: creds.salt,
      iterations: creds.iterations,
    });

    if (!valid) {
      const attempts = creds.failed_attempts + 1;
      const lock = attempts >= MAX_FAILED_ATTEMPTS;
      await credTable(role)
        .update({
          failed_attempts: lock ? 0 : attempts,
          locked_until: lock ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString() : null,
        })
        .eq("id", 1);
      await sleep(600);
      return {
        ok: false,
        message: lock
          ? `Too many attempts. Try again in ${LOCKOUT_MINUTES} minutes.`
          : "Incorrect password.",
      };
    }

    if (creds.failed_attempts > 0 || creds.locked_until) {
      await credTable(role).update({ failed_attempts: 0, locked_until: null }).eq("id", 1);
    }

    const session = await getStaffSession(role);
    await session.update({ ok: true, v: creds.updated_at });
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Authentication service error";
    console.error(`[staffLogin] error:`, msg);
    return { ok: false, message: msg };
  }
}

export async function staffLogout(role: StaffRole) {
  const session = await getStaffSession(role);
  await session.clear();
}

/** Writes a new password hash; every existing session for the role is invalidated. */
async function writePassword(role: StaffRole, newPassword: string) {
  const h = await hashPassword(newPassword);
  const { data, error } = await credTable(role)
    .upsert({
      id: 1,
      username: ROLES[role].username,
      password_hash: h.hash,
      salt: h.salt,
      iterations: h.iterations,
      failed_attempts: 0,
      locked_until: null,
      updated_at: new Date().toISOString(),
    })
    .select("updated_at")
    .single();
  if (error) throw new Error("Could not update password");
  return data.updated_at;
}

/** Signed-in staff member changes their own password (keeps this session signed in). */
export async function changeOwnPassword(
  role: StaffRole,
  currentPassword: string,
  newPassword: string,
): Promise<Result> {
  const { session, creds } = await requireStaff(role);
  const valid = await verifyPassword(currentPassword, {
    hash: creds.password_hash,
    salt: creds.salt,
    iterations: creds.iterations,
  });
  if (!valid) {
    await sleep(600);
    return { ok: false, message: "Current password is incorrect." };
  }
  const problem = passwordProblem(newPassword);
  if (problem) return { ok: false, message: problem };
  const v = await writePassword(role, newPassword);
  await session.update({ ok: true, v });
  return { ok: true };
}

/** Admin sets or resets the reception password; signs every receptionist out. */
export async function setReceptionPassword(newPassword: string): Promise<Result> {
  await requireAdmin();
  const problem = passwordProblem(newPassword);
  if (problem) return { ok: false, message: problem };
  await writePassword("reception", newPassword);
  return { ok: true };
}

export async function receptionAccessInfo() {
  await requireAdmin();
  const creds = await loadCredentials("reception");
  return { configured: !!creds, updatedAt: creds?.updated_at ?? null };
}
