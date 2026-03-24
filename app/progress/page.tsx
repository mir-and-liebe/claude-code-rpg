"use client";

import { loadSkillTrees, getTreeProgress, getCharacterProfile } from "@/lib/rpg";
import { XPBar } from "@/components/XPBar";

const iconMap: Record<string, string> = {
  Wand2: "✨",
  Terminal: "💻",
  Plug: "🔌",
  Bot: "🤖",
  Rocket: "🚀",
  BookOpen: "📖",
};

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Track your vibecoding journey across all skill trees
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-accent-glow">
            {profile.level}
          </p>
          <p className="text-xs text-text-muted">Level</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-xp">
            {profile.totalXp.toLocaleString()}
          </p>
          <p className="text-xs text-text-muted">Total XP</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-health">
            {profile.badges.filter((b) => b.unlocked).length}
          </p>
          <p className="text-xs text-text-muted">Badges</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-mana">
            {Math.round((profile.totalXp / totalXpPossible) * 100)}%
          </p>
          <p className="text-xs text-text-muted">Completion</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-5">
        <h2 className="text-lg font-bold mb-4">Skill Tree Breakdown</h2>
        <div className="space-y-5">
          {treeStats.map(({ tree, progress }) => (
            <div key={tree.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{iconMap[tree.icon] || "⭐"}</span>
                <span className="text-sm font-bold">{tree.name}</span>
                <span className="text-[10px] text-text-muted ml-auto">
                  {progress.completed}/{progress.total} skills
                </span>
              </div>
              <XPBar
                current={progress.xpEarned}
                max={progress.xpTotal}
                color={tree.color}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-5">
        <h2 className="text-lg font-bold mb-4">Rank Progression</h2>
        <div className="space-y-3">
          {[
            { rank: "Intern", level: 1, icon: "🌱" },
            { rank: "Junior Vibecoder", level: 10, icon: "🔰" },
            { rank: "Vibecoder", level: 20, icon: "⚡" },
            { rank: "Senior Vibecoder", level: 30, icon: "🔥" },
            { rank: "Staff Vibecoder", level: 40, icon: "💎" },
            { rank: "Vibecoding Architect", level: 45, icon: "👑" },
          ].map((r) => (
            <div
              key={r.rank}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                profile.level >= r.level
                  ? "bg-accent/10 border border-accent/30"
                  : "bg-bg border border-border opacity-50"
              }`}
            >
              <span className="text-lg">{r.icon}</span>
              <span className="text-sm font-medium">{r.rank}</span>
              <span className="text-[10px] text-text-muted ml-auto">
                Level {r.level}+
              </span>
              {profile.level >= r.level && (
                <span className="text-xs text-health">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
