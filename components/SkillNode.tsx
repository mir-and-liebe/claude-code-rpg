"use client";

import { useState } from "react";
import type { SkillNode as SkillNodeType } from "@/lib/types";

interface Props {
  node: SkillNodeType;
  color: string;
  onToggle: (id: string) => void;
}

export function SkillNode({ node, color, onToggle }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`relative border rounded-xl p-4 transition-all ${
        node.completed
          ? "border-xp/50 bg-xp/5"
          : "border-border bg-surface hover:border-accent/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(node.id)}
          className={`mt-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all cursor-pointer ${
            node.completed
              ? "border-xp bg-xp/20 text-xp glow-xp"
              : "border-border bg-bg text-text-muted hover:border-accent"
          }`}
        >
          {node.completed ? "✓" : node.level}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-sm">{node.name}</h4>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent-glow">
              {node.xpRequired} XP
            </span>
          </div>
          <p className="text-xs text-text-muted mb-2">{node.description}</p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] text-accent-glow hover:underline cursor-pointer"
          >
            {expanded ? "Hide details ▲" : "Why it matters ▼"}
          </button>
          {expanded && (
            <div className="mt-3 space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-bg border border-border">
                <p className="text-text-muted mb-1 font-medium">
                  Why it matters:
                </p>
                <p className="text-text">{node.whyItMatters}</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                <p className="text-accent-glow mb-1 font-medium">
                  PM analogy:
                </p>
                <p className="text-text">{node.pmAnalogy}</p>
              </div>
              <div className="p-2 rounded-lg bg-surface-hover">
                <p className="text-text-muted">
                  <span className="font-medium">XP Source:</span>{" "}
                  {node.xpSource}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
