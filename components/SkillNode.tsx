"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Lightbulb, Briefcase, Zap, Lock, Sparkles } from "lucide-react";
import type { SkillNode as SkillNodeType } from "@/lib/types";

interface Props {
  node: SkillNodeType;
  color: string;
  onToggle: (id: string) => void;
  revealed: boolean;
}

export function SkillNode({ node, color, onToggle, revealed }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Fog of War — hidden skill
  if (!revealed) {
    return (
      <div className="border border-border rounded-xl p-5 bg-surface opacity-40">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full border border-border bg-bg flex items-center justify-center">
            <Lock className="w-3 h-3 text-text-muted" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2.5 mb-1.5">
              <h4 className="font-semibold text-sm text-text-muted">???</h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-text-muted bg-surface-hover">
                Lv. {node.level}
              </span>
            </div>
            <p className="text-[13px] text-text-muted italic">
              Complete Level 3 to reveal this skill
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-xl p-5 transition-all duration-300 ${
        node.completed
          ? "border-gold/20 bg-gold/[0.03]"
          : "border-border bg-surface hover:border-border-subtle"
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(node.id)}
          className={`mt-0.5 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 cursor-pointer ${
            node.completed
              ? "border-gold/40 bg-gold/10 text-gold"
              : "border-border bg-bg text-text-muted hover:border-text-muted"
          }`}
        >
          {node.completed ? <Check className="w-3.5 h-3.5" /> : node.level}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2.5 mb-1.5">
            <h4 className="font-semibold text-sm text-text">{node.name}</h4>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{ color, backgroundColor: `${color}10` }}
            >
              {node.xpRequired} XP
            </span>
          </div>
          <p className="text-[13px] text-text-secondary mb-3 leading-relaxed">
            {node.description}
          </p>
          {/* Impact statement (CD1 — Humanity Hero) */}
          {node.completed && node.impact && (
            <div className="flex items-start gap-1.5 mb-3 p-2.5 rounded-lg bg-gold/[0.03] border border-gold/10">
              <Sparkles className="w-3 h-3 text-gold mt-0.5 shrink-0" />
              <p className="text-[11px] text-gold/80 italic">{node.impact}</p>
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-[12px] text-text-muted hover:text-text-secondary transition-colors duration-300 cursor-pointer"
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
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="p-4 rounded-lg bg-bg border-l-2 border-text-muted">
                <div className="flex items-center gap-1.5 text-text-secondary mb-2">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold tracking-wide uppercase">
                    Why it matters
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {node.whyItMatters}
                </p>
              </div>
              <div
                className="p-4 rounded-lg border-l-2"
                style={{ backgroundColor: `${color}05`, borderColor: `${color}40` }}
              >
                <div className="flex items-center gap-1.5 mb-2" style={{ color }}>
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold tracking-wide uppercase">
                    PM analogy
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {node.pmAnalogy}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-surface-hover flex items-start gap-2">
                <Zap className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" />
                <p className="text-text-muted font-mono text-[12px]">
                  <span className="text-text-secondary">XP Source:</span>{" "}
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
