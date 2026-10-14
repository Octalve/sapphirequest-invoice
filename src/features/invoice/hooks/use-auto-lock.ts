"use client";

import { useCallback, useEffect, useRef } from "react";

const DEFAULT_INACTIVITY_MS = 2 * 60 * 1000;

export function useAutoLock(
  enabled: boolean,
  onLock: () => void,
  inactivityMs = DEFAULT_INACTIVITY_MS,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const reset = useCallback(() => {
    if (!enabled) return;
    clear();
    timerRef.current = setTimeout(onLock, inactivityMs);
  }, [clear, enabled, inactivityMs, onLock]);

  useEffect(() => {
    if (!enabled) {
      clear();
      return;
    }

    reset();
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "touchmove", "scroll", "click"] as const;
    events.forEach((eventName) => window.addEventListener(eventName, reset, { passive: true }));

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, reset));
      clear();
    };
  }, [clear, enabled, reset]);

  return { resetInactivityTimer: reset, clearInactivityTimer: clear };
}
