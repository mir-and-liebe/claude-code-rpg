"use client";

import { useProgress } from "@/lib/use-progress";
import {
  levelFromXp,
  getRank,
  xpForLevel,
  totalXpForLevel,
  evaluateBadges,
  evaluateCombos,
  getCurrentChapter,
} from "@/lib/rpg";
import { calculateTotalXp } from "@/lib/supabase";
import type { SkillTree, CharacterClass } from "@/lib/types";
import { CharacterCard } from "@/components/CharacterCard";
import { SkillTreeCard } from "@/components/SkillTreeCard";
import { BadgeGrid } from "@/components/BadgeGrid";
import { DailyQuest } from "@/components/DailyQuest";
import { StreakBadge } from "@/components/StreakBadge";
import { ComboCard } from "@/components/ComboCard";
import { questChains } from "@/data/quests";
import narrativeData from "@/data/narrative.json";
import skillTreesData from "@/data/skills.json";
import { SkeletonDashboard } from "@/components/Skeleton";
import Link from "next/link";
import { BookOpen as BookOpenDash } from "lucide-react";
import {
  FileText,
  TerminalSquare,
  Bot,
  Sparkles,
  Plug,
  Wrench,
  Scroll,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// Dynamic vault stats from vault JSON files
function getVaultStats() {
  try {
    const cmds = require("@/data/vault/commands.json");
    const agents = require("@/data/vault/agents.json");
    const rules = require("@/data/vault/rules.json");
    const skills = require("@/data/vault/skills.json");
    const mcps = require("@/data/vault/mcps.json");
    const clis = require("@/data/vault/clis.json");
    return [
      { label: "Rules", value: rules?.count || 66, Icon: FileText },
      { label: "Commands", value: cmds?.count || 60, Icon: TerminalSquare },
      { label: "Agents", value: agents?.count || 28, Icon: Bot },
      { label: "Skills", value: skills?.count || 91, Icon: Sparkles },
      { label: "MCPs", value: mcps?.count || 24, Icon: Plug },
      { label: "CLIs", value: clis?.count || 14, Icon: Wrench },
    ];
  } catch {
    return [
      { label: "Rules", value: 66, Icon: FileText },
      { label: "Commands", value: 60, Icon: TerminalSquare },
      { label: "Agents", value: 28, Icon: Bot },
      { label: "Skills", value: 91, Icon: Sparkles },
      { label: "MCPs", value: 24, Icon: Plug },
      { label: "CLIs", value: 14, Icon: Wrench },
    ];
  }
}

export default function DashboardPage() {
  const { completedSkills, completedQuests, questXp, loading, progress } = useProgress();

  if (loading || !progress) {
    return <SkeletonDashboard />;
  }

  const charClass = (progress.character_class || "") as CharacterClass;
  const trees: SkillTree[] = (skillTreesData as SkillTree[]).map((t) => ({
    ...t,
    nodes: t.nodes.map((n) => ({ ...n, completed: completedSkills.has(n.id) })),
  }));

  const totalXp = calculateTotalXp(Array.from(completedSkills), charClass);
  const level = levelFromXp(totalXp);
  const currentLevelXp = totalXpForLevel(level);
  const nextLevelXp = xpForLevel(level);

  const badges = evaluateBadges(trees);
  const combos = evaluateCombos(completedSkills);

  const profile = {
    name: progress.character_name,
    title: progress.character_title,
    level,
    totalXp,
    xpToNextLevel: nextLevelXp - (totalXp - currentLevelXp),
    rank: getRank(level),
    characterClass: charClass,
    avatar: progress.avatar,
    badges,
    skillTrees: trees,
    streakCurrent: progress.streak_current,
    streakBest: progress.streak_best,
  };

  // Current narrative chapter
  const totalSkillCount = trees.reduce((s, t) => s + t.nodes.length, 0);
  const chapterId = getCurrentChapter(completedSkills.size, totalSkillCount);
  const vaultStats = getVaultStats();
  const chapter = narrativeData.find((c) => c.id === chapterId);

  // Quest progress stats
  const totalQuestCount = questChains.reduce((s, c) => s + c.quests.length, 0);
  const doneQuestCount = questChains.reduce(
    (s, c) => s + c.quests.filter((q) => completedQuests.has(q.id)).length,
    0
  );
  const chainsComplete = questChains.filter((c) =>
    c.quests.every((q) => completedQuests.has(q.id))
  ).length;
  const isNewUser = doneQuestCount === 0 && completedSkills.size === 0;

  // Find the first incomplete chain for "next quest" recommendation
  const nextChain = questChains.find(
    (c) => !c.quests.every((q) => completedQuests.has(q.id))
  );
  const nextQuest = nextChain?.quests.find((q) => !completedQuests.has(q.id));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Your vibecoding journey at a glance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StreakBadge
            current={progress.streak_current}
            best={progress.streak_best}
          />
          <div className="text-right">
            <p className="text-[10px] text-text-muted tracking-widest uppercase">
              Progress
            </p>
            <p className="text-xl text-gold font-mono mt-0.5">
              {doneQuestCount}/{totalQuestCount} quests
            </p>
          </div>
        </div>
      </div>

      {/* New User Hero — quest-first onboarding */}
      {isNewUser && (
        <Link href="/quests/basics" className="block">
          <div className="card p-8 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent cursor-pointer group">
            <div className="flex items-center gap-2 mb-3">
              <Scroll className="w-5 h-5 text-gold" />
              <span className="text-[10px] text-gold tracking-widest uppercase font-mono">
                Start Your Journey
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-text group-hover:text-gold transition-colors">
              The Awakening
            </h2>
            <p className="text-sm text-text-muted mt-2 max-w-lg">
              Learn Claude Code through hands-on quests. Complete exercises, earn XP,
              unlock skills, and level up your character. Your first quest chain
              teaches the fundamentals.
            </p>
            <div className="flex items-center gap-2 mt-4 text-gold text-sm font-medium">
              Begin first quest
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      )}

      <CharacterCard profile={profile} />

      {/* Quest Progress — the primary section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Quests</h2>
          <Link
            href="/quests"
            className="text-xs text-text-muted hover:text-gold transition-colors flex items-center gap-1"
          >
            All chains <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Next quest recommendation */}
        {nextChain && nextQuest && !isNewUser && (
          <Link href={`/quests/${nextChain.id}`} className="block mb-4">
            <div className="card card-interactive p-5 border-gold/15 cursor-pointer group">
              <div className="flex items-center gap-2 mb-2">
                <Scroll className="w-4 h-4 text-gold" />
                <span className="text-[10px] text-gold tracking-widest uppercase font-mono">
                  Next Quest
                </span>
              </div>
              <p className="text-sm font-semibold group-hover:text-gold transition-colors">
                {nextChain.name}: {nextQuest.title}
              </p>
              <p className="text-[11px] text-text-muted mt-1">
                +{nextQuest.xpReward} XP &middot; {nextChain.description}
              </p>
            </div>
          </Link>
        )}

        {/* Quest chain stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-4 text-center">
            <p className="text-2xl font-mono text-gold">{doneQuestCount}</p>
            <p className="text-[10px] text-text-muted tracking-wide mt-1">Quests Done</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-mono text-text">{chainsComplete}/{questChains.length}</p>
            <p className="text-[10px] text-text-muted tracking-wide mt-1">Chains Complete</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-2xl font-mono text-gold">{questXp}</p>
            <p className="text-[10px] text-text-muted tracking-wide mt-1">Quest XP</p>
          </div>
        </div>
      </section>

      {/* Daily Quest + Anki + Chapter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DailyQuest />
        <Link
          href="/anki"
          className="card card-interactive p-5 gold-accent cursor-pointer group"
        >
          <div className="flex items-center gap-2 mb-2">
            <BookOpenDash className="w-4 h-4 text-gold" />
            <span className="text-[10px] text-gold tracking-widest uppercase font-mono">
              Anki Deck
            </span>
          </div>
          <p className="text-sm font-semibold group-hover:text-gold transition-colors">
            {progress.anki_xp || 0} XP earned
          </p>
          <p className="text-[11px] text-text-muted mt-1">
            Flashcards for permanent knowledge
          </p>
        </Link>
        {chapter && (
          <div className="card p-5 gold-accent">
            <div className="flex items-center gap-2 mb-2">
              <Scroll className="w-4 h-4 text-gold" />
              <span className="text-[10px] text-gold tracking-widest uppercase font-mono">
                Current Chapter
              </span>
            </div>
            <p className="text-sm font-semibold">{chapter.title}</p>
            <p className="text-[11px] text-text-muted mt-1 line-clamp-2">
              {chapter.text}
            </p>
          </div>
        )}
      </div>

      {/* Skill Trees — unlocked via quests */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Skill Trees</h2>
          <span className="text-[11px] text-text-muted">
            {completedSkills.size}/{totalSkillCount} unlocked
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trees.map((tree) => (
            <SkillTreeCard
              key={tree.id}
              tree={tree}
              completedSkills={completedSkills}
            />
          ))}
        </div>
      </section>

      <section>
        <ComboCard combos={combos} totalCombos={6} />
      </section>

      <section>
        <h2 className="text-xl mb-4">Badges</h2>
        <BadgeGrid badges={badges} />
      </section>

      <section className="card p-6">
        <h2 className="text-xl mb-5">Vault Stats</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
          {vaultStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.Icon className="w-4 h-4 text-text-muted mx-auto mb-2" />
              <p className="text-2xl font-mono text-text">{stat.value}</p>
              <p className="text-[11px] text-text-muted mt-0.5 tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
