"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SOURCE_REVISION } from "../lib/content/source";

const STORAGE_KEY = `grok-build-progress:${SOURCE_REVISION}`;

interface ProgressValue {
  completed: string[];
  percent: number;
  markComplete: (slug: string) => void;
}

const ProgressContext = createContext<ProgressValue>({
  completed: [],
  percent: 0,
  markComplete: () => undefined,
});

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    let timer: number | undefined;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) timer = window.setTimeout(() => setCompleted(JSON.parse(stored)), 0);
    } catch {
      // Ignore unavailable or malformed device-local storage.
    }
    return () => { if (timer) window.clearTimeout(timer); };
  }, []);

  const markComplete = useCallback((slug: string) => {
    setCompleted((current) => {
      const next = current.includes(slug) ? current : [...current, slug];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Device-local progress is optional; the lesson stays usable without it.
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ completed, percent: Math.round((completed.length / 6) * 100), markComplete }),
    [completed, markComplete],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  return useContext(ProgressContext);
}
