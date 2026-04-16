"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Scroll, Trophy, Lightbulb } from "lucide-react";
import { getQuestChain } from "@/data/quests";
import { useProgress } from "@/lib/use-progress";
import { CopyButton } from "@/components/CopyButton";

export default function QuestChainPage({
  params,
}: {
  params: Promise<{ chain: string }>;
}) {
  const { chain: chainId } = use(params);
  const chain = getQuestChain(chainId);
  const { completedQuests, completeQuest, loading } = useProgress();

  if (!chain) return notFound();

  const completed = chain.quests.filter((q) => completedQuests.has(q.id)).length;
  const total = chain.quests.length;
  const isChainComplete = completed === total;
  const isBossChain = chain.id === "real-world";

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-surface rounded" />
          <div className="h-32 bg-surface rounded-xl" />
          <div className="h-24 bg-surface rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <Link
        href="/quests"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-gold transition-colors mb-4"
      >
        <ArrowLeft className="w-3 h-3" />
        All Quests
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Scroll className="w-5 h-5 text-gold" />
        <h1 className="text-xl font-semibold text-text">{chain.name}</h1>
        {isChainComplete && <Check className="w-5 h-5 text-gold" />}
      </div>
      <p className="text-sm text-text-muted mb-1">{chain.description}</p>
      <p className="text-[11px] text-text-muted font-mono mb-6">
        {completed}/{total} quests &middot; Unlocks{" "}
        <span className="text-gold">{chain.skillNodeId}</span> &middot;{" "}
        Chain bonus: {chain.chainBonusXp} XP
      </p>

      {/* Concepts */}
      {chain.concepts.map((concept, i) => (
        <div key={i} className="card p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-gold/60" />
            <h2 className="text-sm font-semibold text-text">{concept.title}</h2>
          </div>
          <p className="text-sm text-text-muted leading-relaxed mb-3">
            {concept.content}
          </p>
          {concept.tips && (
            <ul className="space-y-1">
              {concept.tips.map((tip, j) => (
                <li
                  key={j}
                  className="text-xs text-text-muted pl-3 border-l-2 border-border"
                >
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Quests */}
      <h2 className="text-sm font-semibold text-text mb-3 mt-6">
        {isBossChain ? "Boss Quest" : "Quests"}
      </h2>
      <div className="space-y-3">
        {chain.quests.map((quest) => {
          const done = completedQuests.has(quest.id);
          const isBoss = quest.id.includes("boss");
          return (
            <div
              key={quest.id}
              className={`card p-4 ${isBoss ? "border-gold/30" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => {
                      if (!done) completeQuest(quest.id, quest.xpReward, chain.id);
                    }}
                    className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                      done
                        ? "border-gold/40 bg-gold/10"
                        : "border-border hover:border-gold/40"
                    }`}
                  >
                    {done && <Check className="w-3 h-3 text-gold" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-medium ${
                          done ? "text-text-muted line-through" : "text-text"
                        }`}
                      >
                        {quest.title}
                      </span>
                      {isBoss && (
                        <Trophy className="w-3.5 h-3.5 text-gold" />
                      )}
                      <span className="text-[10px] font-mono text-gold/70 bg-gold/5 px-1.5 py-0.5 rounded">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-text-muted bg-bg px-2 py-1 rounded border border-border flex-1 block">
                        {quest.prompt}
                      </code>
                      <CopyButton text={quest.prompt} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chain complete banner */}
      {isChainComplete && (
        <div className="card p-4 mt-6 border-gold/30 bg-gold/5 text-center">
          <Trophy className="w-6 h-6 text-gold mx-auto mb-2" />
          <p className="text-sm font-semibold text-gold">Chain Complete!</p>
          <p className="text-xs text-text-muted mt-1">
            +{chain.chainBonusXp} XP bonus &middot; Skill node{" "}
            <span className="font-mono">{chain.skillNodeId}</span> unlocked
          </p>
        </div>
      )}

      {/* Takeaways */}
      {chain.takeaways.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-text mb-3">Key Takeaways</h2>
          <ul className="space-y-1.5">
            {chain.takeaways.map((item, i) => (
              <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                <span className="text-gold/50 mt-0.5">&#x2022;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
