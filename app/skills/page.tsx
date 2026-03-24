"use client";

import { useProgress } from "@/lib/use-progress";
import type { SkillTree } from "@/lib/types";
import skillTreesData from "@/data/skills.json";
import { SkillTreeCard } from "@/components/SkillTreeCard";
import { Loader2 } from "lucide-react";

export default function SkillsPage() {
  const { completedSkills, loading } = useProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
      </div>
    );
  }

  const trees: SkillTree[] = (skillTreesData as SkillTree[]).map((t) => ({
    ...t,
    nodes: t.nodes.map((n) => ({ ...n, completed: completedSkills.has(n.id) })),
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl">Skill Trees</h1>
        <p className="text-sm text-text-muted mt-1">
          6 skill trees designed for PM to Vibecoder growth
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trees.map((tree) => (
          <SkillTreeCard key={tree.id} tree={tree} />
        ))}
      </div>
    </div>
  );
}
