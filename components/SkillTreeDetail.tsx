"use client";

import { useState } from "react";
import type { SkillTree } from "@/lib/types";
import { getTreeProgress } from "@/lib/rpg";
import { SkillNode } from "@/components/SkillNode";
import { XPBar } from "@/components/XPBar";
import Link from "next/link";

const iconMap: Record<string, string> = {
  Wand2: "✨",
  Terminal: "💻",
  Plug: "🔌",
  Bot: "🤖",
  Rocket: "🚀",
  BookOpen: "📖",
};

interface Props {
  initialTree: SkillTree;
  completedIds: string[];
}

export function SkillTreeDetail({ initialTree, completedIds }: Props) {
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(
    new Set(completedIds)
  );

  const tree: SkillTree = {
    ...initialTree,
    nodes: initialTree.nodes.map((n) => ({
      ...n,
      completed: completedSkills.has(n.id),
    })),
  };

  const progress = getTreeProgress(tree);

  function handleToggle(nodeId: string) {
    setCompletedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/skills"
        className="text-xs text-text-muted hover:text-accent-glow transition-colors"
      >
        ← Back to Skill Trees
      </Link>

      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-3xl">{iconMap[tree.icon] || "⭐"}</span>
          <div>
            <h1 className="text-2xl font-bold">{tree.name}</h1>
            <p className="text-sm text-text-muted">{tree.tagline}</p>
          </div>
        </div>
        <p className="text-xs text-accent-glow/70 italic mb-4">
          PM superpower: {tree.pmSuperpower}
        </p>
        <XPBar
          current={progress.xpEarned}
          max={progress.xpTotal}
          label={`${progress.completed}/${progress.total} skills complete`}
          color={tree.color}
        />
      </div>

      <div className="space-y-3">
        {tree.nodes.map((node, i) => (
          <div key={node.id} className="relative">
            {i > 0 && (
              <div className="absolute left-[19px] -top-3 h-3 w-0.5 bg-border" />
            )}
            <SkillNode
              node={node}
              color={tree.color}
              onToggle={handleToggle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
