import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession, type SessionPayload } from "./auth";
import { profiles, users, type ProfileRecord, type UserRecord } from "./store";

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

export interface AuthedUser {
  session: SessionPayload;
  user: UserRecord;
  profile: ProfileRecord;
}

/** Returns the signed-in user with their profile, or null. */
export async function getCurrentUser(): Promise<AuthedUser | null> {
  const session = await getSession();
  if (!session) return null;
  const user = await users.findById(session.userId);
  if (!user) return null;
  let profile = await profiles.get(user.id);
  if (!profile) profile = await profiles.upsert(user.id, {});
  return { session, user, profile };
}

/** Server-component guard: redirects to sign-in preserving the destination. */
export async function requireUser(next?: string): Promise<AuthedUser> {
  const current = await getCurrentUser();
  if (!current) {
    const target = next ? `/auth/sign-in?next=${encodeURIComponent(next)}` : "/auth/sign-in";
    redirect(target);
  }
  return current;
}

/** Client-safe redirect target for pages that already know the user is signed in. */
export function safeNextForPage(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/app";
  return next;
}

export async function requireAdmin(): Promise<AuthedUser> {
  const current = await requireUser("/admin");
  if (current.user.role !== "admin") redirect("/app");
  return current;
}
