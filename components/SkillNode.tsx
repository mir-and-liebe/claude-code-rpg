"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronUp, Lightbulb, Briefcase, Zap, Lock, Sparkles, Scroll } from "lucide-react";
import type { SkillNode as SkillNodeType } from "@/lib/types";

interface Props {
  node: SkillNodeType;
  color: string;
  onToggle: (id: string) => void;
  onChallenge?: (id: string, name: string) => void;
  revealed: boolean;
  verified?: boolean;
  step?: string;
  linkedQuest?: { chainId: string; chainName: string };
}

export function SkillNode({ node, color, onToggle, onChallenge, revealed, verified, step, linkedQuest }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [confirmUncomplete, setConfirmUncomplete] = useState(false);

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
              Complete all Level 1{node.level > 4 ? "–3" : "–" + (node.level - 1)} skills in this tree to unlock
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
          onClick={() => {
            if (node.completed) {
              setConfirmUncomplete(true);
            } else if (onChallenge) {
              onChallenge(node.id, node.name);
            } else {
              onToggle(node.id);
            }
          }}
          aria-label={`${node.completed ? "Uncomplete" : "Complete"} ${node.name}`}
          title={node.completed ? "Click to uncomplete" : "Click to take challenge"}
          className={`mt-0.5 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-300 cursor-pointer ${
            node.completed
              ? "border-gold/40 bg-gold/10 text-gold"
              : "border-border bg-bg text-text-muted hover:border-text-muted"
          }`}
        >
          {node.completed ? (
            verified ? <Check className="w-3.5 h-3.5" /> : <span className="text-[9px]">~</span>
          ) : node.level}
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
            {step && (
              <span className="text-[10px] text-text-muted font-mono">
                {step}
              </span>
            )}
          </div>
          <p className="text-[13px] text-text-secondary mb-3 leading-relaxed">
            {node.description}
          </p>
          {linkedQuest && !node.completed && (
            <Link
              href={`/quests/${linkedQuest.chainId}`}
              className="inline-flex items-center gap-1.5 text-[11px] text-gold/70 hover:text-gold transition-colors mb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <Scroll className="w-3 h-3" />
              Complete &ldquo;{linkedQuest.chainName}&rdquo; to unlock
            </Link>
          )}
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
      {confirmUncomplete && (
        <div className="mt-3 p-3 rounded-lg bg-fire/5 border border-fire/20 flex items-center justify-between gap-3">
          <p className="text-[12px] text-fire">
            Remove this skill? You&apos;ll lose {node.xpRequired} XP.
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setConfirmUncomplete(false)}
              className="text-[11px] px-3 py-1 rounded-lg border border-border text-text-muted hover:text-text cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => { onToggle(node.id); setConfirmUncomplete(false); }}
              className="text-[11px] px-3 py-1 rounded-lg bg-fire/10 border border-fire/20 text-fire hover:bg-fire/15 cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
