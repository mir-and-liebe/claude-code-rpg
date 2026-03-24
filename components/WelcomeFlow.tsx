"use client";

import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/use-progress";
import { WelcomeModal } from "./WelcomeModal";

export function WelcomeFlow() {
  const { completedSkills, loading } = useProgress();
  const router = useRouter();

  if (loading) return null;

  return (
    <WelcomeModal
      hasProgress={completedSkills.size > 0}
      onDismiss={() => router.push("/skills")}
    />
  );
}
