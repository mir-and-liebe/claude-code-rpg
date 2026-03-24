import { loadSkillTrees } from "@/lib/rpg";
import { SkillTreeCard } from "@/components/SkillTreeCard";

export default function SkillsPage() {
  const trees = loadSkillTrees();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Skill Trees</h1>
        <p className="text-sm text-text-muted mt-0.5">
          6 skill trees designed for PM → Vibecoder growth. Each maps your PM
          intuition to a vibecoding superpower.
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
