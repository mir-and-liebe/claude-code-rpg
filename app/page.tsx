"use client";

import { useProgress } from "@/lib/use-progress";
import { getTreeProgress, levelFromXp, getRank, xpForLevel, totalXpForLevel } from "@/lib/rpg";
import type { SkillTree, Badge } from "@/lib/types";
import { CharacterCard } from "@/components/CharacterCard";
import { SkillTreeCard } from "@/components/SkillTreeCard";
import { BadgeGrid } from "@/components/BadgeGrid";
import { checkBadgeUnlock } from "@/lib/rpg";
import skillTreesData from "@/data/skills.json";
import badgesData from "@/data/badges.json";
import {
  FileText,
  TerminalSquare,
  Bot,
  Sparkles,
  Plug,
  Wrench,
  Loader2,
} from "lucide-react";

const vaultStats = [
  { label: "Rules", value: 66, Icon: FileText },
  { label: "Commands", value: 60, Icon: TerminalSquare },
  { label: "Agents", value: 28, Icon: Bot },
  { label: "Skills", value: 91, Icon: Sparkles },
  { label: "MCPs", value: 24, Icon: Plug },
  { label: "CLIs", value: 14, Icon: Wrench },
];

export default function DashboardPage() {
  const { completedSkills, loading } = useProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
      </div>
    );
  }

  const trees: SkillTree[] = (skillTreesData as SkillTree[]).map((t) => ({
    ...t,
    nodes: t.nodes.map((n) => ({ ...n, completed: completedSkills.has(n.id) })),
  }));

  const totalXp = trees.reduce((s, t) => s + getTreeProgress(t).xpEarned, 0);
  const level = levelFromXp(totalXp);
  const currentLevelXp = totalXpForLevel(level);
  const nextLevelXp = xpForLevel(level);

  const badges: Badge[] = (badgesData as Badge[]).map((b) => ({
    ...b,
    unlocked: checkBadgeUnlock(b, trees),
  }));

  const profile = {
    name: "Vibecoder",
    title: "Product Manager turned Vibecoder",
    level,
    totalXp,
    xpToNextLevel: nextLevelXp - (totalXp - currentLevelXp),
    rank: getRank(level),
    badges,
    skillTrees: trees,
  };

  const totalSkillCount = trees.reduce((s, t) => s + t.nodes.length, 0);
  const completedCount = completedSkills.size;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Your vibecoding journey at a glance
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-text-muted tracking-widest uppercase">
            Overall Progress
          </p>
          <p className="text-xl text-gold font-mono mt-0.5">
            {completedCount}/{totalSkillCount}
          </p>
        </div>
      </div>

      <CharacterCard profile={profile} />

      <section>
        <h2 className="text-xl mb-4">Skill Trees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trees.map((tree) => (
            <SkillTreeCard key={tree.id} tree={tree} />
          ))}
        </div>
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
