# Vibecoding RPG

Solo Shipping Mastery is a compact craft RPG for learning how to build products with AI coding tools. The game teaches the loop: discover, plan, build, test, review, ship, and iterate.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` starts the Next.js app.
- `npm run build` verifies the production build.
- `npm test` validates quest, skill, challenge, and flashcard content.
- `npm run sync-vault` refreshes vault-derived JSON content.
- `npm run sync-anki` refreshes flashcard content.

## Curriculum

The campaign keeps the RPG structure: skill trees, quest chains, badges, reviews, Anki cards, a progress log, and a curated Codex. The content is tool-agnostic by default, with examples from Claude Code, Codex, Cursor, GitHub, MCPs, deploy tools, and agents when they clarify a workflow.

## Progress Compatibility

Quest IDs, skill tree IDs, skill node IDs, badge IDs, challenge IDs, and Supabase progress fields are intentionally stable. Rebrand and curriculum updates should change human-facing copy, not saved-progress identifiers.
