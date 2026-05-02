import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const fail = (message) => {
  console.error(`Content validation failed: ${message}`);
  process.exitCode = 1;
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function loadQuestChains() {
  const source = fs.readFileSync(path.join(root, "data/quests.ts"), "utf8");
  const chains = [];
  const chainBlocks = source.matchAll(
    /\{\s*id: "([^"]+)",[\s\S]*?skillTreeId: "([^"]+)",\s*skillNodeId: "([^"]+)",[\s\S]*?quests: \[([\s\S]*?)\],\s*\}/g
  );
  for (const match of chainBlocks) {
    chains.push({
      id: match[1],
      skillTreeId: match[2],
      skillNodeId: match[3],
      questIds: [...match[4].matchAll(/id: "([^"]+)"/g)].map((questMatch) => questMatch[1]),
    });
  }
  return chains;
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", ".next", "out", "data/vault"].includes(entry.name)) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

const skills = readJson("data/skills.json");
const challenges = readJson("data/challenges.json");
const ankiCards = readJson("data/anki-cards.json");
const questChains = loadQuestChains();

const treeIds = new Set(skills.map((tree) => tree.id));
const skillIds = new Set(skills.flatMap((tree) => tree.nodes.map((node) => node.id)));

const questIds = new Set();
for (const chain of questChains) {
  if (!treeIds.has(chain.skillTreeId)) {
    fail(`quest chain ${chain.id} references missing skill tree ${chain.skillTreeId}`);
  }
  if (!skillIds.has(chain.skillNodeId)) {
    fail(`quest chain ${chain.id} references missing skill node ${chain.skillNodeId}`);
  }
  for (const questId of chain.questIds) {
    if (questIds.has(questId)) {
      fail(`duplicate quest id ${questId}`);
    }
    questIds.add(questId);
  }
}

for (const challenge of challenges) {
  if (!skillIds.has(challenge.skillId)) {
    fail(`challenge references missing skill ${challenge.skillId}`);
  }
}

for (const card of ankiCards) {
  if (card.related_skill && !skillIds.has(card.related_skill)) {
    fail(`Anki card ${card.id} references missing skill ${card.related_skill}`);
  }
}

const scannedRoots = ["app", "components", "data", "lib", "exercises", "scripts"];
const forbidden = [`Claude Code ${"Academy"}`, `CC ${"RPG"}`];
for (const scanRoot of scannedRoots) {
  for (const file of walk(path.join(root, scanRoot))) {
    if (!/\.(tsx?|jsx?|json|md|mjs)$/.test(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const phrase of forbidden) {
      if (text.includes(phrase)) {
        fail(`${path.relative(root, file)} contains old branding: ${phrase}`);
      }
    }
  }
}

if (!process.exitCode) {
  console.log("Content validation passed.");
}
