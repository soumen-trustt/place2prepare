export type UserRole = "STUDENT" | "ADMIN";

export type Session = {
  token: string;
  role: UserRole;
};

const TOKEN_KEY = "accessToken";
const ROLE_KEY = "userRole";

/** Same-tab updates (the {@code storage} event only fires in other tabs). */
const SESSION_CHANGED = "place2prepare-session-changed";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function notifySessionChanged(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(SESSION_CHANGED));
}

export function subscribeSession(listener: () => void): () => void {
  if (!isBrowser()) {
    return () => {};
  }
  window.addEventListener("storage", listener);
  window.addEventListener(SESSION_CHANGED, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(SESSION_CHANGED, listener);
  };
}

/**
 * Stable string for {@link useSyncExternalStore}: logged-in flag + raw role (SSR → {@code 0|}).
 */
export function getSessionSnapshot(): string {
  if (!isBrowser()) {
    return "0|";
  }
  const token = window.localStorage.getItem(TOKEN_KEY);
  const role = window.localStorage.getItem(ROLE_KEY) ?? "";
  return (token ? "1" : "0") + "|" + role;
}

export function getServerSessionSnapshot(): string {
  return "0|";
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getRole(): UserRole | null {
  if (!isBrowser()) return null;
  const value = window.localStorage.getItem(ROLE_KEY);
  if (value === "STUDENT" || value === "ADMIN") return value;
  return null;
}

export function getSession(): Session | null {
  const token = getToken();
  const role = getRole();
  if (!token || !role) return null;
  return { token, role };
}

export function setSession(token: string, role: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(ROLE_KEY, role);
  notifySessionChanged();
}

export function clearSession(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ROLE_KEY);
  notifySessionChanged();
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * Default path after login, register, or “already signed in” on auth pages.
 * Admins land on the admin control center (full platform tools) and still reach the student
 * catalog from the header (Courses, etc.). Students land on the course catalog.
 */
export function homePathForRole(role: UserRole | string | null | undefined): string {
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }
  if (role === "STUDENT") {
    return "/courses";
  }
  return "/";
}

/**
 * Student/admin overview (header Dashboard, catalog “back”, in-app “Dashboard” links).
 */
export function dashboardPathForRole(role: UserRole | string | null | undefined): string {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "STUDENT") return "/dashboard";
  return "/";
}

/** Admins use the same learn/enroll flows as students (catalog, course pages, checkout). */
export function canActAsLearner(role: UserRole | string | null | undefined): boolean {
  return role === "STUDENT" || role === "ADMIN";
}
