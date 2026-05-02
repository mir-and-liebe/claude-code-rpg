import skillTreesData from "@/data/skills.json";
import type { CharacterClass, SkillTree } from "./types";

const PROGRESS_KEY = "vibecoding-rpg-progress";
const REVIEWS_KEY = "vibecoding-rpg-skill-reviews";
const DAILY_KEY = "vibecoding-rpg-daily-quests";

export interface ProgressRow {
  id: string;
  character_name: string;
  character_title: string;
  completed_skills: string[];
  xp_history: { date: string; xp: number }[];
  updated_at: string;
  last_seen_chapter: string;
  character_class: string;
  avatar: string;
  unlocked_widgets: string[];
  streak_current: number;
  streak_best: number;
  streak_last_date: string | null;
  discovered_easter_eggs: string[];
  verified_skills: string[];
  anki_xp: number;
  anki_streak: number;
  anki_last_date: string | null;
  completed_quests: string[];
  quest_xp: number;
}

export interface SkillReviewRow {
  skill_id: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  last_review: string;
}

export interface DailyQuestRow {
  id: string;
  date: string;
  quest_type: string;
  quest_target: string;
  bonus_xp: number;
  completed: boolean;
}

const DEFAULT_PROGRESS: ProgressRow = {
  id: "default",
  character_name: "Vibecoder",
  character_title: "Solo Shipper turned Vibecoder",
  completed_skills: [],
  xp_history: [{ date: new Date().toISOString().split("T")[0], xp: 0 }],
  updated_at: new Date().toISOString(),
  last_seen_chapter: "",
  character_class: "",
  avatar: "swords",
  unlocked_widgets: [],
  streak_current: 0,
  streak_best: 0,
  streak_last_date: null,
  discovered_easter_eggs: [],
  verified_skills: [],
  anki_xp: 0,
  anki_streak: 0,
  anki_last_date: null,
  completed_quests: [],
  quest_xp: 0,
};

function hasStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasStorage()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!hasStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

async function saveProgress(progress: ProgressRow): Promise<void> {
  writeJson(PROGRESS_KEY, progress);
}

async function updateProgress(
  updater: (current: ProgressRow) => ProgressRow
): Promise<ProgressRow> {
  const next = updater(await loadProgress());
  await saveProgress(next);
  return next;
}

export async function loadProgress(): Promise<ProgressRow> {
  const stored = readJson<Partial<ProgressRow>>(PROGRESS_KEY, {});
  return { ...DEFAULT_PROGRESS, ...stored };
}

export async function saveCompletedSkills(
  skills: string[],
  characterClass: CharacterClass = ""
): Promise<void> {
  const today = todayString();
  await updateProgress((current) => {
    const totalXp = calculateTotalXp(skills, characterClass);
    const history = updateHistory(current.xp_history, today, totalXp + current.quest_xp + current.anki_xp);
    return {
      ...current,
      completed_skills: skills,
      xp_history: history,
      updated_at: new Date().toISOString(),
      ...updateStreak(current, today),
    };
  });
}

export async function saveCharacter(fields: {
  character_name?: string;
  character_title?: string;
  character_class?: string;
  avatar?: string;
}): Promise<void> {
  await updateProgress((current) => ({
    ...current,
    ...fields,
    updated_at: new Date().toISOString(),
  }));
}

export async function saveChapterSeen(chapterId: string): Promise<void> {
  await updateProgress((current) => ({ ...current, last_seen_chapter: chapterId }));
}

export async function saveEasterEgg(eggId: string): Promise<void> {
  await updateProgress((current) => {
    if (current.discovered_easter_eggs.includes(eggId)) return current;
    return {
      ...current,
      discovered_easter_eggs: [...current.discovered_easter_eggs, eggId],
    };
  });
}

export async function saveQuestCompletion(
  questId: string,
  xpAwarded: number
): Promise<void> {
  const today = todayString();
  await updateProgress((current) => {
    if (current.completed_quests.includes(questId)) return current;
    const completed_quests = [...current.completed_quests, questId];
    const quest_xp = current.quest_xp + xpAwarded;
    const currentTotalXp =
      calculateTotalXp(current.completed_skills, current.character_class as CharacterClass) +
      quest_xp +
      current.anki_xp;
    return {
      ...current,
      completed_quests,
      quest_xp,
      xp_history: updateHistory(current.xp_history, today, currentTotalXp),
      updated_at: new Date().toISOString(),
      ...updateStreak(current, today),
    };
  });
}

