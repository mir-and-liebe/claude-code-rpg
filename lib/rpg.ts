import type { SkillTree, Badge, BadgeTier, RankTitle, SkillCombo, EasterEgg } from "./types";
import badgesData from "@/data/badges.json";
import combosData from "@/data/combos.json";
import easterEggsData from "@/data/easter-eggs.json";
import skillTreesData from "@/data/skills.json";

const RANK_THRESHOLDS: { level: number; title: RankTitle }[] = [
  { level: 1, title: "Intern" },
  { level: 10, title: "Junior Vibecoder" },
  { level: 20, title: "Vibecoder" },
  { level: 30, title: "Senior Vibecoder" },
  { level: 40, title: "Staff Vibecoder" },
  { level: 45, title: "Vibecoding Architect" },
];

export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

export function levelFromXp(totalXp: number): number {
  let level = 1;
  let accumulated = 0;
  while (accumulated + xpForLevel(level) <= totalXp) {
    accumulated += xpForLevel(level);
    level++;
    if (level > 50) break;
  }
  return Math.min(level, 50);
}

export function getRank(level: number): RankTitle {
  let rank: RankTitle = "Intern";
  for (const threshold of RANK_THRESHOLDS) {
    if (level >= threshold.level) rank = threshold.title;
  }
  return rank;
}

export function getTreeProgress(tree: SkillTree): {
  completed: number;
  total: number;
  percentage: number;
  xpEarned: number;
  xpTotal: number;
} {
  const completed = tree.nodes.filter((n) => n.completed).length;
  const total = tree.nodes.length;
  const xpEarned = tree.nodes
    .filter((n) => n.completed)
    .reduce((sum, n) => sum + n.xpRequired, 0);
  const xpTotal = tree.nodes.reduce((sum, n) => sum + n.xpRequired, 0);
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    xpEarned,
    xpTotal,
  };
}

// --- Tiered Badge System (CD2) ---

function countTreeSkills(trees: SkillTree[], treeId: string): number {
  const tree = trees.find((t) => t.id === treeId);
  return tree ? tree.nodes.filter((n) => n.completed).length : 0;
}

function totalCompleted(trees: SkillTree[]): number {
  return trees.reduce((s, t) => s + t.nodes.filter((n) => n.completed).length, 0);
}

function checkTierCondition(condition: string, trees: SkillTree[]): boolean {
  const c: Record<string, () => boolean> = {
    skills_1: () => totalCompleted(trees) >= 1,
    skills_5: () => totalCompleted(trees) >= 5,
    skills_10: () => totalCompleted(trees) >= 10,
    mcp_1: () => countTreeSkills(trees, "mcp-mastery") >= 1,
    mcp_3: () => countTreeSkills(trees, "mcp-mastery") >= 3,
    mcp_5: () => countTreeSkills(trees, "mcp-mastery") >= 5,
    agent_1: () => countTreeSkills(trees, "agent-craft") >= 1,
    agent_3: () => countTreeSkills(trees, "agent-craft") >= 3,
    agent_5: () => countTreeSkills(trees, "agent-craft") >= 5,
    product_1: () => countTreeSkills(trees, "product-shipper") >= 1,
    product_3: () => countTreeSkills(trees, "product-shipper") >= 3,
    product_5: () => countTreeSkills(trees, "product-shipper") >= 5,
    prompt_1: () => countTreeSkills(trees, "prompt-architect") >= 1,
    prompt_3: () => countTreeSkills(trees, "prompt-architect") >= 3,
    prompt_5: () => countTreeSkills(trees, "prompt-architect") >= 5,
    code_1: () => countTreeSkills(trees, "code-comprehension") >= 1,
    code_3: () => countTreeSkills(trees, "code-comprehension") >= 3,
    code_5: () => countTreeSkills(trees, "code-comprehension") >= 5,
    tree_half: () => trees.some((t) => {
      const p = getTreeProgress(t);
      return p.completed >= Math.ceil(p.total / 2);
    }),
    tree_complete: () => trees.some((t) => t.nodes.every((n) => n.completed)),
    trees_3: () => trees.filter((t) => t.nodes.every((n) => n.completed)).length >= 3,
    all_trees_1: () => trees.every((t) => t.nodes.some((n) => n.completed)),
    all_trees_half: () => trees.every((t) => {
      const p = getTreeProgress(t);
      return p.completed >= Math.ceil(p.total / 2);
    }),
    all_trees: () => trees.every((t) => t.nodes.every((n) => n.completed)),
  };
  const check = c[condition];
  return check ? check() : false;
}

