"use client";

import { useProgress } from "@/lib/use-progress";
import { WelcomeModal } from "./WelcomeModal";

export function WelcomeFlow() {
  const { completedSkills, loading } = useProgress();

  if (loading) return null;

  return (
    <WelcomeModal
      hasProgress={completedSkills.size > 0}
      onDismiss={() => {}}
    />
  );
}
