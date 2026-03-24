export default function VaultPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vault Mirror</h1>
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
              className="p-4 rounded-lg bg-bg border border-border"
            >
              <h3 className="text-sm font-bold mb-2">{system.title}</h3>
              <div className="space-y-1 text-xs text-text-muted">
                <p>
                  <span className="text-text-muted font-medium">Source:</span>{" "}
                  <span className="font-mono">{system.source}</span>
                </p>
                <p>
                  <span className="text-text-muted font-medium">
                    Location:
                  </span>{" "}
                  <span className="font-mono">{system.location}</span>
                </p>
                <p>
                  <span className="text-health">●</span> {system.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-5">
        <h2 className="text-lg font-bold mb-3">Vault Contents</h2>
        <div className="space-y-2">
          {[
            { name: "Dashboard.md", desc: "Master overview and sync status" },
            { name: "Settings.md", desc: "JSON config and permissions" },
            { name: "CLIs.md", desc: "14 installed CLI tools and aliases" },
            { name: "MCPs.md", desc: "24 configured MCP servers" },
            {
              name: "agents/Agents Index.md",
              desc: "28 ECC + 8 BMAD agents",
            },
            {
              name: "commands/Commands Index.md",
              desc: "60 slash commands",
            },
            { name: "rules/Rules Index.md", desc: "66 rule files" },
            { name: "skills/Skills Index.md", desc: "91 skills" },
            { name: "hooks/Hooks Overview.md", desc: "Hook configurations" },
            {
              name: "terminal/Terminal Setup.md",
              desc: "Zsh + Starship config",
            },
          ].map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-bg border border-border"
            >
              <span className="text-xs">📄</span>
              <span className="text-sm font-mono text-accent-glow">
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
            "TypeScript",
            "Python",
            "Go",
            "Rust",
            "Java",
            "Kotlin",
            "Swift",
            "C++",
            "C#",
            "PHP",
            "Perl",
            "JavaScript",
          ].map((lang) => (
            <span
              key={lang}
              className="text-xs px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent-glow"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-5">
        <h2 className="text-lg font-bold mb-3">Sync Configuration</h2>
        <div className="space-y-2 text-xs font-mono text-text-muted">
          <p>
            <span className="text-text">Source:</span>{" "}
            ~/Library/Mobile Documents/.../Obsidian/self-mastery/cc/
          </p>
          <p>
            <span className="text-text">Schedule:</span> Daily at 5:00 AM via
            LaunchAgent
          </p>
          <p>
            <span className="text-text">Method:</span> GitHub Action cron
            parses vault MD → JSON
          </p>
        </div>
      </div>
    </div>
  );
}
