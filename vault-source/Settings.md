# Claude Code Settings

> Last synced: 2026-03-24

## settings.json

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statusline-command.sh"
  },
  "enabledPlugins": {
    "superpowers@claude-plugins-official": true
  }
}
```

## Permissions (settings.local.json)

```json
{
  "permissions": {
    "allow": [
      "Bash(node start.js)",
      "Bash(node:*)",
      "Bash(gh auth:*)",
      "Bash(git init:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(gh repo:*)",
      "Bash(npx:*)",
      "Bash(yes \"no\")",
      "Bash(echo \"SHELL: $SHELL\")",
      "Bash(echo \"TERM: $TERM\")",
      "Bash(echo \"TERM_PROGRAM: $TERM_PROGRAM\")",
      "Bash(brew list:*)",
      "Bash(brew install:*)",
      "Bash(pyenv install:*)",
      "Bash(npm run:*)",
      "Bash(git:*)",
      "Bash(vercel --yes --prod)",
      "Bash(bash ~/.claude/statusline-command.sh)",
      "Bash(npm install:*)",
      "Bash(claude login:*)",
      "Bash(claude:*)",
      "Bash(vercel whoami:*)",
      "WebFetch(domain:github.com)",
      "Bash(bash install.sh --help)",
      "Bash(bash install.sh typescript python golang rust java kotlin swift cpp csharp php perl javascript 2>&1)",
      "Bash(find /Users/liebe/_bmad -name CLAUDE.md -o -name *.rules -o -name RULES.md)",
      "Bash(cat /Users/liebe/_bmad/_config/*.yaml)",
      "Bash(python3:*)",
      "Bash(VAULT=\"/Users/liebe/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/self-mastery/cc\")",
      "Read(//Users/liebe/.claude/everything-claude-code/**)",
      "Bash(find /Users/liebe/.claude -maxdepth 2 -name .env* -o -name *.env)",
      "Skill(schedule)",
      "Bash(find /Users/liebe/.claude -name *.json -path */mcp*)",
      "Bash(chmod:*)",
      "Bash(bash /Users/liebe/.claude/scripts/sync-to-obsidian.sh 2>&1)",
      "Bash(find '/Users/liebe/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/self-mastery/cc/' -type f -name *.md)",
      "Bash(gh search:*)",
      "Bash(find '/Users/liebe/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/self-mastery/cc/rules' -type f -name *.md)",
      "Bash(find '/Users/liebe/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/self-mastery/cc/commands' -type f -name *.md)",
      "Bash(find '/Users/liebe/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/self-mastery/cc/agents' -type f -name *.md)",
      "Bash(gh api:*)",
      "WebSearch",
      "Bash(find '/Users/liebe/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/self-mastery/cc/' -type f \\\\\\(-name *.md -o -name *.json -o -name *.yaml \\\\\\))",
      "Bash(launchctl load:*)",
      "Bash(launchctl list:*)",
      "Bash(rm -rf claude-code-rpg)",
      "Bash(mkdir -p claude-code-rpg)",
      "Bash(npm init:*)",
      "WebFetch(domain:raw.githubusercontent.com)",
      "Bash(find '/Users/liebe/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/self-mastery/mir/0 - Personal 🙂' -name *\\\\u2019* -o -name *\\\\u201c* -o -name *\\\\u201d*)"
    ]
  }
}
```
