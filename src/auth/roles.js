// Mirrors the backend UserRole enum (src/user/dto/create-user.dto.ts).
export const ROLES = {
  JOB_SEEKER: "job_seeker",
  RECRUITER: "recruiter",
  ADMIN: "admin",
};

/**
 * Where each role lands after signing in. Keeping this in one place is what
 * stops the app from sending every authenticated user to the job seeker
 * dashboard regardless of who they are.
 */
export const ROLE_HOME_PATH = {
  [ROLES.JOB_SEEKER]: "/dashboard",
  [ROLES.RECRUITER]: "/recruiter",
  [ROLES.ADMIN]: "/admin",
};

export const homePathForRole = (role) => ROLE_HOME_PATH[role] ?? "/";

/** Prefer the real name; fall back to the email local part, then a generic. */
export const displayNameFor = (user) =>
  user?.fullName?.trim() || user?.email?.split("@")[0] || "there";
