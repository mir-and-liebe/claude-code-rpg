"use client";

import { Zap } from "lucide-react";
import { useProgress } from "@/lib/use-progress";

export function XPToast() {
  const { lastToggledSkillXp } = useProgress();

  if (!lastToggledSkillXp) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-[fadeUp_2s_ease-out_forwards]">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold/10 border border-gold/20 text-gold font-mono text-sm">
        <Zap className="w-4 h-4" />
        +{lastToggledSkillXp} XP
      </div>
      <style jsx>{`
        @keyframes fadeUp {
          0% { opacity: 1; transform: translateY(0); }
          70% { opacity: 1; transform: translateY(-20px); }
          100% { opacity: 0; transform: translateY(-40px); }
        }
      `}</style>
    </div>
  );
}
