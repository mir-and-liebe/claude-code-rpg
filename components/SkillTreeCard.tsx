import Link from "next/link";
import { Check } from "lucide-react";
import type { SkillTree } from "@/lib/types";
import { getTreeProgress } from "@/lib/rpg";
import { treeIconMap } from "@/lib/icons";
import { XPBar } from "./XPBar";

interface Props {
  tree: SkillTree;
}

export function SkillTreeCard({ tree }: Props) {
  const progress = getTreeProgress(tree);
  const Icon = treeIconMap[tree.icon];

  return (
    <Link href={`/skills/${tree.id}`}>
      <div className="bg-surface rounded-xl border border-border p-5 card-hover cursor-pointer group">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${tree.color}15` }}
          >
            {Icon && (
              <Icon className="w-5 h-5" style={{ color: tree.color }} />
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm group-hover:text-accent transition-colors duration-200">
              {tree.name}
            </h3>
            <p className="text-[11px] text-text-muted">{tree.tagline}</p>
          </div>
        </div>
        <p className="text-[10px] text-accent/70 italic mb-3 font-mono">
          PM: {tree.pmSuperpower}
        </p>
        <div className="flex items-center gap-2 mb-3">
          {tree.nodes.map((node) => (
            <div
              key={node.id}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-200 ${
                node.completed
                  ? "border-xp bg-xp/20 text-xp"
                  : "border-border bg-bg text-text-muted"
              }`}
            >
              {node.completed ? (
                <Check className="w-3 h-3" />
              ) : (
                node.level
              )}
            </div>
          ))}
        </div>
        <XPBar
          current={progress.xpEarned}
          max={progress.xpTotal}
          color={tree.color}
        />
        <p className="text-[10px] text-text-muted mt-1.5 text-right font-mono">
          {progress.completed}/{progress.total} skills ({progress.percentage}%)
        </p>
      </div>
    </Link>
  );
}
