"use client";

import { useState } from "react";
import { EyeOff, Map, RadioTower } from "lucide-react";
import { QuestChainCard } from "@/components/QuestChainCard";
import { questChains } from "@/data/quests";
import { useProgress } from "@/lib/use-progress";

export default function QuestsPage() {
  const { completedQuests, loading } = useProgress();
  const [hideCompleted, setHideCompleted] = useState(false);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-sm text-muted">
        Loading campaign...
      </div>
    );
  }

  const chains = hideCompleted
    ? questChains.filter((chain) => !chain.quests.every((quest) => completedQuests.has(quest.id)))
    : questChains;

  const totalQuests = questChains.reduce((sum, chain) => sum + chain.quests.length, 0);
  const doneQuests = questChains.reduce(
    (sum, chain) => sum + chain.quests.filter((quest) => completedQuests.has(quest.id)).length,
    0
  );
  const nextChainId = questChains.find(
    (chain) => !chain.quests.every((quest) => completedQuests.has(quest.id))
  )?.id;

  return (
    <div className="space-y-6">
      <section className="signal-band px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-void/40 px-3 py-1 text-xs font-semibold text-soft">
              <Map className="h-4 w-4 text-signal" />
              Campaign Map
            </div>
            <h1 className="text-4xl font-black text-ink">Choose the next product slice.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-soft">
              Each chain teaches one part of the vibecoding loop through tasks you can
              actually run. Clear a chain to unlock its linked skill and bank bonus XP.
            </p>
          </div>
          <div className="panel-strong min-w-[220px] p-4">
            <p className="hud-label">Campaign Progress</p>
            <p className="mt-2 text-3xl font-black text-ink">
              {doneQuests}/{totalQuests}
            </p>
            <p className="text-xs text-muted">missions complete</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-soft">
          <RadioTower className="h-4 w-4 text-cyan" />
          <span>{chains.length} chains visible</span>
        </div>
        <button
          onClick={() => setHideCompleted((value) => !value)}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-line px-3 text-xs font-semibold text-soft transition hover:border-line-strong hover:bg-panel-strong hover:text-ink"
        >
          <EyeOff className="h-4 w-4" />
          {hideCompleted ? "Show completed" : "Hide completed"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {chains.map((chain, index) => (
          <QuestChainCard
            key={chain.id}
            chain={chain}
            completedQuests={completedQuests}
            isNext={chain.id === nextChainId}
            index={index}
          />
        ))}
      </div>

      {chains.length === 0 && (
        <div className="panel p-10 text-center">
          <p className="text-lg font-semibold text-ink">Campaign cleared.</p>
          <p className="mt-2 text-sm text-muted">Every loop has been practiced. Time to ship something real.</p>
        </div>
      )}
    </div>
  );
}
