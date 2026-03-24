import { createClient } from "@supabase/supabase-js";
import skillTreesData from "@/data/skills.json";
import type { SkillTree, CharacterClass } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
}

const DEFAULT_PROGRESS: ProgressRow = {
  id: "default",
  character_name: "Vibecoder",
  character_title: "Product Manager turned Vibecoder",
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
};

export async function loadProgress(): Promise<ProgressRow> {
  const { data, error } = await supabase
    .from("rpg_progress")
    .select("*")
    .eq("id", "default")
    .single();

  if (error || !data) {
    return { ...DEFAULT_PROGRESS };
  }

  return { ...DEFAULT_PROGRESS, ...data } as ProgressRow;
}

export async function saveCompletedSkills(
  skills: string[],
  characterClass: CharacterClass = ""
): Promise<void> {
  const totalXp = calculateTotalXp(skills, characterClass);
  const today = new Date().toISOString().split("T")[0];

  const current = await loadProgress();
  const history = [...current.xp_history];

  const todayIdx = history.findIndex((h) => h.date === today);
  if (todayIdx >= 0) {
    history[todayIdx] = { ...history[todayIdx], xp: totalXp };
  } else {
    history.push({ date: today, xp: totalXp });
  }

  // Update streak
  const streakData = updateStreak(current, today);

  await supabase
    .from("rpg_progress")
    .update({
      completed_skills: skills,
      xp_history: history,
      updated_at: new Date().toISOString(),
      ...streakData,
    })
    .eq("id", "default");
}

export async function saveCharacter(fields: {
  character_name?: string;
  character_title?: string;
  character_class?: string;
  avatar?: string;
}): Promise<void> {
  await supabase
    .from("rpg_progress")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", "default");
}

export async function saveChapterSeen(chapterId: string): Promise<void> {
  await supabase
    .from("rpg_progress")
    .update({ last_seen_chapter: chapterId })
    .eq("id", "default");
}

export async function saveEasterEgg(eggId: string): Promise<void> {
  const current = await loadProgress();
  if (current.discovered_easter_eggs.includes(eggId)) return;
  await supabase
    .from("rpg_progress")
    .update({
      discovered_easter_eggs: [...current.discovered_easter_eggs, eggId],
    })
    .eq("id", "default");
}

// Class bonuses: +25% XP for bonus trees
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

function updateStreak(
  current: ProgressRow,
  today: string
): { streak_current: number; streak_best: number; streak_last_date: string } {
  const lastDate = current.streak_last_date;

  if (lastDate === today) {
    // Already active today
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
    // Consecutive day
    const newStreak = current.streak_current + 1;
    return {
      streak_current: newStreak,
      streak_best: Math.max(newStreak, current.streak_best),
      streak_last_date: today,
    };
  }

  // Streak broken — start fresh
  return {
    streak_current: 1,
    streak_best: Math.max(1, current.streak_best),
    streak_last_date: today,
  };
}
