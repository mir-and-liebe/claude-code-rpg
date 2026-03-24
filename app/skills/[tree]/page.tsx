import type { SkillTree } from "@/lib/types";
import skillTreesData from "@/data/skills.json";
import progressData from "@/data/progress.json";
import { SkillTreeDetail } from "@/components/SkillTreeDetail";
import Link from "next/link";

export function generateStaticParams() {
  return (skillTreesData as SkillTree[]).map((tree) => ({
    tree: tree.id,
  }));
}

export default async function SkillTreePage({
  params,
}: {
  params: Promise<{ tree: string }>;
}) {
  const { tree: treeId } = await params;
  const rawTree = (skillTreesData as SkillTree[]).find((t) => t.id === treeId);

  if (!rawTree) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-text-muted">Skill tree not found</p>
        <Link
          href="/skills"
          className="text-accent-glow hover:underline text-sm mt-2 inline-block"
        >
          Back to Skill Trees
        </Link>
      </div>
    );
  }

  return (
    <SkillTreeDetail
      initialTree={rawTree}
      completedIds={progressData.completedSkills as string[]}
    />
  );
}
