import Link from "next/link";
import type { SkillTree } from "@/lib/types";
import { getTreeProgress } from "@/lib/rpg";
import { XPBar } from "./XPBar";

interface Props {
  tree: SkillTree;
}

export function SkillTreeCard({ tree }: Props) {
  const progress = getTreeProgress(tree);

  const iconMap: Record<string, string> = {
    Wand2: "✨",
    Terminal: "💻",
    Plug: "🔌",
    Bot: "🤖",
    Rocket: "🚀",
    BookOpen: "📖",
  };

  return (
    <Link href={`/skills/${tree.id}`}>
      <div className="bg-surface rounded-xl border border-border p-5 hover:border-accent/50 transition-all hover:glow-accent cursor-pointer group">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{iconMap[tree.icon] || "⭐"}</span>
          <div>
            <h3 className="font-bold text-sm group-hover:text-accent-glow transition-colors">
              {tree.name}
            </h3>
            <p className="text-[11px] text-text-muted">{tree.tagline}</p>
          </div>
        </div>
        <p className="text-[10px] text-accent-glow/70 italic mb-3">
          PM: {tree.pmSuperpower}
        </p>
        <div className="flex items-center gap-3 mb-2">
          {tree.nodes.map((node) => (
            <div
              key={node.id}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                node.completed
                  ? "border-xp bg-xp/20 text-xp"
                  : "border-border bg-bg text-text-muted"
              }`}
            >
              {node.level}
            </div>
          ))}
        </div>
        <XPBar
          current={progress.xpEarned}
          max={progress.xpTotal}
          color={tree.color}
        />
        <p className="text-[10px] text-text-muted mt-1.5 text-right">
          {progress.completed}/{progress.total} skills ({progress.percentage}%)
        </p>
      </div>
    </Link>
  );
}
