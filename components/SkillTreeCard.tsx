import Link from "next/link";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { getTreeProgress, isSkillRevealed } from "@/lib/rpg";
import { treeIconMap } from "@/lib/icons";
import type { SkillTree } from "@/lib/types";

interface Props {
  tree: SkillTree;
  completedSkills: Set<string>;
}

export function SkillTreeCard({ tree, completedSkills }: Props) {
  const progress = getTreeProgress(tree);
  const Icon = treeIconMap[tree.icon];

  return (
    <Link href={`/skills/${tree.id}`} className="group block">
      <article className="interactive h-full rounded-lg border border-line bg-panel p-4">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="grid h-11 w-11 place-items-center rounded-md border border-line bg-void/50"
              style={{ color: tree.color }}
            >
              {Icon && <Icon className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink transition group-hover:text-signal">
                {tree.name}
              </h2>
              <p className="text-xs text-muted">{tree.tagline}</p>
            </div>
          </div>
          <ArrowRight className="mt-1 h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-signal" />
        </div>

        <p className="min-h-[3rem] text-sm leading-6 text-soft">{tree.pmSuperpower}</p>

        <div className="mt-5 flex items-center gap-2">
          {tree.nodes.map((node) => {
            const revealed = isSkillRevealed(node, tree, completedSkills);
            return (
              <div
                key={node.id}
                className={`grid h-8 w-8 place-items-center rounded-md border text-xs font-bold ${
                  node.completed
                    ? "border-green/40 bg-green/10 text-green"
                    : revealed
                      ? "border-line bg-void/50 text-soft"
                      : "border-line bg-void/30 text-muted"
                }`}
                title={node.name}
              >
                {node.completed ? <Check className="h-4 w-4" /> : revealed ? node.level : <LockKeyhole className="h-3.5 w-3.5" />}
              </div>
            );
          })}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span>{progress.completed}/{progress.total} skills</span>
            <span>{progress.percentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-void">
            <div className="h-full" style={{ width: `${progress.percentage}%`, backgroundColor: tree.color }} />
          </div>
        </div>
      </article>
    </Link>
  );
}
