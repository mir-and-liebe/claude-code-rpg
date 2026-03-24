"use client";

import { useState, useEffect } from "react";
import { X, Check, XIcon, SkipForward, Sparkles, BookOpen, ChevronDown } from "lucide-react";
import challengesData from "@/data/challenges.json";
import skillTreesData from "@/data/skills.json";
import type { SkillTree } from "@/lib/types";

interface Challenge {
  skillId: string;
  type: string;
  question: string;
  options?: string[];
  answer: string | boolean;
  explanation: string;
}

interface Props {
  skillId: string;
  skillName: string;
  onComplete: (verified: boolean) => void;
  onClose: () => void;
}

export function ChallengeModal({ skillId, skillName, onComplete, onClose }: Props) {
  const challenge = (challengesData as Challenge[]).find(
    (c) => c.skillId === skillId
  );
  const [selected, setSelected] = useState<string | boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Find skill description for "Learn first"
  const skillInfo = (() => {
    for (const tree of skillTreesData as SkillTree[]) {
      const node = tree.nodes.find((n) => n.id === skillId);
      if (node) return { description: node.description, whyItMatters: node.whyItMatters };
    }
    return null;
  })();

  useEffect(() => {
    if (!challenge) {
      onComplete(false);
    }
  }, [challenge, onComplete]);

  if (!challenge) return null;

  function handleSubmit() {
    const isCorrect = selected === challenge!.answer;
    setCorrect(isCorrect);
    setSubmitted(true);
    if (isCorrect) {
      setTimeout(() => onComplete(true), 1500);
    }
  }

  function handleRetry() {
    setSelected(null);
    setSubmitted(false);
    setCorrect(false);
  }

  function handleSkip() {
    onComplete(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="challenge-title">
      <div className="max-w-lg w-full mx-4 card p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-4 h-4 text-gold" />
          <p className="text-[10px] text-gold tracking-widest uppercase font-mono">
            Skill Challenge
          </p>
          <span className="text-[10px] text-text-muted ml-auto">{skillName}</span>
        </div>

        {skillInfo && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text-secondary mb-3 cursor-pointer transition-colors"
          >
            <BookOpen className="w-3 h-3" />
            {showHint ? "Hide" : "Learn first"}
            <ChevronDown className={`w-3 h-3 transition-transform ${showHint ? "rotate-180" : ""}`} />
          </button>
        )}
        {showHint && skillInfo && (
          <div className="p-3 rounded-lg bg-bg border-l-2 border-gold/30 mb-4 text-[12px] text-text-secondary leading-relaxed">
            {skillInfo.description}
          </div>
        )}

        <h3 className="text-[15px] font-semibold mb-5 leading-relaxed">
          {challenge.question}
        </h3>

        {/* Multiple choice */}
        {challenge.type === "multiple_choice" && challenge.options && (
          <div className="space-y-2 mb-5">
            {challenge.options.map((opt) => (
              <button
                key={opt}
                onClick={() => !submitted && setSelected(opt)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 cursor-pointer ${
                  submitted && opt === challenge.answer
                    ? "border-health/40 bg-health/10 text-health"
                    : submitted && opt === selected && !correct
                      ? "border-fire/40 bg-fire/10 text-fire"
                      : selected === opt
                        ? "border-gold/40 bg-gold/[0.05] text-text"
                        : "border-border bg-surface hover:border-border-subtle text-text-secondary"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* True/False */}
        {challenge.type === "true_false" && (
          <div className="flex gap-3 mb-5">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                onClick={() => !submitted && setSelected(val)}
                disabled={submitted}
                className={`flex-1 px-4 py-3 rounded-lg border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  submitted && val === challenge.answer
                    ? "border-health/40 bg-health/10 text-health"
                    : submitted && val === selected && !correct
                      ? "border-fire/40 bg-fire/10 text-fire"
                      : selected === val
                        ? "border-gold/40 bg-gold/[0.05] text-text"
                        : "border-border bg-surface hover:border-border-subtle text-text-secondary"
                }`}
              >
                {val ? "True" : "False"}
              </button>
            ))}
          </div>
        )}

        {/* Result */}
        {submitted && (
          <div
            className={`p-4 rounded-lg mb-5 border-l-2 ${
              correct
                ? "bg-health/5 border-health/40"
                : "bg-fire/5 border-fire/40"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              {correct ? (
                <Check className="w-4 h-4 text-health" />
              ) : (
                <XIcon className="w-4 h-4 text-fire" />
              )}
              <span
                className={`text-sm font-semibold ${
                  correct ? "text-health" : "text-fire"
                }`}
              >
                {correct ? "Correct!" : "Not quite"}
              </span>
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {challenge.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!submitted && (
            <>
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="flex-1 py-2.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm font-semibold hover:bg-gold/15 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
              <button
                onClick={handleSkip}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-text-muted text-sm hover:text-text-secondary transition-colors cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
                Skip
              </button>
            </>
          )}
          {submitted && !correct && (
            <button
              onClick={handleRetry}
              className="flex-1 py-2.5 rounded-lg bg-surface-hover border border-border text-text text-sm font-semibold hover:border-border-subtle transition-colors cursor-pointer"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
