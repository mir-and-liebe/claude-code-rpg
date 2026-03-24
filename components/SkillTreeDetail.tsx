"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import type { SkillTree } from "@/lib/types";
import { getTreeProgress, isSkillRevealed } from "@/lib/rpg";
import { treeIconMap } from "@/lib/icons";
import { useProgress } from "@/lib/use-progress";
import { SkillNode } from "@/components/SkillNode";
import { XPBar } from "@/components/XPBar";
import Link from "next/link";

interface Props {
  initialTree: SkillTree;
}

export function SkillTreeDetail({ initialTree }: Props) {
  const { completedSkills, loading, toggleSkill } = useProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
      </div>
    );
  }

  const tree: SkillTree = {
    ...initialTree,
    nodes: initialTree.nodes.map((n) => ({
      ...n,
      completed: completedSkills.has(n.id),
    })),
  };

  const progress = getTreeProgress(tree);
  const Icon = treeIconMap[tree.icon];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/skills"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors duration-300 cursor-pointer"
      >
        <ArrowLeft className="w-3 h-3" />
        <span className="tracking-wide">Back to Skill Trees</span>
      </Link>

      <div className="card p-6">
        <div className="flex items-center gap-5 mb-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${tree.color}10` }}
          >
            {Icon && (
              <Icon className="w-6 h-6" style={{ color: tree.color }} />
            )}
          </div>
          <div>
            <h1 className="text-2xl">{tree.name}</h1>
            <p className="text-sm text-text-secondary mt-0.5">{tree.tagline}</p>
          </div>
        </div>
        <p className="text-[13px] text-text-muted italic mb-5">
          {tree.pmSuperpower}
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
              <div className="absolute left-[19px] -top-3 h-3 w-px bg-border" />
            )}
            <SkillNode
              node={node}
              color={tree.color}
              onToggle={toggleSkill}
              revealed={isSkillRevealed(node, tree, completedSkills)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
