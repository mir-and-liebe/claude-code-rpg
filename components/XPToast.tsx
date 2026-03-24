"use client";

import { useEffect, useRef } from "react";
import { Zap } from "lucide-react";
import { useProgress } from "@/lib/use-progress";

function playCoinSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(987, ctx.currentTime); // B5
    osc.frequency.setValueAtTime(1319, ctx.currentTime + 0.05); // E6
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Audio not available
  }
}

export function XPToast() {
  const { lastToggledSkillXp } = useProgress();
  const prevXp = useRef<number | null>(null);

  useEffect(() => {
    if (lastToggledSkillXp && lastToggledSkillXp !== prevXp.current) {
      playCoinSound();
      prevXp.current = lastToggledSkillXp;
    }
  }, [lastToggledSkillXp]);

  if (!lastToggledSkillXp) return null;

  return (
    <div className="fixed bottom-20 right-8 z-50 animate-[fadeUp_2s_ease-out_forwards]">
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
