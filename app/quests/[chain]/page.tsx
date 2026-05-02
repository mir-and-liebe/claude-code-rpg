"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Lightbulb,
  RadioTower,
  ScrollText,
  Trophy,
} from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { getQuestChain } from "@/data/quests";
import { useProgress } from "@/lib/use-progress";

export default function QuestChainPage({
  params,
}: {
  params: Promise<{ chain: string }>;
}) {
  const { chain: chainId } = use(params);
  const chain = getQuestChain(chainId);
  const { completedQuests, completeQuest, loading } = useProgress();

  if (!chain) return notFound();

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-sm text-muted">
        Loading mission brief...
      </div>
    );
  }

  const completed = chain.quests.filter((quest) => completedQuests.has(quest.id)).length;
  const total = chain.quests.length;
  const percentage = Math.round((completed / total) * 100);
  const isChainComplete = completed === total;
  const isBossChain = chain.id === "real-world";

  return (
    <div className="space-y-6">
      <Link
        href="/quests"
        className="inline-flex items-center gap-2 text-sm font-semibold text-soft transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaign
      </Link>

      <section className="signal-band px-5 py-6 sm:px-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_260px] lg:items-end">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="status-pill">
                <ScrollText className="h-4 w-4 text-signal" />
                {isBossChain ? "Boss chain" : "Quest chain"}
              </span>
              <span className="status-pill">Unlocks {chain.skillNodeId}</span>
            </div>
            <h1 className="text-4xl font-black text-ink">{chain.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-soft">{chain.description}</p>
          </div>
          <div className="panel-strong p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-muted">
              <span>{completed}/{total} missions</span>
              <span>{percentage}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-void">
              <div className="xp-bar-fill h-full" style={{ width: `${percentage}%` }} />
            </div>
            <p className="mt-3 text-xs text-muted">Chain bonus: {chain.chainBonusXp} XP</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-4">
          {chain.concepts.map((concept) => (
            <article key={concept.title} className="panel p-5">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-signal" />
                <h2 className="text-lg text-ink">{concept.title}</h2>
              </div>
              <p className="text-sm leading-6 text-soft">{concept.content}</p>
              {concept.tips && (
                <div className="mt-4 space-y-2">
                  {concept.tips.map((tip) => (
                    <p key={tip} className="rounded-md border border-line bg-void/40 px-3 py-2 text-xs text-muted">
                      {tip}
                    </p>
                  ))}
                </div>
              )}
            </article>
          ))}

          <article className="panel p-5">
            <div className="mb-3 flex items-center gap-2">
              <RadioTower className="h-4 w-4 text-cyan" />
              <h2 className="text-lg text-ink">Field Notes</h2>
            </div>
            <div className="space-y-2">
              {chain.takeaways.map((item) => (
                <p key={item} className="flex gap-2 text-sm text-soft">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </article>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">{isBossChain ? "Boss Objective" : "Mission Queue"}</h2>
            {isChainComplete && (
              <span className="status-pill text-signal">
                <Trophy className="h-4 w-4" />
                Chain clear
              </span>
            )}
          </div>

          {chain.quests.map((quest, index) => {
            const done = completedQuests.has(quest.id);
            const isBoss = quest.id.includes("boss");

            return (
              <article
                key={quest.id}
                className={`rounded-lg border p-4 ${done ? "border-green/30 bg-green/5" : isBoss ? "border-signal/50 bg-signal/5" : "border-line bg-panel"}`}
              >
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      if (!done) completeQuest(quest.id, quest.xpReward, chain.id);
                    }}
                    className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-md border transition ${
                      done
                        ? "border-green/50 bg-green/10 text-green"
                        : "border-line bg-void/60 text-muted hover:border-signal hover:text-signal"
                    }`}
                    aria-label={done ? "Mission complete" : "Mark mission complete"}
                  >
                    {done ? <Check className="h-4 w-4" /> : <span className="font-mono text-xs">{index + 1}</span>}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-base font-bold ${done ? "text-soft line-through" : "text-ink"}`}>
                        {quest.title}
                      </h3>
                      <span className="rounded-md border border-signal/30 bg-signal/10 px-2 py-0.5 text-xs font-bold text-signal">
                        +{quest.xpReward} XP
                      </span>
                      {isBoss && <Trophy className="h-4 w-4 text-signal" />}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <code className="min-w-0 flex-1 whitespace-pre-wrap rounded-md border border-line bg-void/50 px-3 py-2 text-xs leading-5 text-soft">
                        {quest.prompt}
                      </code>
                      <CopyButton text={quest.prompt} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
