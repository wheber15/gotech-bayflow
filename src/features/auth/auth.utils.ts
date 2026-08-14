import { AppUser, LoginCredentials, LoginKind, LoginResult } from "./auth.types";

export const MAX_LOGIN_ATTEMPTS = 3;
export const LOCK_DURATION_MS = 5 * 60 * 1000;

export function isUserLocked(user: AppUser, now = new Date()) {
  return Boolean(user.lockedByAdmin || (user.lockedUntil && new Date(user.lockedUntil) > now));
}

export function attemptLogin(users: AppUser[], kind: LoginKind, credentials: LoginCredentials, now = new Date()): LoginResult {
  const username = credentials.username.trim().toLowerCase();
  const expectedRole = kind === "bay" ? "BAY_OPERATOR" : "ADMIN";
  const index = users.findIndex(user => user.username.toLowerCase() === username && user.role === expectedRole);
  const genericError = kind === "bay" ? "Invalid username or PIN" : "Invalid username or password";
  if (index < 0) return { users, error: genericError };

  const account = users[index];
  if (!account.active) return { users, error: genericError };
  if (isUserLocked(account, now)) return { users, error: genericError, lockedUntil: account.lockedUntil };

  const secretMatches = kind === "bay" ? account.pin === credentials.secret : account.password === credentials.secret;
  if (secretMatches) {
    const updated = { ...account, failedLoginAttempts: 0, lockedAt: undefined, lockedUntil: undefined, lastLoginAt: now.toISOString() };
    return { users: users.map((user, userIndex) => userIndex === index ? updated : user), user: updated };
  }

  const failedLoginAttempts = account.failedLoginAttempts + 1;
  const shouldLock = failedLoginAttempts >= MAX_LOGIN_ATTEMPTS;
  const updated: AppUser = { ...account, failedLoginAttempts, lockedAt: shouldLock ? now.toISOString() : account.lockedAt, lockedUntil: shouldLock ? new Date(now.getTime() + LOCK_DURATION_MS).toISOString() : account.lockedUntil };
  return { users: users.map((user, userIndex) => userIndex === index ? updated : user), error: genericError };
}

export function unlockUser(users: AppUser[], userId: string, actor: AppUser, now = new Date()) {
  return users.map(user => user.id === userId ? { ...user, failedLoginAttempts: 0, lockedUntil: undefined, lockedAt: undefined, lockedByAdmin: undefined, unlockedAt: now.toISOString(), unlockedBy: actor.displayName } : user);
}
