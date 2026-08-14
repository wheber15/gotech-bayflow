export type UserRole = "BAY_OPERATOR" | "ADMIN";

export type AppUser = {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  active: boolean;
  pin?: string;
  password?: string;
  failedLoginAttempts: number;
  lockedUntil?: string;
  lockedAt?: string;
  lockedByAdmin?: boolean;
  lastLoginAt?: string;
  unlockedAt?: string;
  unlockedBy?: string;
};

export type LoginKind = "bay" | "admin";
export type LoginCredentials = { username: string; secret: string };
export type LoginErrorKind = "INVALID" | "UNAVAILABLE";
export type LoginResult = { users: AppUser[]; user?: AppUser; error?: string; errorKind?: LoginErrorKind };
