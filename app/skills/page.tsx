"use client";

import { useState } from "react";
import { useProgress } from "@/lib/use-progress";
import { getTreeProgress } from "@/lib/rpg";
import type { SkillTree, CharacterClass } from "@/lib/types";
import skillTreesData from "@/data/skills.json";
import { SkillTreeCard } from "@/components/SkillTreeCard";
import { Loader2, ArrowDownAZ, TrendingUp, Sparkles } from "lucide-react";

const CLASS_BONUS_TREES: Record<string, string[]> = {
  architect: ["prompt-architect", "agent-craft"],
  operator: ["cli-dominance", "mcp-mastery"],
  shipper: ["product-shipper", "code-comprehension"],
};

type SortMode = "default" | "completion" | "xp-available" | "class-bonus";

export default function SkillsPage() {
  const { completedSkills, loading, progress } = useProgress();
  const [sort, setSort] = useState<SortMode>("default");
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
      </div>
    );
  }

  const charClass = (progress?.character_class || "") as CharacterClass;
  const bonusTrees = CLASS_BONUS_TREES[charClass] || [];

  let trees: SkillTree[] = (skillTreesData as SkillTree[]).map((t) => ({
    ...t,
    nodes: t.nodes.map((n) => ({ ...n, completed: completedSkills.has(n.id) })),
  }));

  if (showIncompleteOnly) {
    trees = trees.filter((t) => !t.nodes.every((n) => n.completed));
  }

  if (sort === "completion") {
    trees.sort((a, b) => {
      const pa = getTreeProgress(a).percentage;
      const pb = getTreeProgress(b).percentage;
      return pb - pa; // highest first
    });
  } else if (sort === "xp-available") {
    trees.sort((a, b) => {
      const xa = getTreeProgress(a).xpTotal - getTreeProgress(a).xpEarned;
      const xb = getTreeProgress(b).xpTotal - getTreeProgress(b).xpEarned;
      return xb - xa; // most XP available first
    });
  } else if (sort === "class-bonus") {
    trees.sort((a, b) => {
      const aBonus = bonusTrees.includes(a.id) ? -1 : 0;
      const bBonus = bonusTrees.includes(b.id) ? -1 : 0;
      return aBonus - bBonus;
    });
  }

  const sorts: { id: SortMode; label: string }[] = [
    { id: "default", label: "Default" },
    { id: "completion", label: "Most complete" },
    { id: "xp-available", label: "Most XP" },
    ...(charClass ? [{ id: "class-bonus" as SortMode, label: "Class bonus" }] : []),
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl">Skill Trees</h1>
        <p className="text-sm text-text-muted mt-1">
          6 skill trees from foundation to mastery. Start with Prompt Architect if you&apos;re new.
        </p>
      </div>

      {/* Sort + Filter controls */}
      <div className="flex flex-wrap items-center gap-2">
        <ArrowDownAZ className="w-3.5 h-3.5 text-text-muted" />
        {sorts.map((s) => (
          <button
            key={s.id}
            onClick={() => setSort(s.id)}
            className={`text-[11px] px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              sort === s.id
                ? "bg-gold/10 border-gold/20 text-gold"
                : "border-border text-text-muted hover:text-text"
            }`}
          >
            {s.label}
          </button>
        ))}
        <div className="w-px h-5 bg-border mx-1" />
        <button
          onClick={() => setShowIncompleteOnly(!showIncompleteOnly)}
          className={`text-[11px] px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            showIncompleteOnly
              ? "bg-gold/10 border-gold/20 text-gold"
              : "border-border text-text-muted hover:text-text"
          }`}
        >
          Hide completed
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trees.map((tree) => (
          <div key={tree.id} className="relative">
            {tree.id === "prompt-architect" && completedSkills.size === 0 && (
              <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[9px] font-mono">
                <Sparkles className="w-2.5 h-2.5" />
                Start here
              </div>
            )}
            <SkillTreeCard tree={tree} completedSkills={completedSkills} />
          </div>
        ))}
      </div>

      {trees.length === 0 && (
        <p className="text-sm text-text-muted text-center py-12">
          All skill trees completed. You&apos;re a Vibecoding Architect.
        </p>
      )}
    </div>
  );
}
