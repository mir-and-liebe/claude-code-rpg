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
    { label: "Level", value: profile.level, Icon: TrendingUp, color: "text-gold" },
    { label: "Total XP", value: profile.totalXp.toLocaleString(), Icon: Zap, color: "text-xp" },
    { label: "Badges", value: profile.badges.filter((b) => b.unlocked).length, Icon: Award, color: "text-health" },
    { label: "Completion", value: `${Math.round((profile.totalXp / totalXpPossible) * 100)}%`, Icon: Gauge, color: "text-mana" },
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
                    <Icon
                      className="w-4 h-4"
                      style={{ color: tree.color }}
                    />
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
            const achieved = profile.level >= r.level;
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
                  className={`w-4 h-4 ${
                    achieved ? "text-gold" : "text-text-muted"
                  }`}
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
