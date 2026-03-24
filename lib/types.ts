export interface SkillNode {
  id: string;
  name: string;
  level: number;
  xpRequired: number;
  xpSource: string;
  description: string;
  whyItMatters: string;
  pmAnalogy: string;
  impact?: string;
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

// Tiered badges (CD2)
export interface BadgeTier {
  tier: "bronze" | "silver" | "gold";
  name: string;
  condition: string;
  description: string;
}

export interface Badge {
  id: string;
  icon: string;
  tiers: BadgeTier[];
  currentTier: "none" | "bronze" | "silver" | "gold";
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

// Narrative chapters (CD1)
export interface NarrativeChapter {
  id: string;
  title: string;
  trigger: string;
  text: string;
}

// Class system (CD3)
export type CharacterClass = "" | "architect" | "operator" | "shipper";

export interface ClassDef {
  id: CharacterClass;
  name: string;
  description: string;
  bonusTrees: string[];
}

// Skill combos (CD3)
export interface SkillCombo {
  id: string;
  name: string;
  skills: string[];
  bonusXp: number;
  description: string;
}

// Collection sets (CD4)
export interface CollectionSet {
  id: string;
  name: string;
  badges: string[];
  bonusXp: number;
}

// Easter eggs (CD7)
export interface EasterEgg {
  id: string;
  name: string;
  condition: string;
  xp: number;
  description: string;
}

// Daily quest (CD6+CD7)
export interface DailyQuest {
  id: string;
  date: string;
  questType: string;
  questTarget: string;
  bonusXp: number;
  completed: boolean;
}

export interface CharacterProfile {
  name: string;
  title: string;
  level: number;
  totalXp: number;
  xpToNextLevel: number;
  rank: string;
  characterClass: CharacterClass;
  avatar: string;
  badges: Badge[];
  skillTrees: SkillTree[];
  streakCurrent: number;
  streakBest: number;
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
