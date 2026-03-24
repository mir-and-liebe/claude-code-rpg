import { supabase } from "./supabase";
import { calculateNextReview, qualityFromRating } from "./spaced-repetition";

export interface AnkiCard {
  id: string;
  deck: string;
  front: string;
  back: string;
  tags: string[];
  related_skill: string | null;
  difficulty: string;
  xp_reward: number;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string | null;
  last_review: string | null;
  status: "new" | "learning" | "reviewing" | "mature";
  times_correct: number;
  times_wrong: number;
  source: string;
}

/**
 * Smart card selection algorithm:
 * 1. Due cards (next_review <= today) — highest priority, ordered by overdue days
 * 2. New cards — introduced gradually (max 10 per session)
 * 3. Learning cards (interval < 7 days) — prioritized over mature
 *
 * RPG integration: harder decks aligned with user's class get shown more often
 */
export async function getStudyQueue(
  limit: number = 20,
  characterClass: string = ""
): Promise<AnkiCard[]> {
  const today = new Date().toISOString().split("T")[0];

  // 1. Due cards (overdue first)
  const { data: dueCards } = await supabase
    .from("anki_cards")
    .select("*")
    .lte("next_review", today)
    .neq("status", "new")
    .order("next_review", { ascending: true })
    .limit(limit);

  // 2. New cards (not yet reviewed, limit 10)
  const { data: newCards } = await supabase
    .from("anki_cards")
    .select("*")
    .eq("status", "new")
    .limit(10);

  const queue: AnkiCard[] = [...(dueCards || []), ...(newCards || [])];

  // 3. Prioritize cards related to class bonus trees
  const classBonusTrees: Record<string, string[]> = {
    architect: ["prompt-architect", "agent-craft"],
    operator: ["cli-dominance", "mcp-mastery"],
    shipper: ["product-shipper", "code-comprehension"],
  };
  const bonusSkillPrefixes = (classBonusTrees[characterClass] || []).map(
    (t) => t.split("-")[0].slice(0, 2)
  );

  // Sort: overdue first, then class-relevant, then new
  queue.sort((a, b) => {
    // Due cards always first
    const aDue = a.next_review && a.next_review <= today ? -1 : 0;
    const bDue = b.next_review && b.next_review <= today ? -1 : 0;
    if (aDue !== bDue) return aDue - bDue;

    // Class-relevant cards second
    const aClass = bonusSkillPrefixes.some((p) =>
      (a.related_skill || "").startsWith(p)
    )
      ? -1
      : 0;
    const bClass = bonusSkillPrefixes.some((p) =>
      (b.related_skill || "").startsWith(p)
    )
      ? -1
      : 0;
    if (aClass !== bClass) return aClass - bClass;

    // New cards last
    const aNew = a.status === "new" ? 1 : 0;
    const bNew = b.status === "new" ? 1 : 0;
    return aNew - bNew;
  });

  return queue.slice(0, limit);
}

export async function rateCard(
  cardId: string,
  rating: "forgot" | "hard" | "good" | "easy"
): Promise<{ xpEarned: number }> {
  const { data: card } = await supabase
    .from("anki_cards")
    .select("*")
    .eq("id", cardId)
    .single();

  if (!card) return { xpEarned: 0 };

  const quality = qualityFromRating(rating);
  const next = calculateNextReview(quality, {
    easeFactor: card.ease_factor,
    intervalDays: card.interval_days,
    repetitions: card.repetitions,
  });

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + next.intervalDays);
  const isCorrect = quality >= 3;

  // Determine learning status
  let status: string;
  if (next.repetitions === 0) {
    status = "learning";
  } else if (next.intervalDays >= 21) {
    status = "mature";
  } else {
    status = "reviewing";
  }

  await supabase
    .from("anki_cards")
    .update({
      ease_factor: next.easeFactor,
      interval_days: next.intervalDays,
      repetitions: next.repetitions,
      next_review: nextDate.toISOString().split("T")[0],
      last_review: new Date().toISOString().split("T")[0],
      status,
      times_correct: isCorrect ? card.times_correct + 1 : card.times_correct,
      times_wrong: isCorrect ? card.times_wrong : card.times_wrong + 1,
    })
    .eq("id", cardId);

  // RPG XP reward — only on correct
  const xpEarned = isCorrect ? card.xp_reward : 0;
  if (xpEarned > 0) {
    const { data: current } = await supabase
      .from("rpg_progress")
      .select("anki_xp")
      .eq("id", "default")
      .single();
    if (current) {
      await supabase
        .from("rpg_progress")
        .update({ anki_xp: (current.anki_xp || 0) + xpEarned })
        .eq("id", "default");
    }
  }

  return { xpEarned };
}

export async function getCardStats(): Promise<{
  total: number;
  new: number;
  learning: number;
  reviewing: number;
  mature: number;
  dueToday: number;
}> {
  const today = new Date().toISOString().split("T")[0];

  const [
    { count: total },
    { count: newCount },
    { count: learning },
    { count: reviewing },
    { count: mature },
    { count: dueToday },
  ] = await Promise.all([
    supabase.from("anki_cards").select("*", { count: "exact", head: true }),
    supabase.from("anki_cards").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("anki_cards").select("*", { count: "exact", head: true }).eq("status", "learning"),
    supabase.from("anki_cards").select("*", { count: "exact", head: true }).eq("status", "reviewing"),
    supabase.from("anki_cards").select("*", { count: "exact", head: true }).eq("status", "mature"),
    supabase.from("anki_cards").select("*", { count: "exact", head: true }).lte("next_review", today).neq("status", "new"),
  ]);

  return {
    total: total || 0,
    new: newCount || 0,
    learning: learning || 0,
    reviewing: reviewing || 0,
    mature: mature || 0,
    dueToday: (dueToday || 0) + Math.min(newCount || 0, 10),
  };
}

/**
 * Seed cards from JSON file to Supabase (upsert — safe to run multiple times)
 */
export async function seedCards(
  cards: Array<{
    id: string;
    deck: string;
    front: string;
    back: string;
    tags: string[];
    related_skill: string;
    difficulty: string;
    xp_reward: number;
  }>
): Promise<number> {
  const rows = cards.map((c) => ({
    id: c.id,
    deck: c.deck,
    front: c.front,
    back: c.back,
    tags: c.tags,
    related_skill: c.related_skill || null,
    difficulty: c.difficulty,
    xp_reward: c.xp_reward,
    status: "new",
    source: "seed",
  }));

  const { error } = await supabase
    .from("anki_cards")
    .upsert(rows, { onConflict: "id", ignoreDuplicates: true });

  return error ? 0 : rows.length;
}
