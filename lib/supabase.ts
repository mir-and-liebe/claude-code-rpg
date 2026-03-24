import { createClient } from "@supabase/supabase-js";
import skillTreesData from "@/data/skills.json";
import type { SkillTree } from "./types";

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
}

export async function loadProgress(): Promise<ProgressRow> {
  const { data, error } = await supabase
    .from("rpg_progress")
    .select("*")
    .eq("id", "default")
    .single();

  if (error || !data) {
    return {
      id: "default",
      character_name: "Vibecoder",
      character_title: "Product Manager turned Vibecoder",
      completed_skills: [],
      xp_history: [{ date: new Date().toISOString().split("T")[0], xp: 0 }],
      updated_at: new Date().toISOString(),
    };
  }

  return data as ProgressRow;
}

export async function saveCompletedSkills(skills: string[]): Promise<void> {
  const totalXp = calculateTotalXp(skills);
  const today = new Date().toISOString().split("T")[0];

  const current = await loadProgress();
  const history = [...current.xp_history];

  const todayIdx = history.findIndex((h) => h.date === today);
  if (todayIdx >= 0) {
    history[todayIdx] = { ...history[todayIdx], xp: totalXp };
  } else {
    history.push({ date: today, xp: totalXp });
  }

  await supabase
    .from("rpg_progress")
    .update({
      completed_skills: skills,
      xp_history: history,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");
}

function calculateTotalXp(completedSkillIds: string[]): number {
  const trees = skillTreesData as SkillTree[];
  let total = 0;
  for (const tree of trees) {
    for (const node of tree.nodes) {
      if (completedSkillIds.includes(node.id)) {
        total += node.xpRequired;
      }
    }
  }
  return total;
}
