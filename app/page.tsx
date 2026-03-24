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
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold glitch-hover">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Your vibecoding journey at a glance
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted font-mono">Overall Progress</p>
          <p className="text-lg font-bold text-accent neon-text-green font-mono">
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
        <h2 className="text-lg font-bold mb-4">Vault Stats</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {vaultStats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="flex justify-center mb-1.5">
                <stat.Icon className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors duration-200" />
              </div>
              <p className="text-xl font-bold text-accent font-mono neon-text-green">
                {stat.value}
              </p>
              <p className="text-[10px] text-text-muted font-mono">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
