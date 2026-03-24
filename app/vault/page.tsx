import {
  FileText,
  Settings,
  Terminal,
  Plug,
  Bot,
  TerminalSquare,
  BookOpen,
  Sparkles,
  GitBranch,
  Monitor,
  Clock,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const vaultFiles = [
  { name: "Dashboard.md", desc: "Master overview and sync status", Icon: Monitor },
  { name: "Settings.md", desc: "JSON config and permissions", Icon: Settings },
  { name: "CLIs.md", desc: "14 installed CLI tools and aliases", Icon: Terminal },
  { name: "MCPs.md", desc: "24 configured MCP servers", Icon: Plug },
  { name: "agents/Agents Index.md", desc: "28 ECC + 8 BMAD agents", Icon: Bot },
  { name: "commands/Commands Index.md", desc: "60 slash commands", Icon: TerminalSquare },
  { name: "rules/Rules Index.md", desc: "66 rule files", Icon: BookOpen },
  { name: "skills/Skills Index.md", desc: "91 skills", Icon: Sparkles },
  { name: "hooks/Hooks Overview.md", desc: "Hook configurations", Icon: GitBranch },
  { name: "terminal/Terminal Setup.md", desc: "Zsh + Starship config", Icon: Terminal },
];

export default function VaultPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold glitch-hover">Vault Mirror</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Your Obsidian cc/ vault synced via GitHub Actions. Auto-updates daily.
        </p>
      </div>

      <div className="bg-surface rounded-xl border border-border p-5">
        <h2 className="text-lg font-bold mb-3">Setup Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Everything Claude Code (ECC)",
              source: "github.com/affaan-m/everything-claude-code",
              location: "~/.claude/everything-claude-code/",
              status: "Auto-loaded",
            },
            {
              title: "BMAD Method",
              source: "github.com/bmad-code-org/BMAD-METHOD",
              location: "~/_bmad/",
              status: "Auto-loaded via rules",
            },
          ].map((system) => (
            <div
              key={system.title}
              className="p-4 rounded-lg bg-bg border border-border card-hover"
            >
              <h3 className="text-sm font-bold mb-2">{system.title}</h3>
              <div className="space-y-1.5 text-xs text-text-muted">
                <p className="flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="font-mono">{system.source}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <FileText className="w-3 h-3 shrink-0" />
                  <span className="font-mono">{system.location}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-health shrink-0" />
                  {system.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-5">
        <h2 className="text-lg font-bold mb-3">Vault Contents</h2>
        <div className="space-y-2">
          {vaultFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-bg border border-border card-hover"
            >
              <file.Icon className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-sm font-mono text-accent">
                {file.name}
              </span>
              <span className="text-xs text-text-muted ml-auto">
                {file.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-5">
        <h2 className="text-lg font-bold mb-3">Supported Languages</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "TypeScript", "Python", "Go", "Rust", "Java", "Kotlin",
            "Swift", "C++", "C#", "PHP", "Perl", "JavaScript",
          ].map((lang) => (
            <span
              key={lang}
              className="text-xs px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent font-mono cursor-default hover:bg-accent/15 transition-colors duration-200"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-5">
        <h2 className="text-lg font-bold mb-3">Sync Configuration</h2>
        <div className="space-y-2.5 text-xs">
          <p className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-text-muted">Source:</span>
            <span className="font-mono text-text">
              ~/Library/Mobile Documents/.../Obsidian/self-mastery/cc/
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-text-muted">Schedule:</span>
            <span className="font-mono text-text">
              Daily at 5:00 AM via LaunchAgent
            </span>
          </p>
          <p className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-text-muted">Method:</span>
            <span className="font-mono text-text">
              GitHub Action cron parses vault MD &rarr; JSON
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
