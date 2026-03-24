"use client";

import { useProgress } from "@/lib/use-progress";
import {
  getTreeProgress,
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
import { RecommendedSkill } from "@/components/RecommendedSkill";
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
  const { completedSkills, loading, progress } = useProgress();

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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
              {completedSkills.size}/{totalSkillCount} skills
            </p>
          </div>
        </div>
      </div>

      <CharacterCard profile={profile} />

      <RecommendedSkill
        trees={trees}
        completedSkills={completedSkills}
        characterClass={charClass}
      />

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

      <section>
        <h2 className="text-xl mb-4">Skill Trees</h2>
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
