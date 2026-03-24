"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { loadProgress, saveCompletedSkills } from "./supabase";

interface ProgressContext {
  completedSkills: Set<string>;
  loading: boolean;
  toggleSkill: (id: string) => void;
}

const ProgressCtx = createContext<ProgressContext>({
  completedSkills: new Set(),
  loading: true,
  toggleSkill: () => {},
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress().then((data) => {
      setCompletedSkills(new Set(data.completed_skills));
      setLoading(false);
    });
  }, []);

  const toggleSkill = useCallback(
    (id: string) => {
      setCompletedSkills((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        // Persist to Supabase (fire-and-forget)
        saveCompletedSkills(Array.from(next));
        return next;
      });
    },
    []
  );

  return (
    <ProgressCtx.Provider value={{ completedSkills, loading, toggleSkill }}>
      {children}
    </ProgressCtx.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressCtx);
}
