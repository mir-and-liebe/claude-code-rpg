"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  GitBranch,
  RadioTower,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { questChains } from "@/data/quests";
import skillTreesData from "@/data/skills.json";
import type { CharacterClass, SkillTree } from "@/lib/types";
import { getRank, levelFromXp, totalXpForLevel, xpForLevel } from "@/lib/rpg";
import { calculateTotalXp } from "@/lib/supabase";
import { useProgress } from "@/lib/use-progress";

const loop = ["Discover", "Plan", "Build", "Test", "Review", "Ship", "Iterate"];

export default function DashboardPage() {
  const { completedSkills, completedQuests, loading, progress, questXp } = useProgress();

  if (loading || !progress) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-sm text-muted">
        Booting mission board...
      </div>
    );
  }

  const charClass = (progress.character_class || "") as CharacterClass;
  const skillXp = calculateTotalXp(Array.from(completedSkills), charClass);
  const totalXp = skillXp + questXp + (progress.anki_xp || 0);
  const level = levelFromXp(totalXp);
  const levelBase = totalXpForLevel(level);
  const nextLevel = xpForLevel(level);
  const levelProgress = Math.min(100, Math.round(((totalXp - levelBase) / nextLevel) * 100));

  const totalQuestCount = questChains.reduce((sum, chain) => sum + chain.quests.length, 0);
  const doneQuestCount = questChains.reduce(
    (sum, chain) => sum + chain.quests.filter((quest) => completedQuests.has(quest.id)).length,
    0
  );
  const chainsComplete = questChains.filter((chain) =>
    chain.quests.every((quest) => completedQuests.has(quest.id))
  ).length;

  const nextChain =
    questChains.find((chain) => !chain.quests.every((quest) => completedQuests.has(quest.id))) ??
    questChains[questChains.length - 1];
  const nextQuest =
    nextChain.quests.find((quest) => !completedQuests.has(quest.id)) ??
    nextChain.quests[nextChain.quests.length - 1];

  const trees = skillTreesData as SkillTree[];
  const completedTreeCount = trees.filter((tree) =>
    tree.nodes.every((node) => completedSkills.has(node.id))
  ).length;
  const nextSkillTree =
    trees.find((tree) => tree.nodes.some((node) => !completedSkills.has(node.id))) ?? trees[0];
  const nextSkill =
    nextSkillTree.nodes.find((node) => !completedSkills.has(node.id)) ?? nextSkillTree.nodes[0];

  const stats = [
    { label: "Level", value: level, detail: getRank(level), Icon: Sparkles },
    { label: "Campaign", value: `${doneQuestCount}/${totalQuestCount}`, detail: "quests cleared", Icon: ScrollText },
    { label: "Arsenal", value: `${completedSkills.size}/${trees.reduce((s, t) => s + t.nodes.length, 0)}`, detail: "skills unlocked", Icon: ShieldCheck },
    { label: "Streak", value: progress.streak_current || 0, detail: "active days", Icon: RadioTower },
  ];

  return (
    <div className="space-y-6">
      <section className="signal-band px-5 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="status-pill">
                <span className="h-1.5 w-1.5 rounded-full bg-green" />
                Live campaign
              </span>
              <span className="status-pill">No lore homework</span>
              <span className="status-pill">Build real habits</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-ink sm:text-6xl">
              Ship small products with AI without losing the plot.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-soft sm:text-base">
              This is a working campaign board for vibecoding: learn the loop, build in
              tiny slices, inspect the output, and turn AI help into shipped software.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/quests/${nextChain.id}`}
                className="inline-flex h-11 items-center gap-2 rounded-md bg-signal px-4 text-sm font-bold text-void transition hover:bg-[#ffd27a]"
              >
                Continue mission
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/vault"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-line-strong px-4 text-sm font-semibold text-ink transition hover:bg-panel-strong"
              >
                Open Codex
                <BookOpen className="h-4 w-4 text-cyan" />
              </Link>
            </div>
          </div>

          <div className="panel-strong p-4">
            <p className="hud-label mb-3">Current Mission</p>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl text-ink">{nextChain.name}</h2>
                <p className="mt-1 text-sm text-soft">{nextQuest.title}</p>
              </div>
              <span className="rounded-md border border-signal/40 bg-signal/10 px-2 py-1 text-xs font-bold text-signal">
                +{nextQuest.xpReward} XP
              </span>
            </div>
            <p className="mt-4 rounded-md border border-line bg-void/40 p-3 font-mono text-xs leading-5 text-soft">
              {nextQuest.prompt}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="panel p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="hud-label">{stat.label}</p>
              <stat.Icon className="h-4 w-4 text-signal" />
            </div>
            <p className="text-3xl font-black text-ink">{stat.value}</p>
            <p className="mt-1 text-xs text-muted">{stat.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="hud-label">Mastery Signal</p>
              <h2 className="mt-1 text-2xl">Lv. {level} {getRank(level)}</h2>
            </div>
            <p className="font-mono text-sm text-signal">{totalXp} XP</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-void">
            <div className="xp-bar-fill h-full" style={{ width: `${levelProgress}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted">
            <span>{levelProgress}% to next level</span>
            <span>{chainsComplete}/{questChains.length} chains complete</span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/skills" className="interactive rounded-md border border-line bg-void/40 p-4">
              <p className="hud-label">Next Unlock</p>
              <p className="mt-2 text-sm font-semibold text-ink">{nextSkill.name}</p>
              <p className="mt-1 text-xs text-muted">{nextSkillTree.name}</p>
            </Link>
            <Link href="/vault" className="interactive rounded-md border border-line bg-void/40 p-4">
              <p className="hud-label">Best Kept System</p>
              <p className="mt-2 text-sm font-semibold text-ink">Reusable context</p>
              <p className="mt-1 text-xs text-muted">Rules, agents, commands, MCPs</p>
            </Link>
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="hud-label">The Loop</p>
              <h2 className="mt-1 text-2xl">One repeatable shipping rhythm</h2>
            </div>
            <GitBranch className="h-5 w-5 text-cyan" />
          </div>
          <div className="grid gap-2 sm:grid-cols-7">
            {loop.map((step, index) => (
              <div
                key={step}
                className="rounded-md border border-line bg-void/40 p-3 text-center"
              >
                <p className="font-mono text-xs text-signal">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-1 text-xs font-semibold text-soft">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link href="/quests" className="interactive rounded-md border border-line bg-void/40 p-4">
              <CheckCircle2 className="mb-3 h-5 w-5 text-green" />
              <p className="text-sm font-semibold text-ink">Play campaign</p>
              <p className="mt-1 text-xs text-muted">Hands-on missions</p>
            </Link>
            <Link href="/anki" className="interactive rounded-md border border-line bg-void/40 p-4">
              <Brain className="mb-3 h-5 w-5 text-violet" />
              <p className="text-sm font-semibold text-ink">Train memory</p>
              <p className="mt-1 text-xs text-muted">Flashcards that stick</p>
            </Link>
            <Link href="/progress" className="interactive rounded-md border border-line bg-void/40 p-4">
              <RadioTower className="mb-3 h-5 w-5 text-cyan" />
              <p className="text-sm font-semibold text-ink">Read log</p>
              <p className="mt-1 text-xs text-muted">Track momentum</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