export function evaluateBadges(trees: SkillTree[]): Badge[] {
  return (badgesData as { id: string; icon: string; tiers: BadgeTier[] }[]).map((badge) => {
    let currentTier: Badge["currentTier"] = "none";
    for (const tier of badge.tiers) {
      if (checkTierCondition(tier.condition, trees)) {
        currentTier = tier.tier;
      }
    }
    return { ...badge, currentTier };
  });
}

// --- Skill Combos (CD3) ---

export function evaluateCombos(completedSkills: Set<string>): SkillCombo[] {
  return (combosData as SkillCombo[]).filter((combo) =>
    combo.skills.every((s) => completedSkills.has(s))
  );
}

// --- Narrative Chapters (CD1) ---

export function getCurrentChapter(
  completedCount: number,
  totalCount: number
): string {
  if (totalCount > 0 && completedCount >= totalCount) return "ch5";
  if (completedCount >= 20) return "ch4";
  if (completedCount >= 10) return "ch3";
  if (completedCount >= 5) return "ch2";
  if (completedCount >= 1) return "ch1";
  return "";
}

// --- Easter Eggs (CD7) ---

export function checkEasterEggs(
  completedSkills: Set<string>,
  trees: SkillTree[],
  discoveredCombos: number,
  streakCurrent: number,
  alreadyDiscovered: string[]
): EasterEgg[] {
  const found: EasterEgg[] = [];
  const eggs = easterEggsData as EasterEgg[];
  const hour = new Date().getHours();

  for (const egg of eggs) {
    if (alreadyDiscovered.includes(egg.id)) continue;

    const checks: Record<string, () => boolean> = {
      "1_per_tree": () => trees.every((t) => t.nodes.some((n) => n.completed)),
      "skill_after_midnight": () => hour >= 0 && hour < 5,
      "3_combos": () => discoveredCombos >= 3,
      "7_day_streak": () => streakCurrent >= 7,
      // 3_skills_1_day checked by caller (needs xp_history)
    };

    const check = checks[egg.condition];
    if (check && check()) {
      found.push(egg);
    }
  }

  return found;
}

// --- Fog of War (CD7) ---

export function isSkillRevealed(
  node: { level: number },
  tree: SkillTree,
  completedSkills: Set<string>
): boolean {
  if (node.level <= 3) return true;
  // Level 4-5 revealed when level 3 in same tree is completed
  const level3Node = tree.nodes.find((n) => n.level === 3);
  return level3Node ? completedSkills.has(level3Node.id) : false;
}

// --- Quest System (CD6+CD7) ---

const QUEST_CHAIN_NAMES = [
  "The Awakening", "The Scout's Eye", "The Blade's Edge", "The Chronicle",
  "The Bug Hunter", "The Forge", "The Proving Ground", "The Alchemist",
  "The Arcane Arts", "The Final Trial",
];

export function generateDailyQuest(dateStr: string): {
  questType: string;
  questTarget: string;
  bonusXp: number;
} {
  const trees = skillTreesData as SkillTree[];
  // Deterministic seed from date
  const seed = dateStr.split("-").reduce((a, b) => a + parseInt(b), 0);
  const treeIndex = seed % trees.length;
  const chainIndex = seed % QUEST_CHAIN_NAMES.length;
  const questTypes = [
    { type: "complete_skill", label: `Complete any skill in ${trees[treeIndex].name}`, xp: 50 },
    { type: "explore_practice", label: "Read any best practice's 'Why' section", xp: 25 },
    { type: "revisit_skill", label: "Expand a completed skill's details", xp: 25 },
    { type: "complete_quest", label: `Complete any quest in ${QUEST_CHAIN_NAMES[chainIndex]}`, xp: 50 },
    { type: "complete_3_quests", label: "Complete 3 quests today", xp: 75 },
  ];
  const questIndex = Math.floor(seed / trees.length) % questTypes.length;
  const quest = questTypes[questIndex];
  return { questType: quest.type, questTarget: quest.label, bonusXp: quest.xp };
}
