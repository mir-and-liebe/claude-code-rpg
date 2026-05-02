"use client";

import { useProgress } from "@/lib/use-progress";
import { SkeletonProgress } from "@/components/Skeleton";
import {
  getTreeProgress,
  levelFromXp,
  getRank,
  evaluateBadges,
  evaluateCombos,
  totalXpForLevel,
  xpForLevel,
} from "@/lib/rpg";
import { calculateTotalXp } from "@/lib/supabase";
import type { SkillTree, CharacterClass } from "@/lib/types";
import { treeIconMap } from "@/lib/icons";
import { XPBar } from "@/components/XPBar";
import { XPChart } from "@/components/XPChart";
import { CollectionCard } from "@/components/CollectionCard";
import { ExportProgress } from "@/components/ExportProgress";
import combosData from "@/data/combos.json";
import type { SkillCombo } from "@/lib/types";
import skillTreesData from "@/data/skills.json";
import collectionsData from "@/data/collections.json";
import { questChains } from "@/data/quests";
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
  Target,
  RadioTower,
  Sparkles,
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
  const { completedSkills, completedQuests, loading, progress, questXp } = useProgress();

  if (loading || !progress) {
    return <SkeletonProgress />;
  }

  const charClass = (progress.character_class || "") as CharacterClass;
  const trees: SkillTree[] = (skillTreesData as SkillTree[]).map((t) => ({
    ...t,
    nodes: t.nodes.map((n) => ({ ...n, completed: completedSkills.has(n.id) })),
  }));

  const skillXp = calculateTotalXp(Array.from(completedSkills), charClass);
  const ankiXp = progress.anki_xp || 0;
  const combos = evaluateCombos(completedSkills);
  const comboXp = combos.reduce((s, c) => s + c.bonusXp, 0);
  const totalXp = skillXp + questXp + ankiXp + comboXp;
  const level = levelFromXp(totalXp);
  const rank = getRank(level);
  const badges = evaluateBadges(trees);
  const levelBase = totalXpForLevel(level);
  const nextLevel = xpForLevel(level);
  const levelProgress = Math.min(100, Math.round(((totalXp - levelBase) / nextLevel) * 100));
  const totalQuests = questChains.reduce((sum, chain) => sum + chain.quests.length, 0);
  const completedQuestCount = completedQuests.size;

  const treeStats = trees.map((t) => ({
    tree: t,
    progress: getTreeProgress(t),
  }));

  const skillCount = trees.reduce((sum, tree) => sum + tree.nodes.length, 0);

  const statCards = [
    { label: "Level", value: level, detail: rank, Icon: Sparkles, color: "text-signal" },
    { label: "Total XP", value: totalXp.toLocaleString(), detail: `${levelProgress}% to next level`, Icon: Zap, color: "text-xp" },
    { label: "Skills", value: `${completedSkills.size}/${skillCount}`, detail: "arsenal unlocked", Icon: ShieldCheck, color: "text-health" },
    { label: "Quests", value: `${completedQuestCount}/${totalQuests}`, detail: "missions cleared", Icon: RadioTower, color: "text-mana" },
  ];

  const xpSources = [
    { label: "Skill XP", value: skillXp, detail: "from unlocked skill nodes" },
    { label: "Campaign XP", value: questXp, detail: "from completed missions" },
    { label: "Deck XP", value: ankiXp, detail: "from flashcard reviews" },
    { label: "Combo XP", value: comboXp, detail: "from cross-tree synergies" },
  ];

  return (
    <div className="space-y-6">
      <section className="signal-band px-5 py-6 sm:px-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-void/40 px-3 py-1 text-xs font-semibold text-soft">
              <Award className="h-4 w-4 text-signal" />
              Progress Log
            </div>
            <h1 className="max-w-3xl text-4xl font-black text-ink">
              Your shipping signal, polished and legible.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-soft">
              A clean read on what is actually moving: skills unlocked, missions
              cleared, review practice, combos, rank, and streak.
            </p>
          </div>
          <div className="panel-strong p-4">
            <p className="hud-label">Current Rank</p>
            <p className="mt-2 text-2xl font-black text-ink">Lv. {level}</p>
            <p className="text-xs text-muted">{rank}</p>
            <div className="mt-4">
              <ExportProgress
                name={progress.character_name}
                rank={rank}
                level={level}
                totalXp={totalXp}
                trees={trees}
                badges={badges}
                streakBest={progress.streak_best}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="panel p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="hud-label">{stat.label}</p>
              <stat.Icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-3xl font-black text-ink">{stat.value}</p>
            <p className="mt-1 text-xs text-muted">{stat.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="hud-label">Level Flow</p>
              <h2 className="mt-1 text-2xl">{levelProgress}% to Lv. {level + 1}</h2>
            </div>
            <TrendingUp className="h-5 w-5 text-cyan" />
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-void">
            <div className="xp-bar-fill h-full" style={{ width: `${levelProgress}%` }} />
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted">
            <span>{totalXp.toLocaleString()} XP banked</span>
            <span>{nextLevel.toLocaleString()} XP level span</span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {xpSources.map((source) => (
              <div key={source.label} className="rounded-md border border-line bg-void/40 p-4">
                <p className="hud-label">{source.label}</p>
                <p className="mt-2 font-mono text-2xl font-black text-ink">
                  {source.value.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted">{source.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <XPChart data={progress.xp_history} />
      </section>

      <section className="panel p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="hud-label">Arsenal Breakdown</p>
            <h2 className="mt-1 text-2xl">Skill trees with room to grow</h2>
          </div>
          <Gauge className="h-5 w-5 text-signal" />
        </div>
        <div className="space-y-6">
          {treeStats.map(({ tree, progress: tp }) => {
            const Icon = treeIconMap[tree.icon];
            return (
              <div key={tree.id}>
                <div className="flex items-center gap-2.5 mb-2">
                  {Icon && (
                    <Icon className="w-4 h-4" style={{ color: tree.color }} />
                  )}
                  <span className="text-sm font-semibold">{tree.name}</span>
                  <span className="text-[11px] text-text-muted ml-auto font-mono">
                    {tp.completed}/{tp.total}
                  </span>
                </div>
                <XPBar
                  current={tp.xpEarned}
                  max={tp.xpTotal}
                  color={tree.color}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="hud-label">Collections</p>
            <h2 className="mt-1 text-2xl">Badges with a little shine</h2>
          </div>
          <Award className="h-5 w-5 text-green" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {collectionsData.map((col) => (
            <CollectionCard key={col.id} collection={col} badges={badges} />
          ))}
        </div>
      </section>

      {/* Combos close to unlocking */}
      {(() => {
        const allCombos = combosData as SkillCombo[];
        const nearCombos = allCombos.filter((c) => {
          const done = c.skills.filter((s) => completedSkills.has(s)).length;
          return done > 0 && done < c.skills.length;
        });
        if (nearCombos.length === 0) return null;
        return (
          <section className="panel p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="hud-label">Almost There</p>
                <h2 className="mt-1 text-2xl">Near-unlocked combos</h2>
              </div>
              <Target className="h-5 w-5 text-violet" />
            </div>
            <div className="space-y-2">
              {nearCombos.map((combo) => {
                const done = combo.skills.filter((s) => completedSkills.has(s)).length;
                return (
                  <div key={combo.id} className="flex items-center justify-between rounded-md border border-line bg-void/40 px-3 py-2.5">
                    <div>
                      <p className="text-sm font-semibold">{combo.name}</p>
                      <p className="text-[11px] text-muted">{combo.description}</p>
                    </div>
                    <span className="ml-3 whitespace-nowrap font-mono text-[11px] text-signal">
                      {done}/{combo.skills.length} skills
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })()}

      <section className="panel p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="hud-label">Ranks</p>
            <h2 className="mt-1 text-2xl">The ladder stays visible</h2>
          </div>
          <Crown className="h-5 w-5 text-signal" />
        </div>
        <div className="space-y-2">
          {ranks.map((r) => {
            const achieved = level >= r.level;
            return (
              <div
                key={r.rank}
                className={`flex items-center gap-3 rounded-md px-4 py-3 transition-all duration-300 ${
                  achieved
                    ? "border border-signal/25 bg-signal/[0.04]"
                    : "border border-line bg-void/40 opacity-50"
                }`}
              >
                <r.Icon
                  className={`h-4 w-4 ${achieved ? "text-signal" : "text-muted"}`}
                />
                <span className="text-sm">{r.rank}</span>
                <span className="ml-auto font-mono text-[11px] text-muted">
                  Lv. {r.level}+
                </span>
                {achieved && <Check className="h-3.5 w-3.5 text-signal" />}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
