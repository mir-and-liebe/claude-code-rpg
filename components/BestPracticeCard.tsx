import type { BestPractice } from "@/lib/types";

interface Props {
  practice: BestPractice;
}

export function BestPracticeCard({ practice }: Props) {
  const categoryColors: Record<string, string> = {
    "Rules & Context": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Commands: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Agents: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    Skills: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    "MCP Servers": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "Development Workflow":
      "bg-green-500/10 text-green-400 border-green-500/20",
    Security: "bg-red-500/10 text-red-400 border-red-500/20",
    Terminal: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "Obsidian Mirror": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-5 hover:border-accent/30 transition-all">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full border ${
            categoryColors[practice.category] || "bg-accent/10 text-accent-glow border-accent/20"
          }`}
        >
          {practice.category}
        </span>
        <span className="text-[10px] text-text-muted">
          {practice.vaultSource}
        </span>
      </div>
      <h3 className="font-bold text-sm mb-2">{practice.title}</h3>
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-medium text-text-muted mb-1">WHAT</p>
          <p className="text-xs text-text leading-relaxed">{practice.what}</p>
        </div>
        <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
          <p className="text-[10px] font-medium text-accent-glow mb-1">WHY</p>
          <p className="text-xs text-text leading-relaxed">{practice.why}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {practice.relatedTools.map((tool) => (
            <span
              key={tool}
              className="text-[10px] px-1.5 py-0.5 rounded bg-surface-hover text-text-muted font-mono"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
