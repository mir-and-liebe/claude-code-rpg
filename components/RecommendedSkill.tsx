"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import type { SkillTree, CharacterClass, SkillNode } from "@/lib/types";
import { isSkillRevealed } from "@/lib/rpg";
import { treeIconMap } from "@/lib/icons";

const CLASS_BONUS_TREES: Record<string, string[]> = {
  architect: ["prompt-architect", "agent-craft"],
  operator: ["cli-dominance", "mcp-mastery"],
  shipper: ["product-shipper", "code-comprehension"],
};

interface Props {
  trees: SkillTree[];
  completedSkills: Set<string>;
  characterClass: CharacterClass;
}

export function RecommendedSkill({
  trees,
  completedSkills,
  characterClass,
}: Props) {
  // Find the lowest-level incomplete, revealed skill
  // Prioritize class bonus trees
  const bonusTrees = CLASS_BONUS_TREES[characterClass] || [];
  const sortedTrees = [...trees].sort((a, b) => {
    const aBonus = bonusTrees.includes(a.id) ? -1 : 0;
    const bBonus = bonusTrees.includes(b.id) ? -1 : 0;
    return aBonus - bBonus;
  });

  let bestNode: SkillNode | null = null;
  let bestTree: SkillTree | null = null;

  for (const tree of sortedTrees) {
    for (const node of tree.nodes) {
      if (node.completed) continue;
      if (!isSkillRevealed(node, tree, completedSkills)) continue;
      if (!bestNode || node.level < bestNode.level) {
        bestNode = node;
        bestTree = tree;
      }
      break; // Take first incomplete revealed node per tree
    }
  }

  if (!bestNode || !bestTree) return null;

  const Icon = treeIconMap[bestTree.icon];

  return (
    <Link href={`/skills/${bestTree.id}`} prefetch={true}>
      <div className="card p-5 cursor-pointer group">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-gold" />
          <span className="text-[10px] text-gold tracking-widest uppercase font-mono">
            Recommended Next
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${bestTree.color}10` }}
          >
            {Icon && (
              <Icon
                className="w-4 h-4"
                style={{ color: bestTree.color }}
              />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold group-hover:text-gold transition-colors duration-300">
              {bestNode.name}
            </p>
            <p className="text-[11px] text-text-muted">
              {bestTree.name} &middot; Lv. {bestNode.level} &middot;{" "}
              {bestNode.xpRequired} XP
              {bonusTrees.includes(bestTree.id) && (
                <span className="text-gold ml-1">(+25% bonus)</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
