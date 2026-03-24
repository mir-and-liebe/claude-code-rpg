import { getCharacterProfile, loadSkillTrees, getTreeProgress } from "@/lib/rpg";
import { CharacterCard } from "@/components/CharacterCard";
import { SkillTreeCard } from "@/components/SkillTreeCard";
import { BadgeGrid } from "@/components/BadgeGrid";

export default function DashboardPage() {
  const profile = getCharacterProfile();
  const trees = loadSkillTrees();

  const totalSkills = trees.reduce((s, t) => s + t.nodes.length, 0);
  const completedSkills = trees.reduce(
    (s, t) => s + t.nodes.filter((n) => n.completed).length,
    0
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Your vibecoding journey at a glance
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Overall Progress</p>
          <p className="text-lg font-bold text-accent-glow">
            {completedSkills}/{totalSkills} skills
          </p>
        </div>
      </div>

      <CharacterCard profile={profile} />

      <div>
        <h2 className="text-lg font-bold mb-3">Skill Trees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trees.map((tree) => (
            <SkillTreeCard key={tree.id} tree={tree} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-3">Badges</h2>
        <BadgeGrid badges={profile.badges} />
      </div>

      <div className="bg-surface rounded-xl border border-border p-5">
        <h2 className="text-lg font-bold mb-3">Vault Stats</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {[
            { label: "Rules", value: 66 },
            { label: "Commands", value: 60 },
            { label: "Agents", value: 28 },
            { label: "Skills", value: 91 },
            { label: "MCPs", value: 24 },
            { label: "CLIs", value: 14 },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-accent-glow">
                {stat.value}
              </p>
              <p className="text-[10px] text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
