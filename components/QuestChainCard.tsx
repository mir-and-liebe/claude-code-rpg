"use client";

import Link from "next/link";
import { Check, Scroll } from "lucide-react";
import type { QuestChain } from "@/lib/types";
import { XPBar } from "./XPBar";

interface Props {
  chain: QuestChain;
  completedQuests: Set<string>;
  isNext?: boolean;
}

export function QuestChainCard({ chain, completedQuests, isNext }: Props) {
  const completed = chain.quests.filter((q) => completedQuests.has(q.id)).length;
  const total = chain.quests.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const xpEarned = chain.quests
    .filter((q) => completedQuests.has(q.id))
    .reduce((s, q) => s + q.xpReward, 0);
  const xpTotal = chain.quests.reduce((s, q) => s + q.xpReward, 0) + chain.chainBonusXp;
  const isComplete = completed === total;

  return (
    <Link href={`/quests/${chain.id}`}>
      <div className={`card card-interactive p-5 cursor-pointer group relative ${isNext ? "border-gold/30" : ""}`}>
        <div className="flex items-center gap-3 mb-3">
          {isNext && (
            <span className="absolute -top-2 -right-2 text-[9px] font-mono tracking-wider uppercase bg-gold text-bg px-2 py-0.5 rounded-full">
              Start Here
            </span>
          )}
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gold/10">
            {isComplete ? (
              <Check className="w-4 h-4 text-gold" />
            ) : (
              <Scroll className="w-4 h-4 text-gold/60" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text group-hover:text-gold transition-colors duration-300">
              {chain.name}
            </h3>
            <p className="text-[11px] text-text-muted">{chain.skillTreeId.replace(/-/g, " ")}</p>
          </div>
        </div>
        <p className="text-[11px] text-text-muted italic mb-4 leading-relaxed">
          {chain.description}
        </p>
        <XPBar current={xpEarned} max={xpTotal} color="#d4a853" />
        <div className="flex justify-between mt-2">
          <p className="text-[11px] text-text-muted font-mono">
            {completed}/{total} quests
          </p>
          <p className="text-[11px] text-text-muted font-mono">
            {percentage}%
          </p>
        </div>
      </div>
    </Link>
  );
}
