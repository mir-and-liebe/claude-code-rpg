import Link from "next/link";
import { Check, Lock } from "lucide-react";
import type { SkillTree } from "@/lib/types";
import { getTreeProgress, isSkillRevealed } from "@/lib/rpg";
import { treeIconMap } from "@/lib/icons";
import { XPBar } from "./XPBar";

interface Props {
  tree: SkillTree;
  completedSkills: Set<string>;
}

export function SkillTreeCard({ tree, completedSkills }: Props) {
  const progress = getTreeProgress(tree);
  const Icon = treeIconMap[tree.icon];

  return (
    <Link href={`/skills/${tree.id}`}>
      <div className="card p-5 cursor-pointer group">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${tree.color}10` }}
          >
            {Icon && (
              <Icon className="w-4 h-4" style={{ color: tree.color }} />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text group-hover:text-gold transition-colors duration-300" style={{ fontFamily: "Inter, sans-serif" }}>
              {tree.name}
            </h3>
            <p className="text-[11px] text-text-muted">{tree.tagline}</p>
          </div>
        </div>
        <p className="text-[11px] text-text-muted italic mb-4 leading-relaxed">
          {tree.pmSuperpower}
        </p>
        <div className="flex items-center gap-2 mb-3">
          {tree.nodes.map((node) => {
            const revealed = isSkillRevealed(node, tree, completedSkills);
            return (
              <div
                key={node.id}
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-mono transition-all duration-300 ${
                  node.completed
                    ? "border-gold/40 bg-gold/10 text-gold"
                    : revealed
                      ? "border-border bg-bg text-text-muted"
                      : "border-border bg-bg"
                }`}
              >
                {node.completed ? (
                  <Check className="w-2.5 h-2.5" />
                ) : revealed ? (
                  node.level
                ) : (
                  <Lock className="w-2 h-2 text-text-muted" />
                )}
              </div>
            );
          })}
        </div>
        <XPBar
          current={progress.xpEarned}
          max={progress.xpTotal}
          color={tree.color}
        />
        <p className="text-[11px] text-text-muted mt-2 text-right font-mono">
          {progress.completed}/{progress.total} ({progress.percentage}%)
        </p>
      </div>
    </Link>
  );
}
