"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  loadProgress,
  saveCompletedSkills,
  saveCharacter,
  saveChapterSeen,
  saveEasterEgg,
  type ProgressRow,
} from "./supabase";
import type { CharacterClass } from "./types";

interface ProgressContext {
  completedSkills: Set<string>;
  loading: boolean;
  progress: ProgressRow | null;
  toggleSkill: (id: string) => void;
  updateCharacter: (fields: {
    character_name?: string;
    character_title?: string;
    character_class?: string;
    avatar?: string;
  }) => void;
  markChapterSeen: (chapterId: string) => void;
  discoverEasterEgg: (eggId: string) => void;
  lastToggledSkillXp: number | null;
}

const ProgressCtx = createContext<ProgressContext>({
  completedSkills: new Set(),
  loading: true,
  progress: null,
  toggleSkill: () => {},
  updateCharacter: () => {},
  markChapterSeen: () => {},
  discoverEasterEgg: () => {},
  lastToggledSkillXp: null,
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressRow | null>(null);
  const [lastToggledSkillXp, setLastToggledSkillXp] = useState<number | null>(
    null
  );

  useEffect(() => {
    loadProgress().then((data) => {
      setCompletedSkills(new Set(data.completed_skills));
      setProgress(data);
      setLoading(false);
    });
  }, []);

  const toggleSkill = useCallback(
    (id: string) => {
      setCompletedSkills((prev) => {
        const next = new Set(prev);
        const adding = !next.has(id);
        if (adding) {
          next.add(id);
          // Find XP for toast
          import("@/data/skills.json").then((mod) => {
            for (const tree of mod.default) {
              const node = tree.nodes.find(
                (n: { id: string }) => n.id === id
              );
              if (node) {
                setLastToggledSkillXp(node.xpRequired);
                setTimeout(() => setLastToggledSkillXp(null), 2000);
                break;
              }
            }
          });
        } else {
          next.delete(id);
        }
        const charClass = (progress?.character_class || "") as CharacterClass;
        saveCompletedSkills(Array.from(next), charClass);
        return next;
      });
    },
    [progress?.character_class]
  );

  const updateCharacter = useCallback(
    (fields: {
      character_name?: string;
      character_title?: string;
      character_class?: string;
      avatar?: string;
    }) => {
      saveCharacter(fields);
      setProgress((prev) => (prev ? { ...prev, ...fields } : prev));
    },
    []
  );

  const markChapterSeen = useCallback((chapterId: string) => {
    saveChapterSeen(chapterId);
    setProgress((prev) =>
      prev ? { ...prev, last_seen_chapter: chapterId } : prev
    );
  }, []);

  const discoverEasterEgg = useCallback((eggId: string) => {
    saveEasterEgg(eggId);
    setProgress((prev) =>
      prev
        ? {
            ...prev,
            discovered_easter_eggs: [...prev.discovered_easter_eggs, eggId],
          }
        : prev
    );
  }, []);

  return (
    <ProgressCtx.Provider
      value={{
        completedSkills,
        loading,
        progress,
        toggleSkill,
        updateCharacter,
        markChapterSeen,
        discoverEasterEgg,
        lastToggledSkillXp,
      }}
    >
      {children}
    </ProgressCtx.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressCtx);
}
