/**
 * Weekly Anki Card Sync
 * Reads vault markdown files and generates new flashcards from updates.
 * Run via: npx tsx scripts/sync-anki-cards.ts
 * Schedule: Weekly via GitHub Action or LaunchAgent
 */

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

const VAULT_SOURCE = path.join(process.cwd(), "vault-source");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface CardTemplate {
  id: string;
  deck: string;
  front: string;
  back: string;
  tags: string[];
  related_skill: string;
  difficulty: string;
  xp_reward: number;
}

function parseCommandsFile(content: string): CardTemplate[] {
  const cards: CardTemplate[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    // Match table rows: | command | description |
    const match = line.match(/\|\s*`?\/?([\w-]+)`?\s*\|\s*(.+?)\s*\|/);
    if (match && !match[1].includes("---") && match[1] !== "Command") {
      const cmd = match[1];
      const desc = match[2].replace(/\|/g, "").trim();
      if (desc.length > 10) {
        cards.push({
          id: `ak-vault-cmd-${cmd}`,
          deck: "vault-commands",
          front: `What does /${cmd} do?`,
          back: desc,
          tags: ["command", "vault-sync"],
          related_skill: "",
          difficulty: "normal",
          xp_reward: 5,
        });
      }
    }
  }
  return cards;
}

function parseMCPsFile(content: string): CardTemplate[] {
  const cards: CardTemplate[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = line.match(/\|\s*`?([\w-]+)`?\s*\|\s*(.+?)\s*\|/);
    if (match && !match[1].includes("---") && match[1] !== "Name" && match[1] !== "MCP") {
      const name = match[1];
      const desc = match[2].replace(/\|/g, "").trim();
      if (desc.length > 10) {
        cards.push({
          id: `ak-vault-mcp-${name}`,
          deck: "vault-mcps",
          front: `What does the ${name} MCP do?`,
          back: desc,
          tags: ["mcp", "vault-sync"],
          related_skill: "",
          difficulty: "normal",
          xp_reward: 5,
        });
      }
    }
  }
  return cards;
}

function parseAgentsFile(content: string): CardTemplate[] {
  const cards: CardTemplate[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = line.match(/\|\s*`?([\w-]+)`?\s*\|\s*(.+?)\s*\|/);
    if (match && !match[1].includes("---") && match[1] !== "Agent" && match[1] !== "Name") {
      const name = match[1];
      const desc = match[2].replace(/\|/g, "").trim();
      if (desc.length > 10) {
        cards.push({
          id: `ak-vault-agent-${name}`,
          deck: "vault-agents",
          front: `What does the ${name} agent do?`,
          back: desc,
          tags: ["agent", "vault-sync"],
          related_skill: "",
          difficulty: "normal",
          xp_reward: 5,
        });
      }
    }
  }
  return cards;
}

async function main() {
  console.log("Syncing Anki cards from vault...\n");

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    process.exit(1);
  }

  const allCards: CardTemplate[] = [];

  // Parse vault files
  const files: [string, (content: string) => CardTemplate[]][] = [
    ["commands/Commands Index.md", parseCommandsFile],
    ["MCPs.md", parseMCPsFile],
    ["agents/Agents Index.md", parseAgentsFile],
  ];

  for (const [filename, parser] of files) {
    const filepath = path.join(VAULT_SOURCE, filename);
    if (fs.existsSync(filepath)) {
      const content = fs.readFileSync(filepath, "utf-8");
      const cards = parser(content);
      allCards.push(...cards);
      console.log(`  ${filename}: ${cards.length} cards`);
    } else {
      console.log(`  ${filename}: not found, skipping`);
    }
  }

  if (allCards.length === 0) {
    console.log("\nNo new cards to sync.");
    return;
  }

  // Upsert to Supabase (won't overwrite existing cards)
  const rows = allCards.map((c) => ({
    id: c.id,
    deck: c.deck,
    front: c.front,
    back: c.back,
    tags: c.tags,
    related_skill: c.related_skill || null,
    difficulty: c.difficulty,
    xp_reward: c.xp_reward,
    status: "new",
    source: "vault-sync",
  }));

  const { error } = await supabase
    .from("anki_cards")
    .upsert(rows, { onConflict: "id", ignoreDuplicates: true });

  if (error) {
    console.error("Supabase error:", error.message);
  } else {
    console.log(`\nSynced ${allCards.length} cards to Supabase (new cards only, existing preserved).`);
  }
}

main();
