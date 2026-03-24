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
  supabase,
  type ProgressRow,
} from "./supabase";
import type { CharacterClass } from "./types";

interface PendingChallenge {
  skillId: string;
  skillName: string;
}

interface ProgressContext {
  completedSkills: Set<string>;
  loading: boolean;
  progress: ProgressRow | null;
  toggleSkill: (id: string) => void;
  challengeSkill: (id: string, name: string) => void;
  completeChallenge: (verified: boolean) => void;
  dismissChallenge: () => void;
  pendingChallenge: PendingChallenge | null;
  updateCharacter: (fields: {
    character_name?: string;
    character_title?: string;
    character_class?: string;
    avatar?: string;
  }) => void;
  markChapterSeen: (chapterId: string) => void;
  discoverEasterEgg: (eggId: string) => void;
  lastToggledSkillXp: number | null;
  reviewDueCount: number;
}

const ProgressCtx = createContext<ProgressContext>({
  completedSkills: new Set(),
  loading: true,
  progress: null,
  toggleSkill: () => {},
  challengeSkill: () => {},
  completeChallenge: () => {},
  dismissChallenge: () => {},
  pendingChallenge: null,
  updateCharacter: () => {},
  markChapterSeen: () => {},
  discoverEasterEgg: () => {},
  lastToggledSkillXp: null,
  reviewDueCount: 0,
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressRow | null>(null);
  const [lastToggledSkillXp, setLastToggledSkillXp] = useState<number | null>(null);
  const [pendingChallenge, setPendingChallenge] = useState<PendingChallenge | null>(null);
  const [reviewDueCount, setReviewDueCount] = useState(0);

  useEffect(() => {
    loadProgress().then((data) => {
      setCompletedSkills(new Set(data.completed_skills));
      setProgress(data);
      setLoading(false);
    });
    // Check review count
    const today = new Date().toISOString().split("T")[0];
    supabase
      .from("skill_reviews")
      .select("skill_id", { count: "exact" })
      .lte("next_review", today)
      .then(({ count }) => setReviewDueCount(count || 0));
  }, []);

  // Direct toggle (for uncompleting skills)
  const toggleSkill = useCallback(
    (id: string) => {
      setCompletedSkills((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          triggerXpToast(id);
        }
        const charClass = (progress?.character_class || "") as CharacterClass;
        saveCompletedSkills(Array.from(next), charClass);
        return next;
      });
    },
    [progress?.character_class]
  );

  // Open challenge for a skill
  const challengeSkill = useCallback((id: string, name: string) => {
    setPendingChallenge({ skillId: id, skillName: name });
  }, []);

  // Complete challenge (verified or skipped)
  const completeChallenge = useCallback(
    (verified: boolean) => {
      if (!pendingChallenge) return;
      const id = pendingChallenge.skillId;
      setPendingChallenge(null);

      setCompletedSkills((prev) => {
        const next = new Set(prev);
        next.add(id);
        triggerXpToast(id);
        const charClass = (progress?.character_class || "") as CharacterClass;
        saveCompletedSkills(Array.from(next), charClass);

        // Save verified status
        if (verified && progress) {
          const verifiedSkills = [...(progress.verified_skills || []), id];
          supabase
            .from("rpg_progress")
            .update({ verified_skills: verifiedSkills })
            .eq("id", "default");
          setProgress((p) => p ? { ...p, verified_skills: verifiedSkills } : p);
        }

        // Add to spaced repetition queue
        const today = new Date().toISOString().split("T")[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        supabase.from("skill_reviews").upsert({
          skill_id: id,
          ease_factor: 2.5,
          interval_days: 1,
          repetitions: 0,
          next_review: tomorrow.toISOString().split("T")[0],
          last_review: today,
        });

        return next;
      });
    },
    [pendingChallenge, progress]
  );

  const dismissChallenge = useCallback(() => {
    setPendingChallenge(null);
  }, []);

  function triggerXpToast(id: string) {
    import("@/data/skills.json").then((mod) => {
      for (const tree of mod.default) {
        const node = tree.nodes.find((n: { id: string }) => n.id === id);
        if (node) {
          setLastToggledSkillXp(node.xpRequired);
          setTimeout(() => setLastToggledSkillXp(null), 2000);
          break;
        }
      }
    });
  }

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
        ? { ...prev, discovered_easter_eggs: [...prev.discovered_easter_eggs, eggId] }
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
        challengeSkill,
        completeChallenge,
        dismissChallenge,
        pendingChallenge,
        updateCharacter,
        markChapterSeen,
        discoverEasterEgg,
        lastToggledSkillXp,
        reviewDueCount,
      }}
    >
      {children}
    </ProgressCtx.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressCtx);
}
