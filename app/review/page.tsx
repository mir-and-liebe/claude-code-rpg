"use client";

import { useState, useEffect } from "react";
import { RotateCcw, Check, Brain, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { calculateNextReview, qualityFromRating } from "@/lib/spaced-repetition";
import skillTreesData from "@/data/skills.json";
import type { SkillTree, SkillNode } from "@/lib/types";

interface ReviewItem {
  skill_id: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
}

function findSkill(id: string): { node: SkillNode; tree: SkillTree } | null {
  for (const tree of skillTreesData as SkillTree[]) {
    const node = tree.nodes.find((n) => n.id === id);
    if (node) return { node, tree };
  }
  return null;
}

export default function ReviewPage() {
  const [queue, setQueue] = useState<ReviewItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    supabase
      .from("skill_reviews")
      .select("*")
      .lte("next_review", today)
      .then(({ data }) => {
        setQueue((data || []) as ReviewItem[]);
        setLoading(false);
        if (!data || data.length === 0) setDone(true);
      });
  }, []);

  async function handleRate(rating: "forgot" | "hard" | "good" | "easy") {
    const item = queue[current];
    if (!item) return;

    const quality = qualityFromRating(rating);
    const next = calculateNextReview(quality, {
      easeFactor: item.ease_factor,
      intervalDays: item.interval_days,
      repetitions: item.repetitions,
    });

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + next.intervalDays);

    await supabase
      .from("skill_reviews")
      .update({
        ease_factor: next.easeFactor,
        interval_days: next.intervalDays,
        repetitions: next.repetitions,
        next_review: nextDate.toISOString().split("T")[0],
        last_review: new Date().toISOString().split("T")[0],
      })
      .eq("skill_id", item.skill_id);

    setFlipped(false);
    if (current + 1 >= queue.length) {
      setDone(true);
    } else {
      setCurrent((prev) => prev + 1);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <Check className="w-10 h-10 text-gold mx-auto mb-4" />
        <h1 className="text-2xl mb-2">All Caught Up</h1>
        <p className="text-text-muted">
          {queue.length === 0
            ? "No skills due for review yet. Complete some skill challenges first."
            : `Reviewed ${queue.length} skill${queue.length !== 1 ? "s" : ""}. Come back tomorrow.`}
        </p>
      </div>
    );
  }

  const item = queue[current];
  const skill = findSkill(item.skill_id);
  if (!skill) return null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Review</h1>
          <p className="text-sm text-text-muted mt-1">
            Spaced repetition — strengthen what you've learned
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted">
          <Brain className="w-4 h-4" />
          <span className="text-sm font-mono">
            {current + 1}/{queue.length}
          </span>
        </div>
      </div>

      {/* Card */}
      <div
        onClick={() => !flipped && setFlipped(true)}
        className={`card p-8 min-h-[280px] flex flex-col justify-center cursor-pointer transition-all duration-500 ${
          !flipped ? "hover:border-gold/20" : ""
        }`}
      >
        {!flipped ? (
          <div className="text-center">
            <p className="text-[10px] text-text-muted tracking-widest uppercase font-mono mb-3">
              What does this skill involve?
            </p>
            <h2 className="text-xl mb-2">{skill.node.name}</h2>
            <p
              className="text-[11px] font-mono"
              style={{ color: skill.tree.color }}
            >
              {skill.tree.name}
            </p>
            <p className="text-sm text-text-muted mt-6">
              Tap to reveal answer
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg mb-3">{skill.node.name}</h3>
            <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
              {skill.node.description}
            </p>
            <div className="p-3 rounded-lg bg-bg border-l-2 border-gold/30">
              <p className="text-[12px] text-text-muted leading-relaxed">
                <span className="text-gold font-mono">Why:</span>{" "}
                {skill.node.whyItMatters}
              </p>
            </div>
            <p className="text-[11px] text-text-muted mt-3 font-mono">
              XP Source: {skill.node.xpSource}
            </p>
          </div>
        )}
      </div>

      {/* Rating buttons */}
      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          {(["forgot", "hard", "good", "easy"] as const).map((rating) => {
            const styles = {
              forgot: "border-fire/20 text-fire hover:bg-fire/5",
              hard: "border-border text-text-muted hover:bg-surface-hover",
              good: "border-gold/20 text-gold hover:bg-gold/5",
              easy: "border-health/20 text-health hover:bg-health/5",
            };
            const labels = {
              forgot: "Forgot",
              hard: "Hard",
              good: "Good",
              easy: "Easy",
            };
            const intervals = {
              forgot: "1d",
              hard: `${Math.max(1, Math.round(item.interval_days * 0.5))}d`,
              good: `${item.interval_days}d`,
              easy: `${Math.round(item.interval_days * item.ease_factor)}d`,
            };
            return (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className={`py-3 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${styles[rating]}`}
              >
                <div>{labels[rating]}</div>
                <div className="text-[10px] font-mono opacity-60 mt-0.5">
                  {intervals[rating]}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
