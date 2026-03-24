"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Lightbulb, Briefcase, Zap } from "lucide-react";
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
      className={`relative border rounded-xl p-4 transition-all duration-200 ${
        node.completed
          ? "border-xp/30 bg-xp/5"
          : "border-border bg-surface hover:border-border-glow"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(node.id)}
          className={`mt-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-all duration-200 cursor-pointer ${
            node.completed
              ? "border-xp bg-xp/20 text-xp glow-xp"
              : "border-border bg-bg text-text-muted hover:border-accent hover:text-accent"
          }`}
        >
          {node.completed ? <Check className="w-3.5 h-3.5" /> : node.level}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-sm">{node.name}</h4>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{
                backgroundColor: `${color}15`,
                color: color,
              }}
            >
              {node.xpRequired} XP
            </span>
          </div>
          <p className="text-xs text-text-muted mb-2 leading-relaxed">
            {node.description}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] text-accent hover:text-accent-glow transition-colors duration-200 cursor-pointer"
          >
            {expanded ? (
              <>
                Hide details <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Why it matters <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
          {expanded && (
            <div className="mt-3 space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-bg border border-border">
                <div className="flex items-center gap-1.5 text-text-muted mb-1.5">
                  <Lightbulb className="w-3 h-3" />
                  <span className="font-medium font-mono">Why it matters</span>
                </div>
                <p className="text-text leading-relaxed">{node.whyItMatters}</p>
              </div>
              <div
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: `${color}08`,
                  borderColor: `${color}20`,
                }}
              >
                <div className="flex items-center gap-1.5 mb-1.5" style={{ color }}>
                  <Briefcase className="w-3 h-3" />
                  <span className="font-medium font-mono">PM analogy</span>
                </div>
                <p className="text-text leading-relaxed">{node.pmAnalogy}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-hover flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-xp shrink-0" />
                <p className="text-text-muted font-mono">
                  <span className="font-medium text-text">XP Source:</span>{" "}
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
