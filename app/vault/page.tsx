import {
  Bot,
  BookOpen,
  Braces,
  CircuitBoard,
  FileText,
  GitBranch,
  Plug,
  RadioTower,
  Sparkles,
  Terminal,
  TerminalSquare,
} from "lucide-react";
import agents from "@/data/vault/agents.json";
import clis from "@/data/vault/clis.json";
import commands from "@/data/vault/commands.json";
import mcps from "@/data/vault/mcps.json";
import rules from "@/data/vault/rules.json";
import skills from "@/data/vault/skills.json";

const systems = [
  {
    title: "Context Rules",
    count: rules.count,
    Icon: FileText,
    keeper: "Keep",
    use: "Persistent standards: style, testing, security, and project conventions.",
  },
  {
    title: "Workflow Commands",
    count: commands.count,
    Icon: TerminalSquare,
    keeper: "Keep",
    use: "Repeatable moves for planning, testing, reviewing, committing, and docs lookup.",
  },
  {
    title: "Specialist Agents",
    count: agents.count,
    Icon: Bot,
    keeper: "Keep with restraint",
    use: "Delegate bounded work when parallel focus is worth the overhead.",
  },
  {
    title: "MCP Integrations",
    count: mcps.count,
    Icon: Plug,
    keeper: "Keep",
    use: "Connect AI work to GitHub, docs, data, browsers, deploys, and research.",
  },
  {
    title: "Reusable Skills",
    count: skills.count,
    Icon: Sparkles,
    keeper: "Curate",
    use: "Load deeper patterns only when a task needs a specific workflow.",
  },
  {
    title: "CLI Tools",
    count: clis.count,
    Icon: Terminal,
    keeper: "Keep",
    use: "Make terminal work legible, fast, and reviewable.",
  },
];

const playbooks = [
  {
    title: "Solo Slice",
    loop: "Brief → plan → patch → test → diff → commit",
    Icon: GitBranch,
  },
  {
    title: "Unknown Codebase",
    loop: "Map files → trace flow → identify risk → patch the smallest path",
    Icon: CircuitBoard,
  },
  {
    title: "Quality Pass",
    loop: "Run tests → inspect failures → review edge cases → document proof",
    Icon: Braces,
  },
];

export default function VaultPage() {
  const total = systems.reduce((sum, system) => sum + system.count, 0);

  return (
    <div className="space-y-6">
      <section className="signal-band px-5 py-6 sm:px-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_260px] lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-void/40 px-3 py-1 text-xs font-semibold text-soft">
              <BookOpen className="h-4 w-4 text-signal" />
              Codex
            </div>
            <h1 className="text-4xl font-black text-ink">Keep the systems. Lose the clutter.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-soft">
              A field codex for the reusable context, workflow macros, agents, MCPs,
              and tools that make AI-assisted shipping calmer, faster, and easier to
              review.
            </p>
          </div>
          <div className="panel-strong p-4">
            <p className="hud-label">Reusable Assets</p>
            <p className="mt-2 text-3xl font-black text-ink">{total}</p>
            <p className="text-xs text-muted">signals indexed from the vault</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {systems.map((system) => (
          <article key={system.title} className="panel p-4">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md border border-line bg-void/50">
                  <system.Icon className="h-5 w-5 text-signal" />
                </div>
                <div>
                  <h2 className="text-lg text-ink">{system.title}</h2>
                  <p className="text-xs text-muted">{system.keeper}</p>
                </div>
              </div>
              <p className="font-mono text-2xl font-black text-ink">{system.count}</p>
            </div>
            <p className="text-sm leading-6 text-soft">{system.use}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <RadioTower className="h-5 w-5 text-cyan" />
            <h2 className="text-2xl">Permanent loadout</h2>
          </div>
          <div className="space-y-3">
            {[
              "Context packs that explain intent, constraints, taste, and acceptance criteria.",
              "Workflow macros for planning, building, testing, reviewing, and iterating.",
              "Flashcards for habits that should become automatic under pressure.",
              "A campaign map that turns shipping moves into practical missions.",
            ].map((item) => (
              <p key={item} className="rounded-md border border-line bg-void/40 px-3 py-2 text-sm text-soft">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-green" />
            <h2 className="text-2xl">Playbooks worth practicing</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {playbooks.map((playbook) => (
              <article key={playbook.title} className="rounded-md border border-line bg-void/40 p-4">
                <playbook.Icon className="mb-3 h-5 w-5 text-signal" />
                <h3 className="text-sm font-bold text-ink">{playbook.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted">{playbook.loop}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
