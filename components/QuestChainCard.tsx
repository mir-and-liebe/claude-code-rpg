"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, ScrollText } from "lucide-react";
import type { QuestChain } from "@/lib/types";

interface Props {
  chain: QuestChain;
  completedQuests: Set<string>;
  isNext?: boolean;
  index?: number;
}

export function QuestChainCard({ chain, completedQuests, isNext, index = 0 }: Props) {
  const completed = chain.quests.filter((quest) => completedQuests.has(quest.id)).length;
  const total = chain.quests.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = completed === total;
  const nextQuest = chain.quests.find((quest) => !completedQuests.has(quest.id)) ?? chain.quests[0];

  return (
    <Link href={`/quests/${chain.id}`} className="group block">
      <article className={`interactive h-full rounded-lg border p-4 ${isNext ? "border-signal/60 bg-signal/5" : "border-line bg-panel"}`}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md border border-line bg-void/50">
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-green" />
              ) : isNext ? (
                <ScrollText className="h-5 w-5 text-signal" />
              ) : (
                <LockKeyhole className="h-5 w-5 text-muted" />
              )}
            </div>
            <div>
              <p className="font-mono text-xs text-muted">Chain {String(index + 1).padStart(2, "0")}</p>
              <h2 className="text-lg font-bold text-ink transition group-hover:text-signal">
                {chain.name}
              </h2>
            </div>
          </div>
          {isNext && (
            <span className="rounded-full bg-signal px-2 py-1 text-[10px] font-black uppercase tracking-widest text-void">
              Next
            </span>
          )}
        </div>

        <p className="min-h-[3.75rem] text-sm leading-6 text-soft">{chain.description}</p>

        <div className="mt-5 rounded-md border border-line bg-void/35 p-3">
          <p className="hud-label">Next objective</p>
          <p className="mt-2 text-sm font-semibold text-ink">{nextQuest.title}</p>
          <p className="mt-1 text-xs text-muted">Unlocks {chain.skillNodeId} · +{chain.chainBonusXp} bonus XP</p>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span>{completed}/{total} missions</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-void">
            <div className="xp-bar-fill h-full" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm font-semibold text-signal">
          <span>{isComplete ? "Review chain" : "Enter chain"}</span>
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </article>
    </Link>
  );
}
