"use client";

import { ArrowLeft, Loader2, Zap } from "lucide-react";
import combosData from "@/data/combos.json";
import type { SkillCombo } from "@/lib/types";
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
  const { completedSkills, loading, toggleSkill, challengeSkill, progress: progressData } = useProgress();
  const verifiedSkills = new Set(progressData?.verified_skills || []);

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
        {/* Combos involving this tree */}
        {(() => {
          const treeCombos = (combosData as SkillCombo[]).filter((c) =>
            c.skills.some((s) => tree.nodes.some((n) => n.id === s))
          );
          if (treeCombos.length === 0) return null;
          return (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] text-text-muted tracking-widest uppercase font-mono mb-2 flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                Combos in this tree
              </p>
              <div className="flex flex-wrap gap-2">
                {treeCombos.map((c) => {
                  const unlocked = c.skills.every((s) => completedSkills.has(s));
                  return (
                    <span
                      key={c.id}
                      className={`text-[10px] px-2 py-1 rounded-lg border font-mono ${
                        unlocked
                          ? "border-gold/20 bg-gold/5 text-gold"
                          : "border-border text-text-muted"
                      }`}
                    >
                      {c.name} (+{c.bonusXp} XP)
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })()}
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
              onChallenge={challengeSkill}
              revealed={isSkillRevealed(node, tree, completedSkills)}
              verified={verifiedSkills.has(node.id)}
              step={`Step ${i + 1} of ${tree.nodes.length}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
