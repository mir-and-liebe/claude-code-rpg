"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, BookOpen, Check, Zap, Brain, Layers, GraduationCap, RefreshCw, Tag } from "lucide-react";
import { useProgress } from "@/lib/use-progress";
import { getStudyQueue, rateCard, getCardStats, seedCards, type AnkiCard } from "@/lib/anki";
import { calculateNextReview, qualityFromRating, type ReviewState } from "@/lib/spaced-repetition";
import type { CharacterClass } from "@/lib/types";
import ankiCardsData from "@/data/anki-cards.json";
import Link from "next/link";

const statusColors = {
  new: "text-mana bg-mana/10 border-mana/20",
  learning: "text-fire bg-fire/10 border-fire/20",
  reviewing: "text-gold bg-gold/10 border-gold/20",
  mature: "text-health bg-health/10 border-health/20",
};

const statusLabels = { new: "New", learning: "Learning", reviewing: "Reviewing", mature: "Mature" };

export default function AnkiPage() {
  const { progress } = useProgress();
  const [queue, setQueue] = useState<AnkiCard[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getCardStats>> | null>(null);
  const [sessionXp, setSessionXp] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [seeded, setSeeded] = useState(false);

  // Seed cards on first visit
  useEffect(() => {
    async function init() {
      const s = await getCardStats();
      if (s.total === 0) {
        await seedCards(ankiCardsData);
        setSeeded(true);
      }
      const charClass = (progress?.character_class || "") as CharacterClass;
      const q = await getStudyQueue(20, charClass);
      setQueue(q);
      setStats(await getCardStats());
      setLoading(false);
      if (q.length === 0) setDone(true);
    }
    init();
  }, [progress?.character_class]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!flipped && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setFlipped(true);
        return;
      }
      if (flipped) {
        const ratings = ["forgot", "hard", "good", "easy"] as const;
        const num = parseInt(e.key);
        if (num >= 1 && num <= 4) {
          handleRate(ratings[num - 1]);
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flipped, current, queue]);

  const handleRate = useCallback(
    async (rating: "forgot" | "hard" | "good" | "easy") => {
      const card = queue[current];
      if (!card) return;

      const { xpEarned } = await rateCard(card.id, rating);
      setSessionXp((prev) => prev + xpEarned);
      setSessionCount((prev) => prev + 1);

      setFlipped(false);
      if (current + 1 >= queue.length) {
        setDone(true);
        setStats(await getCardStats());
      } else {
        setCurrent((prev) => prev + 1);
      }
    },
    [current, queue]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
      </div>
    );
  }

  // Stats overview
  if (done) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-3xl">Anki Deck</h1>
          <p className="text-sm text-text-muted mt-1">
            Spaced repetition flashcards for Claude Code mastery
          </p>
        </div>

        {sessionCount > 0 && (
          <div className="card p-6 text-center">
            <GraduationCap className="w-8 h-8 text-gold mx-auto mb-3" />
            <h2 className="text-xl mb-1">Session Complete</h2>
            <p className="text-text-muted mb-3">
              {sessionCount} card{sessionCount !== 1 ? "s" : ""} reviewed
            </p>
            {sessionXp > 0 && (
              <p className="text-gold font-mono">+{sessionXp} XP earned</p>
            )}
          </div>
        )}

        {stats && (
          <div className="card p-6">
            <h2 className="text-lg mb-4">Card Status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["new", "learning", "reviewing", "mature"] as const).map((s) => (
                <div key={s} className="text-center">
                  <p className={`text-2xl font-mono ${statusColors[s].split(" ")[0]}`}>
                    {stats[s]}
                  </p>
                  <p className="text-[10px] text-text-muted tracking-widest uppercase mt-0.5">
                    {statusLabels[s]}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm text-text-muted">{stats.total} total cards</span>
              <span className="text-sm text-gold font-mono">{stats.dueToday} due today</span>
            </div>
          </div>
        )}

        {sessionCount === 0 && (
          <p className="text-sm text-text-muted text-center">
            {stats && stats.dueToday === 0
              ? "All caught up! Come back tomorrow for your next review."
              : seeded
                ? "Cards seeded! Refresh to start studying."
                : "No cards due. Complete some skill challenges to unlock cards."}
          </p>
        )}

        <div className="flex gap-3">
          <Link
            href="/skills"
            className="flex-1 text-center py-2.5 rounded-lg border border-border text-text-muted text-sm hover:text-text transition-colors"
          >
            Skill Trees
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm hover:bg-gold/15 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Study More
          </button>
        </div>
      </div>
    );
  }

  // Study mode
  const card = queue[current];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Anki Deck</h1>
          <p className="text-sm text-text-muted mt-1">
            Flashcards for permanent knowledge
          </p>
        </div>
        <div className="flex items-center gap-3">
          {sessionXp > 0 && (
            <span className="text-[11px] text-gold font-mono flex items-center gap-1">
              <Zap className="w-3 h-3" />
              +{sessionXp}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-text-muted">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-mono">
              {current + 1}/{queue.length}
            </span>
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        onClick={() => !flipped && setFlipped(true)}
        className={`card p-8 min-h-[300px] flex flex-col justify-center cursor-pointer transition-all duration-500 ${
          !flipped ? "hover:border-gold/20" : ""
        }`}
      >
        {!flipped ? (
          <div className="text-center">
            {/* Status + Deck badges */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-mono ${statusColors[card.status]}`}>
                {statusLabels[card.status]}
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full border border-border text-text-muted font-mono flex items-center gap-1">
                <Layers className="w-2.5 h-2.5" />
                {card.deck}
              </span>
              {card.difficulty === "hard" && (
                <span className="text-[9px] px-2 py-0.5 rounded-full border border-fire/20 text-fire font-mono">
                  hard
                </span>
              )}
            </div>

            <h2 className="text-lg leading-relaxed mb-6">{card.front}</h2>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-4">
              {card.tags.map((tag) => (
                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-surface-hover text-text-muted font-mono flex items-center gap-0.5">
                  <Tag className="w-2 h-2" />
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm text-text-muted">
              Click to reveal &middot; Space/Enter
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-mono ${statusColors[card.status]}`}>
                {statusLabels[card.status]}
              </span>
              <span className="text-[9px] text-gold font-mono ml-auto">
                +{card.xp_reward} XP
              </span>
            </div>

            <h3 className="text-sm text-text-muted mb-3">{card.front}</h3>
            <div className="p-4 rounded-lg bg-bg border-l-2 border-gold/30">
              <p className="text-[13px] text-text leading-relaxed whitespace-pre-line">
                {card.back}
              </p>
            </div>

            {/* Learning stats */}
            {card.times_correct + card.times_wrong > 0 && (
              <div className="flex items-center gap-3 mt-3 text-[10px] text-text-muted font-mono">
                <span className="text-health">{card.times_correct} correct</span>
                <span className="text-fire">{card.times_wrong} wrong</span>
                {card.interval_days > 0 && (
                  <span>interval: {card.interval_days}d</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating buttons */}
      {flipped && (
        <>
          <div className="grid grid-cols-4 gap-2">
            {(["forgot", "hard", "good", "easy"] as const).map((rating, idx) => {
              const styles = {
                forgot: "border-fire/20 text-fire hover:bg-fire/5",
                hard: "border-border text-text-muted hover:bg-surface-hover",
                good: "border-gold/20 text-gold hover:bg-gold/5",
                easy: "border-health/20 text-health hover:bg-health/5",
              };
              const labels = { forgot: "Forgot", hard: "Hard", good: "Good", easy: "Easy" };
              const currentState: ReviewState = {
                easeFactor: card.ease_factor,
                intervalDays: card.interval_days || 1,
                repetitions: card.repetitions,
              };
              const preview = calculateNextReview(qualityFromRating(rating), currentState);
              return (
                <button
                  key={rating}
                  onClick={() => handleRate(rating)}
                  className={`py-3 rounded-lg border text-sm font-semibold transition-colors cursor-pointer ${styles[rating]}`}
                >
                  <div>
                    <span className="text-[9px] font-mono opacity-40 mr-1">{idx + 1}</span>
                    {labels[rating]}
                  </div>
                  <div className="text-[10px] font-mono opacity-60 mt-0.5">
                    {preview.intervalDays}d
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-text-muted text-center font-mono">
            1 forgot &middot; 2 hard &middot; 3 good &middot; 4 easy
          </p>
        </>
      )}
    </div>
  );
}
