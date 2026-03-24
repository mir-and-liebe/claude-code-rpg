"use client";

import { Sparkles, Clock } from "lucide-react";
import { generateDailyQuest } from "@/lib/rpg";

export function DailyQuest() {
  const today = new Date().toISOString().split("T")[0];
  const quest = generateDailyQuest(today);

  return (
    <div className="card p-5 gold-accent">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-gold" />
        <span className="text-[10px] text-gold tracking-widest uppercase font-mono">
          Daily Quest
        </span>
        <span className="text-[10px] text-text-muted ml-auto flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Resets at midnight
        </span>
      </div>
      <p className="text-sm text-text">{quest.questTarget}</p>
      <p className="text-[11px] text-gold/60 mt-1 font-mono">
        +{quest.bonusXp} bonus XP
      </p>
    </div>
  );
}
