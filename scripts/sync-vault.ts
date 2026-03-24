/**
 * Vault Sync Script
 * Parses Obsidian cc/ vault markdown files into JSON for the dashboard.
 * Run: npx tsx scripts/sync-vault.ts
 *
 * This script reads from the vault markdown files (committed to the repo
 * under vault-source/) and outputs parsed JSON to data/vault/.
 */

import * as fs from "fs";
import * as path from "path";

const VAULT_SOURCE = path.join(process.cwd(), "vault-source");
const DATA_OUTPUT = path.join(process.cwd(), "data", "vault");

interface ParsedTable {
  headers: string[];
  rows: Record<string, string>[];
}

function parseMarkdownTable(content: string): ParsedTable[] {
  const tables: ParsedTable[] = [];
  const lines = content.split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.startsWith("|") && line.endsWith("|")) {
      const headers = line
        .split("|")
        .filter(Boolean)
        .map((h) => h.trim());

      // Skip separator line
      if (i + 1 < lines.length && lines[i + 1].includes("---")) {
        i += 2;
        const rows: Record<string, string>[] = [];

        while (i < lines.length) {
          const rowLine = lines[i].trim();
          if (!rowLine.startsWith("|") || !rowLine.endsWith("|")) break;
          const cells = rowLine
            .split("|")
            .filter(Boolean)
            .map((c) => c.trim());
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => {
            row[h] = cells[idx] || "";
          });
          rows.push(row);
          i++;
        }
        tables.push({ headers, rows });
        continue;
      }
    }
    i++;
  }
  return tables;
}

function syncFile(filename: string, outputName: string) {
  const filePath = path.join(VAULT_SOURCE, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`  Skipping ${filename} (not found)`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const tables = parseMarkdownTable(content);

  // Extract metadata
  const lastSyncMatch = content.match(/Last synced:\s*(.+)/);
  const countMatch = content.match(/(\d+)\s*(configured|commands|files|skills|agents)/);

  const result = {
    source: filename,
    lastSynced: lastSyncMatch ? lastSyncMatch[1] : new Date().toISOString().split("T")[0],
    count: countMatch ? parseInt(countMatch[1]) : tables[0]?.rows.length || 0,
    tables,
  };

  const outPath = path.join(DATA_OUTPUT, `${outputName}.json`);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`  ✓ ${filename} → ${outputName}.json (${result.count} entries)`);
}

function main() {
  console.log("Syncing vault...\n");

  fs.mkdirSync(DATA_OUTPUT, { recursive: true });

  const mappings: [string, string][] = [
    ["Dashboard.md", "dashboard"],
    ["MCPs.md", "mcps"],
    ["CLIs.md", "clis"],
    ["Settings.md", "settings"],
    ["commands/Commands Index.md", "commands"],
    ["agents/Agents Index.md", "agents"],
    ["rules/Rules Index.md", "rules"],
    ["skills/Skills Index.md", "skills"],
  ];

  for (const [source, output] of mappings) {
    syncFile(source, output);
  }

  console.log("\nDone!");
}

main();
