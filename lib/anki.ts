import { addAnkiXp } from "./supabase";
import { calculateNextReview, qualityFromRating } from "./spaced-repetition";

const ANKI_KEY = "vibecoding-rpg-anki-cards";

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

export async function getStudyQueue(
  limit: number = 20,
  characterClass: string = ""
): Promise<AnkiCard[]> {
  const today = todayString();
  const cards = readCards();

  const dueCards = cards
    .filter((card) => card.status !== "new" && card.next_review && card.next_review <= today)
    .sort((a, b) => String(a.next_review).localeCompare(String(b.next_review)));
  const newCards = cards.filter((card) => card.status === "new").slice(0, 10);
  const queue = [...dueCards, ...newCards];

  const classBonusTrees: Record<string, string[]> = {
    architect: ["prompt-architect", "agent-craft"],
    operator: ["cli-dominance", "mcp-mastery"],
    shipper: ["product-shipper", "code-comprehension"],
  };
  const bonusSkillPrefixes = (classBonusTrees[characterClass] || []).map((tree) =>
    tree.split("-")[0].slice(0, 2)
  );

  queue.sort((a, b) => {
    const aDue = a.next_review && a.next_review <= today ? -1 : 0;
    const bDue = b.next_review && b.next_review <= today ? -1 : 0;
    if (aDue !== bDue) return aDue - bDue;

    const aClass = bonusSkillPrefixes.some((prefix) =>
      (a.related_skill || "").startsWith(prefix)
    )
      ? -1
      : 0;
    const bClass = bonusSkillPrefixes.some((prefix) =>
      (b.related_skill || "").startsWith(prefix)
    )
      ? -1
      : 0;
    if (aClass !== bClass) return aClass - bClass;

    return Number(a.status === "new") - Number(b.status === "new");
  });

  return queue.slice(0, limit);
}

export async function rateCard(
  cardId: string,
  rating: "forgot" | "hard" | "good" | "easy"
): Promise<{ xpEarned: number }> {
  const cards = readCards();
  const index = cards.findIndex((card) => card.id === cardId);
  if (index < 0) return { xpEarned: 0 };

  const card = cards[index];
  const quality = qualityFromRating(rating);
  const next = calculateNextReview(quality, {
    easeFactor: card.ease_factor,
    intervalDays: card.interval_days,
    repetitions: card.repetitions,
  });
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + next.intervalDays);
  const isCorrect = quality >= 3;
  const status =
    next.repetitions === 0
      ? "learning"
      : next.intervalDays >= 21
        ? "mature"
        : "reviewing";

  cards[index] = {
    ...card,
    ease_factor: next.easeFactor,
    interval_days: next.intervalDays,
    repetitions: next.repetitions,
    next_review: nextDate.toISOString().split("T")[0],
    last_review: todayString(),
    status,
    times_correct: isCorrect ? card.times_correct + 1 : card.times_correct,
    times_wrong: isCorrect ? card.times_wrong : card.times_wrong + 1,
  };
  writeCards(cards);

  const xpEarned = isCorrect ? card.xp_reward : 0;
  await addAnkiXp(xpEarned);
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
  const today = todayString();
  const cards = readCards();
  const newCount = cards.filter((card) => card.status === "new").length;
  const dueToday = cards.filter(
    (card) => card.status !== "new" && card.next_review && card.next_review <= today
  ).length;

  return {
    total: cards.length,
    new: newCount,
    learning: cards.filter((card) => card.status === "learning").length,
    reviewing: cards.filter((card) => card.status === "reviewing").length,
    mature: cards.filter((card) => card.status === "mature").length,
    dueToday: dueToday + Math.min(newCount, 10),
  };
}

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
  const existing = readCards();
  const existingIds = new Set(existing.map((card) => card.id));
  const rows = cards
    .filter((card) => !existingIds.has(card.id))
    .map(toAnkiCard);

  writeCards([...existing, ...rows]);
  return rows.length;
}

function toAnkiCard(card: {
  id: string;
  deck: string;
  front: string;
  back: string;
  tags: string[];
  related_skill: string;
  difficulty: string;
  xp_reward: number;
}): AnkiCard {
  return {
    ...card,
    related_skill: card.related_skill || null,
    ease_factor: 2.5,
    interval_days: 0,
    repetitions: 0,
    next_review: null,
    last_review: null,
    status: "new",
    times_correct: 0,
    times_wrong: 0,
    source: "seed",
  };
}

function readCards(): AnkiCard[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ANKI_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AnkiCard[];
  } catch {
    return [];
  }
}

function writeCards(cards: AnkiCard[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANKI_KEY, JSON.stringify(cards));
}

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}
