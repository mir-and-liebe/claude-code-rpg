export interface SkillNode {
  id: string;
  name: string;
  level: number;
  xpRequired: number;
  xpSource: string;
  description: string;
  whyItMatters: string;
  pmAnalogy: string;
  completed: boolean;
}

export interface SkillTree {
  id: string;
  name: string;
  tagline: string;
  pmSuperpower: string;
  color: string;
  icon: string;
  nodes: SkillNode[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlocked: boolean;
}

export interface BestPractice {
  id: string;
  category: string;
  title: string;
  what: string;
  why: string;
  vaultSource: string;
  relatedSkillTree: string;
  relatedTools: string[];
}

export interface CharacterProfile {
  name: string;
  title: string;
  level: number;
  totalXp: number;
  xpToNextLevel: number;
  rank: string;
  badges: Badge[];
  skillTrees: SkillTree[];
}

export interface VaultStats {
  rules: number;
  commands: number;
  agents: number;
  skills: number;
  mcps: number;
  clis: number;
  lastSynced: string;
}

export type RankTitle =
  | "Intern"
  | "Junior Vibecoder"
  | "Vibecoder"
  | "Senior Vibecoder"
  | "Staff Vibecoder"
  | "Vibecoding Architect";
