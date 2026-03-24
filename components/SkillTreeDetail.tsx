"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { SkillTree } from "@/lib/types";
import { getTreeProgress } from "@/lib/rpg";
import { treeIconMap } from "@/lib/icons";
import { SkillNode } from "@/components/SkillNode";
import { XPBar } from "@/components/XPBar";
import Link from "next/link";

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
  const Icon = treeIconMap[tree.icon];

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
        className="flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors duration-200 cursor-pointer"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to Skill Trees
      </Link>

      <div className="bg-surface rounded-xl border border-border p-6 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-10"
          style={{ backgroundColor: tree.color }}
        />
        <div className="flex items-center gap-4 mb-2 relative">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${tree.color}15` }}
          >
            {Icon && (
              <Icon className="w-7 h-7" style={{ color: tree.color }} />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{tree.name}</h1>
            <p className="text-sm text-text-muted">{tree.tagline}</p>
          </div>
        </div>
        <p className="text-xs italic mb-4 font-mono" style={{ color: `${tree.color}AA` }}>
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
              <div
                className="absolute left-[19px] -top-3 h-3 w-0.5"
                style={{ backgroundColor: `${tree.color}30` }}
              />
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
