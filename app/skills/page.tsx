"use client";

import { useState } from "react";
import { ArrowDownAZ, Boxes, Filter, Sparkles } from "lucide-react";
import { SkillTreeCard } from "@/components/SkillTreeCard";
import skillTreesData from "@/data/skills.json";
import { getTreeProgress } from "@/lib/rpg";
import type { CharacterClass, SkillTree } from "@/lib/types";
import { useProgress } from "@/lib/use-progress";

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
      <div className="grid min-h-[60vh] place-items-center text-sm text-muted">
        Loading arsenal...
      </div>
    );
  }

  const charClass = (progress?.character_class || "") as CharacterClass;
  const bonusTrees = CLASS_BONUS_TREES[charClass] || [];
  const allTrees = skillTreesData as SkillTree[];
  const totalSkills = allTrees.reduce((sum, tree) => sum + tree.nodes.length, 0);

  let trees = allTrees.map((tree) => ({
    ...tree,
    nodes: tree.nodes.map((node) => ({ ...node, completed: completedSkills.has(node.id) })),
  }));

  if (showIncompleteOnly) {
    trees = trees.filter((tree) => !tree.nodes.every((node) => node.completed));
  }

  if (sort === "completion") {
    trees.sort((a, b) => getTreeProgress(b).percentage - getTreeProgress(a).percentage);
  } else if (sort === "xp-available") {
    trees.sort((a, b) => {
      const aProgress = getTreeProgress(a);
      const bProgress = getTreeProgress(b);
      return bProgress.xpTotal - bProgress.xpEarned - (aProgress.xpTotal - aProgress.xpEarned);
    });
  } else if (sort === "class-bonus") {
    trees.sort((a, b) => Number(bonusTrees.includes(b.id)) - Number(bonusTrees.includes(a.id)));
  }

  const sorts: { id: SortMode; label: string }[] = [
    { id: "default", label: "Default" },
    { id: "completion", label: "Most complete" },
    { id: "xp-available", label: "Most XP" },
    ...(charClass ? [{ id: "class-bonus" as SortMode, label: "Class bonus" }] : []),
  ];

  return (
    <div className="space-y-6">
      <section className="signal-band px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-void/40 px-3 py-1 text-xs font-semibold text-soft">
              <Boxes className="h-4 w-4 text-signal" />
              Arsenal
            </div>
            <h1 className="text-4xl font-black text-ink">Unlock the tools that make shipping repeatable.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-soft">
              Skill trees are not trivia. Each one is a capability you use in the loop:
              context, terminal fluency, integrations, agents, product slicing, and code judgment.
            </p>
          </div>
          <div className="panel-strong min-w-[220px] p-4">
            <p className="hud-label">Unlocked</p>
            <p className="mt-2 text-3xl font-black text-ink">{completedSkills.size}/{totalSkills}</p>
            <p className="text-xs text-muted">skills online</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <ArrowDownAZ className="h-4 w-4 text-muted" />
        {sorts.map((item) => (
          <button
            key={item.id}
            onClick={() => setSort(item.id)}
            className={`h-9 rounded-md border px-3 text-xs font-semibold transition ${
              sort === item.id
                ? "border-signal/50 bg-signal/10 text-signal"
                : "border-line text-soft hover:border-line-strong hover:bg-panel-strong hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => setShowIncompleteOnly((value) => !value)}
          className={`ml-0 inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition sm:ml-2 ${
            showIncompleteOnly
              ? "border-cyan/50 bg-cyan/10 text-cyan"
              : "border-line text-soft hover:border-line-strong hover:bg-panel-strong hover:text-ink"
          }`}
        >
          <Filter className="h-4 w-4" />
          Hide complete
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trees.map((tree) => (
          <div key={tree.id} className="relative">
            {tree.id === "prompt-architect" && completedSkills.size === 0 && (
              <div className="absolute -right-2 -top-2 z-10 inline-flex items-center gap-1 rounded-full bg-signal px-2 py-1 text-[10px] font-black uppercase tracking-widest text-void">
                <Sparkles className="h-3 w-3" />
                Start
              </div>
            )}
            <SkillTreeCard tree={tree} completedSkills={completedSkills} />
          </div>
        ))}
      </div>
    </div>
  );
}