export async function saveVerifiedSkill(skillId: string): Promise<void> {
  await updateProgress((current) => {
    if (current.verified_skills.includes(skillId)) return current;
    return { ...current, verified_skills: [...current.verified_skills, skillId] };
  });
}

export async function addAnkiXp(xp: number): Promise<void> {
  if (xp <= 0) return;
  const today = todayString();
  await updateProgress((current) => {
    const anki_xp = current.anki_xp + xp;
    const currentTotalXp =
      calculateTotalXp(current.completed_skills, current.character_class as CharacterClass) +
      current.quest_xp +
      anki_xp;
    return {
      ...current,
      anki_xp,
      anki_last_date: today,
      xp_history: updateHistory(current.xp_history, today, currentTotalXp),
      updated_at: new Date().toISOString(),
    };
  });
}

export async function countDueSkillReviews(): Promise<number> {
  const today = todayString();
  return readReviews().filter((review) => review.next_review <= today).length;
}

export async function loadDueSkillReviews(): Promise<SkillReviewRow[]> {
  const today = todayString();
  return readReviews().filter((review) => review.next_review <= today);
}

export async function saveSkillReview(review: SkillReviewRow): Promise<void> {
  const reviews = readReviews();
  const index = reviews.findIndex((item) => item.skill_id === review.skill_id);
  if (index >= 0) {
    reviews[index] = review;
  } else {
    reviews.push(review);
  }
  writeJson(REVIEWS_KEY, reviews);
}

export async function loadDailyQuest(id: string): Promise<DailyQuestRow | null> {
  return readDailyQuests().find((quest) => quest.id === id) ?? null;
}

export async function saveDailyQuest(quest: DailyQuestRow): Promise<void> {
  const quests = readDailyQuests();
  const index = quests.findIndex((item) => item.id === quest.id);
  if (index >= 0) {
    quests[index] = quest;
  } else {
    quests.push(quest);
  }
  writeJson(DAILY_KEY, quests);
}

const CLASS_BONUS_TREES: Record<string, string[]> = {
  architect: ["prompt-architect", "agent-craft"],
  operator: ["cli-dominance", "mcp-mastery"],
  shipper: ["product-shipper", "code-comprehension"],
};

export function calculateTotalXp(
  completedSkillIds: string[],
  characterClass: CharacterClass = ""
): number {
  const trees = skillTreesData as SkillTree[];
  const bonusTrees = CLASS_BONUS_TREES[characterClass] || [];
  let total = 0;
  for (const tree of trees) {
    const multiplier = bonusTrees.includes(tree.id) ? 1.25 : 1;
    for (const node of tree.nodes) {
      if (completedSkillIds.includes(node.id)) {
        total += Math.floor(node.xpRequired * multiplier);
      }
    }
  }
  return total;
}

function readReviews(): SkillReviewRow[] {
  return readJson<SkillReviewRow[]>(REVIEWS_KEY, []);
}

function readDailyQuests(): DailyQuestRow[] {
  return readJson<DailyQuestRow[]>(DAILY_KEY, []);
}

function updateHistory(
  history: { date: string; xp: number }[],
  date: string,
  xp: number
): { date: string; xp: number }[] {
  const next = [...history];
  const todayIdx = next.findIndex((item) => item.date === date);
  if (todayIdx >= 0) {
    next[todayIdx] = { ...next[todayIdx], xp };
  } else {
    next.push({ date, xp });
  }
  return next;
}

function updateStreak(
  current: ProgressRow,
  today: string
): { streak_current: number; streak_best: number; streak_last_date: string } {
  const lastDate = current.streak_last_date;

  if (lastDate === today) {
    return {
      streak_current: current.streak_current,
      streak_best: current.streak_best,
      streak_last_date: today,
    };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastDate === yesterdayStr) {
    const streak_current = current.streak_current + 1;
    return {
      streak_current,
      streak_best: Math.max(streak_current, current.streak_best),
      streak_last_date: today,
    };
  }

  return {
    streak_current: 1,
    streak_best: Math.max(1, current.streak_best),
    streak_last_date: today,
  };
}
