"use client";

import { useState } from "react";
import { Scroll } from "lucide-react";
import { questChains } from "@/data/quests";
import { useProgress } from "@/lib/use-progress";
import { QuestChainCard } from "@/components/QuestChainCard";

export default function QuestsPage() {
  const { completedQuests, loading } = useProgress();
  const [hideCompleted, setHideCompleted] = useState(false);

  const chains = hideCompleted
    ? questChains.filter(
        (c) => !c.quests.every((q) => completedQuests.has(q.id))
      )
    : questChains;

  const totalQuests = questChains.reduce((s, c) => s + c.quests.length, 0);
  const doneQuests = questChains.reduce(
    (s, c) => s + c.quests.filter((q) => completedQuests.has(q.id)).length,
    0
  );

  // First incomplete chain gets "Start Here"
  const nextChainId = questChains.find(
    (c) => !c.quests.every((q) => completedQuests.has(q.id))
  )?.id;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-surface rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Scroll className="w-5 h-5 text-gold" />
          <h1 className="text-xl font-semibold text-text">Quest Chains</h1>
          <span className="text-xs text-text-muted font-mono ml-2">
            {doneQuests}/{totalQuests} quests
          </span>
        </div>
        <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={(e) => setHideCompleted(e.target.checked)}
            className="accent-gold"
          />
          Hide completed
        </label>
      </div>

      <p className="text-sm text-text-muted mb-6 max-w-2xl">
        Learn Claude Code by doing. Each quest chain teaches a skill through hands-on
        exercises. Complete all quests in a chain to unlock the linked skill tree node
        and earn bonus XP.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {chains.map((chain) => (
          <QuestChainCard
            key={chain.id}
            chain={chain}
            completedQuests={completedQuests}
            isNext={chain.id === nextChainId}
          />
        ))}
      </div>

      {chains.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <Scroll className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">All quest chains completed. You are the Vibecoding Architect.</p>
        </div>
      )}
    </div>
  );
}
