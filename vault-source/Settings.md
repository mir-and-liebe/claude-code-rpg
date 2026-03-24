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
  },
  "voiceEnabled": true
}
```

## Permissions (settings.local.json)

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(gh:*)",
      "Bash(node:*)",
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(pnpm:*)",
      "Bash(python3:*)",
      "Bash(pyenv:*)",
      "Bash(fnm:*)",
      "Bash(brew:*)",
      "Bash(claude:*)",
      "Bash(vercel:*)",
      "Bash(chmod:*)",
      "Bash(echo:*)",
      "Bash(find:*)",
      "Bash(bash:*)",
      "Bash(launchctl:*)",
      "Bash(mkdir:*)",
      "Read(/Users/liebe/.claude/everything-claude-code/**)",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:raw.githubusercontent.com)",
      "WebSearch",
      "Skill(schedule)",
      "Bash(VAULT=\"/Users/liebe/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/self-mastery/cc\")",
      "Read(//Users/liebe/$VAULT/skills/**)",
      "Bash(ls ~/Library/Fonts/*Nerd*)",
      "Bash(uipro init:*)",
      "Bash(BASE=\"/Users/liebe/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/self-mastery/mir/3 - Learning 📚/Mentors/Charlie Morgan\")",
      "Bash(rm -f \"$BASE/self improvement is a f*cking SCAM.md\")",
      "Read(//Users/liebe/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/self-mastery/mir/3 - Learning 📚/Mentors/**)",
      "Bash('VAULT=/Users/liebe/Library/Mobile Documents/com~apple~CloudDocs/Obsidian/self-mastery/cc')",
      "Read(//Users/liebe/**)",
      "Read(//Users/liebe/$VAULT/**)",
      "Bash(source ~/.zshrc)",
      "Bash(starship --version)",
      "Bash(eza --version)",
      "Bash(fzf --version)",
      "Bash(zoxide --query)",
      "Bash(atuin --version)",
      "Bash(tmux -V)",
      "Bash(direnv --version)"
    ]
  }
}
```
