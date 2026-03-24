"use client";

import { useProgress } from "@/lib/use-progress";
import { ChallengeModal } from "./ChallengeModal";

export function ChallengeGate() {
  const { pendingChallenge, completeChallenge, dismissChallenge } = useProgress();

  if (!pendingChallenge) return null;

  return (
    <ChallengeModal
      skillId={pendingChallenge.skillId}
      skillName={pendingChallenge.skillName}
      onComplete={completeChallenge}
      onClose={dismissChallenge}
    />
  );
}
