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
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl">Vault Mirror</h1>
        <p className="text-sm text-text-muted mt-1">
          Your Obsidian cc/ vault synced via GitHub Actions
        </p>
      </div>

      <div className="card p-6">
        <h2 className="text-xl mb-4">Setup Overview</h2>
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
              className="p-4 rounded-lg bg-bg border border-border"
            >
              <h3 className="text-sm font-semibold mb-3">{system.title}</h3>
              <div className="space-y-2 text-[13px] text-text-secondary">
                <p className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3 text-text-muted shrink-0" />
                  <span className="font-mono text-[12px]">{system.source}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-text-muted shrink-0" />
                  <span className="font-mono text-[12px]">{system.location}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-health shrink-0" />
                  <span>{system.status}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl mb-4">Vault Contents</h2>
        <div className="space-y-1">
          {vaultFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-hover transition-colors duration-300"
            >
              <file.Icon className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-[13px] font-mono text-text">
                {file.name}
              </span>
              <span className="text-[12px] text-text-muted ml-auto">
                {file.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl mb-4">Supported Languages</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "TypeScript", "Python", "Go", "Rust", "Java", "Kotlin",
            "Swift", "C++", "C#", "PHP", "Perl", "JavaScript",
          ].map((lang) => (
            <span
              key={lang}
              className="text-[12px] px-3 py-1.5 rounded-lg bg-surface-hover text-text-secondary font-mono cursor-default hover:text-text transition-colors duration-300"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl mb-4">Sync Configuration</h2>
        <div className="space-y-3 text-[13px]">
          <p className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-text-muted shrink-0" />
            <span className="text-text-muted w-16">Source</span>
            <span className="font-mono text-text-secondary">
              ~/Library/Mobile Documents/.../Obsidian/self-mastery/cc/
            </span>
          </p>
          <p className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-text-muted shrink-0" />
            <span className="text-text-muted w-16">Schedule</span>
            <span className="font-mono text-text-secondary">
              Daily at 5:00 AM via LaunchAgent
            </span>
          </p>
          <p className="flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-text-muted shrink-0" />
            <span className="text-text-muted w-16">Method</span>
            <span className="font-mono text-text-secondary">
              GitHub Action cron &mdash; vault MD &rarr; JSON
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
