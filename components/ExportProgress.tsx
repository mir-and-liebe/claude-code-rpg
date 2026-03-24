"use client";

import { Download } from "lucide-react";
import type { SkillTree, Badge } from "@/lib/types";
import { getTreeProgress } from "@/lib/rpg";

interface Props {
  name: string;
  rank: string;
  level: number;
  totalXp: number;
  trees: SkillTree[];
  badges: Badge[];
  streakBest: number;
}

export function ExportProgress({
  name,
  rank,
  level,
  totalXp,
  trees,
  badges,
  streakBest,
}: Props) {
  function handleExport() {
    const earnedBadges = badges.filter((b) => b.currentTier !== "none");
    const completedSkills = trees.flatMap((t) =>
      t.nodes.filter((n) => n.completed).map((n) => `${t.name}: ${n.name}`)
    );

    const md = `# CC RPG — Progress Export
> Generated ${new Date().toISOString().split("T")[0]}

## Character
- **Name:** ${name}
- **Rank:** ${rank}
- **Level:** ${level}
- **Total XP:** ${totalXp.toLocaleString()}
- **Best Streak:** ${streakBest} days

## Skill Trees
${trees
  .map((t) => {
    const p = getTreeProgress(t);
    return `### ${t.name} (${p.completed}/${p.total} — ${p.percentage}%)
${t.nodes
  .map((n) => `- [${n.completed ? "x" : " "}] Lv.${n.level} ${n.name} (${n.xpRequired} XP)`)
  .join("\n")}`;
  })
  .join("\n\n")}

## Badges (${earnedBadges.length} earned)
${earnedBadges
  .map((b) => {
    const tier = b.tiers.find((t) => t.tier === b.currentTier);
    return `- **${tier?.name}** (${b.currentTier})`;
  })
  .join("\n")}

## Completed Skills (${completedSkills.length}/30)
${completedSkills.map((s) => `- ${s}`).join("\n") || "None yet"}
`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cc-rpg-progress-${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 text-[11px] text-text-muted hover:text-gold transition-colors duration-300 cursor-pointer font-mono"
    >
      <Download className="w-3.5 h-3.5" />
      Export as Markdown
    </button>
  );
}
