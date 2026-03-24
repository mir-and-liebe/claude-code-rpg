import type { SkillTree, Badge, RankTitle } from "./types";

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

export function checkBadgeUnlock(
  badge: Badge,
  trees: SkillTree[],
): boolean {
  const conditions: Record<string, () => boolean> = {
    first_skill: () => trees.some((t) => t.nodes.some((n) => n.completed)),
    tree_complete: () =>
      trees.some((t) => t.nodes.every((n) => n.completed)),
    mcp_collector: () => {
      const mcp = trees.find((t) => t.id === "mcp-mastery");
      return mcp ? mcp.nodes.filter((n) => n.completed).length >= 3 : false;
    },
    agent_whisperer: () => {
      const agent = trees.find((t) => t.id === "agent-craft");
      return agent
        ? agent.nodes.filter((n) => n.completed).length >= 3
        : false;
    },
    first_deploy: () => {
      const product = trees.find((t) => t.id === "product-shipper");
      return product
        ? product.nodes.filter((n) => n.completed).length >= 2
        : false;
    },
    polyglot: () => {
      const code = trees.find((t) => t.id === "code-comprehension");
      return code ? code.nodes.every((n) => n.completed) : false;
    },
    prompt_master: () => {
      const prompt = trees.find((t) => t.id === "prompt-architect");
      return prompt ? prompt.nodes.every((n) => n.completed) : false;
    },
    all_trees: () => trees.every((t) => t.nodes.every((n) => n.completed)),
  };

  const check = conditions[badge.condition];
  return check ? check() : false;
}
