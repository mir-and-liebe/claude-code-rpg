import { Lightbulb, FileCode } from "lucide-react";
import type { BestPractice } from "@/lib/types";

interface Props {
  practice: BestPractice;
}

const categoryColors: Record<string, string> = {
  "Rules & Context": "text-tree-prompt bg-tree-prompt/10 border-tree-prompt/15",
  Commands: "text-tree-cli bg-tree-cli/10 border-tree-cli/15",
  Agents: "text-tree-agent bg-tree-agent/10 border-tree-agent/15",
  Skills: "text-tree-prompt bg-tree-prompt/10 border-tree-prompt/15",
  "MCP Servers": "text-tree-mcp bg-tree-mcp/10 border-tree-mcp/15",
  "Development Workflow": "text-tree-product bg-tree-product/10 border-tree-product/15",
  Security: "text-fire bg-fire/10 border-fire/15",
  Terminal: "text-tree-cli bg-tree-cli/10 border-tree-cli/15",
  "Obsidian Mirror": "text-mana bg-mana/10 border-mana/15",
};

export function BestPracticeCard({ practice }: Props) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full border tracking-wide ${
            categoryColors[practice.category] || "text-gold bg-gold/10 border-gold/15"
          }`}
        >
          {practice.category}
        </span>
        <span className="text-[10px] text-text-muted font-mono flex items-center gap-1">
          <FileCode className="w-2.5 h-2.5" />
          {practice.vaultSource}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold mb-3 text-text" style={{ fontFamily: "Inter, sans-serif" }}>
        {practice.title}
      </h3>
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-semibold text-text-muted mb-1.5 tracking-widest uppercase">
            What
          </p>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            {practice.what}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-gold/[0.03] border-l-2 border-gold/30">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Lightbulb className="w-3 h-3 text-gold" />
            <p className="text-[10px] font-semibold text-gold tracking-widest uppercase">
              Why
            </p>
          </div>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            {practice.why}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {practice.relatedTools.map((tool) => (
            <span
              key={tool}
              className="text-[10px] px-2 py-0.5 rounded bg-surface-hover text-text-muted font-mono"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
