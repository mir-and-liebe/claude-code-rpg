import {
  getCharacterProfile,
  loadSkillTrees,
} from "@/lib/rpg";
import { CharacterCard } from "@/components/CharacterCard";
import { SkillTreeCard } from "@/components/SkillTreeCard";
import { BadgeGrid } from "@/components/BadgeGrid";
import {
  FileText,
  TerminalSquare,
  Bot,
  Sparkles,
  Plug,
  Wrench,
} from "lucide-react";

const vaultStats = [
  { label: "Rules", value: 66, Icon: FileText },
  { label: "Commands", value: 60, Icon: TerminalSquare },
  { label: "Agents", value: 28, Icon: Bot },
  { label: "Skills", value: 91, Icon: Sparkles },
  { label: "MCPs", value: 24, Icon: Plug },
  { label: "CLIs", value: 14, Icon: Wrench },
];

export default function DashboardPage() {
  const profile = getCharacterProfile();
  const trees = loadSkillTrees();

  const totalSkills = trees.reduce((s, t) => s + t.nodes.length, 0);
  const completedSkills = trees.reduce(
    (s, t) => s + t.nodes.filter((n) => n.completed).length,
    0
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Your vibecoding journey at a glance
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-text-muted tracking-widest uppercase">
            Overall Progress
          </p>
          <p className="text-xl text-gold font-mono mt-0.5">
            {completedSkills}/{totalSkills}
          </p>
        </div>
      </div>

      <CharacterCard profile={profile} />

      <section>
        <h2 className="text-xl mb-4">Skill Trees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trees.map((tree) => (
            <SkillTreeCard key={tree.id} tree={tree} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl mb-4">Badges</h2>
        <BadgeGrid badges={profile.badges} />
      </section>

      <section className="card p-6">
        <h2 className="text-xl mb-5">Vault Stats</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
          {vaultStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.Icon className="w-4 h-4 text-text-muted mx-auto mb-2" />
              <p className="text-2xl font-mono text-text">{stat.value}</p>
              <p className="text-[11px] text-text-muted mt-0.5 tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
