"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  subscribeSession,
} from "@/lib/auth/session";

/**
 * Reads auth from localStorage on every relevant update (login, logout, other tab).
 * Avoids the “always logged out until useEffect” flash in the marketing header.
 */
export function useSessionSnapshot(): { isLoggedIn: boolean; role: string | null } {
  const snap = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot
  );
  return useMemo(() => {
    const pipe = snap.indexOf("|");
    const flag = pipe >= 0 ? snap.slice(0, pipe) : "0";
    const role = pipe >= 0 ? snap.slice(pipe + 1) : "";
    return {
      isLoggedIn: flag === "1",
      role: role.length > 0 ? role : null,
    };
  }, [snap]);
}
