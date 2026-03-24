"use client";

import {
  loadSkillTrees,
  getTreeProgress,
  getCharacterProfile,
} from "@/lib/rpg";
import { treeIconMap } from "@/lib/icons";
import { XPBar } from "@/components/XPBar";
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
  Target,
  Gauge,
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
  const profile = getCharacterProfile();
  const trees = loadSkillTrees();

  const treeStats = trees.map((t) => ({
    tree: t,
    progress: getTreeProgress(t),
  }));

  const totalXpPossible = treeStats.reduce(
    (s, t) => s + t.progress.xpTotal,
    0
  );

  const statCards = [
    { label: "Level", value: profile.level, Icon: TrendingUp, color: "text-accent" },
    { label: "Total XP", value: profile.totalXp.toLocaleString(), Icon: Zap, color: "text-xp" },
    { label: "Badges", value: profile.badges.filter((b) => b.unlocked).length, Icon: Award, color: "text-health" },
    { label: "Completion", value: `${Math.round((profile.totalXp / totalXpPossible) * 100)}%`, Icon: Gauge, color: "text-mana" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold glitch-hover">Progress</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Track your vibecoding journey across all skill trees
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-xl border border-border p-4 text-center card-hover"
          >
            <div className="flex justify-center mb-1.5">
              <stat.Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-2xl font-bold font-mono ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-xs text-text-muted font-mono">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-accent" />
          <h2 className="text-lg font-bold">Skill Tree Breakdown</h2>
        </div>
        <div className="space-y-5">
          {treeStats.map(({ tree, progress }) => {
            const Icon = treeIconMap[tree.icon];
            return (
              <div key={tree.id}>
                <div className="flex items-center gap-2 mb-2">
                  {Icon && (
                    <Icon
                      className="w-4 h-4"
                      style={{ color: tree.color }}
                    />
                  )}
                  <span className="text-sm font-bold">{tree.name}</span>
                  <span className="text-[10px] text-text-muted ml-auto font-mono">
                    {progress.completed}/{progress.total} skills
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

      <div className="bg-surface rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-xp" />
          <h2 className="text-lg font-bold">Rank Progression</h2>
        </div>
        <div className="space-y-3">
          {ranks.map((r) => {
            const achieved = profile.level >= r.level;
            return (
              <div
                key={r.rank}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  achieved
                    ? "bg-accent/10 border border-accent/20"
                    : "bg-bg border border-border opacity-50"
                }`}
              >
                <r.Icon
                  className={`w-5 h-5 ${
                    achieved ? "text-accent" : "text-text-muted"
                  }`}
                />
                <span className="text-sm font-medium">{r.rank}</span>
                <span className="text-[10px] text-text-muted ml-auto font-mono">
                  Level {r.level}+
                </span>
                {achieved && <Check className="w-4 h-4 text-health" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
