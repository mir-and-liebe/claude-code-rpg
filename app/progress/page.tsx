"use client";

import { useProgress } from "@/lib/use-progress";
import { getTreeProgress, levelFromXp, getRank, xpForLevel, totalXpForLevel, checkBadgeUnlock } from "@/lib/rpg";
import type { SkillTree, Badge } from "@/lib/types";
import { treeIconMap } from "@/lib/icons";
import { XPBar } from "@/components/XPBar";
import skillTreesData from "@/data/skills.json";
import badgesData from "@/data/badges.json";
import {
  Sprout,
  ShieldCheck,
  Zap,
  Flame,
  Gem,
  Crown,
  Check,
  TrendingUp,
  Award,
  Gauge,
  Loader2,
} from "lucide-react";

const ranks = [
  { rank: "Intern", level: 1, Icon: Sprout },
  { rank: "Junior Vibecoder", level: 10, Icon: ShieldCheck },
  { rank: "Vibecoder", level: 20, Icon: Zap },
  { rank: "Senior Vibecoder", level: 30, Icon: Flame },
  { rank: "Staff Vibecoder", level: 40, Icon: Gem },
  { rank: "Vibecoding Architect", level: 45, Icon: Crown },
];

export default function ProgressPage() {
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
  const badges: Badge[] = (badgesData as Badge[]).map((b) => ({
    ...b,
    unlocked: checkBadgeUnlock(b, trees),
  }));

  const treeStats = trees.map((t) => ({
    tree: t,
    progress: getTreeProgress(t),
  }));

  const totalXpPossible = treeStats.reduce(
    (s, t) => s + t.progress.xpTotal,
    0
  );

  const statCards = [
    { label: "Level", value: level, Icon: TrendingUp, color: "text-gold" },
    { label: "Total XP", value: totalXp.toLocaleString(), Icon: Zap, color: "text-xp" },
    { label: "Badges", value: badges.filter((b) => b.unlocked).length, Icon: Award, color: "text-health" },
    { label: "Completion", value: `${totalXpPossible > 0 ? Math.round((totalXp / totalXpPossible) * 100) : 0}%`, Icon: Gauge, color: "text-mana" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl">Progress</h1>
        <p className="text-sm text-text-muted mt-1">
          Track your vibecoding journey across all skill trees
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-5 text-center">
            <stat.Icon className={`w-4 h-4 mx-auto mb-2 ${stat.color}`} />
            <p className={`text-2xl font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-text-muted mt-0.5 tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-xl mb-5">Skill Tree Breakdown</h2>
        <div className="space-y-6">
          {treeStats.map(({ tree, progress }) => {
            const Icon = treeIconMap[tree.icon];
            return (
              <div key={tree.id}>
                <div className="flex items-center gap-2.5 mb-2">
                  {Icon && (
                    <Icon className="w-4 h-4" style={{ color: tree.color }} />
                  )}
                  <span className="text-sm font-semibold">{tree.name}</span>
                  <span className="text-[11px] text-text-muted ml-auto font-mono">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
                <XPBar
                  current={progress.xpEarned}
                  max={progress.xpTotal}
                  color={tree.color}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl mb-5">Rank Progression</h2>
        <div className="space-y-2">
          {ranks.map((r) => {
            const achieved = level >= r.level;
            return (
              <div
                key={r.rank}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  achieved
                    ? "bg-gold/[0.03] border border-gold/15"
                    : "bg-bg border border-border opacity-40"
                }`}
              >
                <r.Icon
                  className={`w-4 h-4 ${achieved ? "text-gold" : "text-text-muted"}`}
                />
                <span className="text-sm">{r.rank}</span>
                <span className="text-[11px] text-text-muted ml-auto font-mono">
                  Lv. {r.level}+
                </span>
                {achieved && <Check className="w-3.5 h-3.5 text-gold" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
