"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: none), (pointer: coarse)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/** True on touch-first devices — used to disable the custom cursor,
 *  magnetic hovers and the heavy WebGL path. SSR-safe (true on server so
 *  heavy extras only mount once we know the pointer is fine). */
export function useIsTouch(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}

export function isTouchDevice(): boolean {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}
