"use client";

import { useState, useEffect } from "react";
import { Sparkles, Clock, Check } from "lucide-react";
import { generateDailyQuest } from "@/lib/rpg";
import { supabase } from "@/lib/supabase";

export function DailyQuest() {
  const today = new Date().toISOString().split("T")[0];
  const quest = generateDailyQuest(today);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("daily_quests")
      .select("completed")
      .eq("id", today)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.completed) setCompleted(true);
        setLoading(false);
      });
  }, [today]);

  async function handleComplete() {
    setCompleted(true);
    await supabase.from("daily_quests").upsert({
      id: today,
      date: today,
      quest_type: quest.questType,
      quest_target: quest.questTarget,
      bonus_xp: quest.bonusXp,
      completed: true,
    });
  }

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
      <div className="flex items-center justify-between mt-3">
        <p className="text-[11px] text-gold/60 font-mono">
          +{quest.bonusXp} bonus XP
        </p>
        {!loading && (
          completed ? (
            <span className="flex items-center gap-1 text-[11px] text-gold font-mono">
              <Check className="w-3 h-3" />
              Completed
            </span>
          ) : (
            <button
              onClick={handleComplete}
              className="text-[11px] px-3 py-1 rounded-lg bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 transition-colors cursor-pointer font-mono"
            >
              Complete
            </button>
          )
        )}
      </div>
    </div>
  );
}
