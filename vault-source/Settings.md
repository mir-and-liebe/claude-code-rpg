# Claude Code Settings

> Last synced: 2026-03-26

## settings.json

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"/Users/liebe/.claude/everything-claude-code/scripts/hooks/run-with-flags-shell.sh\" \"pre:observe\" \"skills/continuous-learning-v2/hooks/observe.sh\" \"standard,strict\"",
            "timeout": 10,
            "async": true
          }
        ]
      },
      {
        "matcher": "Skill",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/autoresearch/scripts/context-budget-warn.sh",
            "timeout": 2,
            "async": true
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "TaskCreate|TaskUpdate",
        "hooks": [
          {
            "type": "command",
            "command": "bash /Users/liebe/Projects/mission-control/scripts/hook-task-to-mc.sh",
            "timeout": 5,
            "async": true
          }
        ]
      },
      {
        "matcher": "Bash|Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"/Users/liebe/.claude/everything-claude-code/scripts/hooks/run-with-flags-shell.sh\" \"post:observe\" \"skills/continuous-learning-v2/hooks/observe.sh\" \"standard,strict\"",
            "timeout": 10,
            "async": true
          }
        ]
      },
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'changed=\"$CLAUDE_FILE_PATH\"; if [[ \"$changed\" == */.claude/* ]] && [[ \"$changed\" != */.claude/cache/* ]] && [[ \"$changed\" != */.claude/sessions/* ]]; then bash ~/.claude/scripts/sync-to-obsidian.sh 2>/dev/null; fi'",
            "timeout": 5,
            "async": true
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/scripts/hooks/log-deploy.sh",
            "timeout": 3,
            "async": true
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/autoresearch/scripts/check-stale-memories.sh",
            "timeout": 5,
            "async": true
          }
        ]
      },
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/scripts/hooks/load-instincts.sh",
            "timeout": 3
          }
        ]
      },
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/scripts/hooks/auto-commands.sh",
            "timeout": 3
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "printf '\\a'",
            "timeout": 5
          }
        ]
      },
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/autoresearch/scripts/auto-promote-instincts.sh",
            "timeout": 5,
            "async": true
          }
        ]
      },
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/scripts/hooks/track-instinct-effectiveness.sh",
            "timeout": 10,
            "async": true
          }
        ]
      },
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/scripts/hooks/detect-correction.js",
            "timeout": 10,
            "async": true
          }
        ]
      }
    ]
  },
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statusline-command.sh"
  },
  "enabledPlugins": {
    "superpowers@claude-plugins-official": true,
    "skill-creator@claude-plugins-official": true,
    "telegram@claude-plugins-official": true,
    "frontend-design@claude-plugins-official": true
  },
  "voiceEnabled": true,
  "autoMode": {
    "allow": [
      "All file reads and writes within ~/Projects/ and ~/.claude/",
      "All git operations on feature branches",
      "Running tests, linters, and formatters",
      "Installing npm/pnpm packages",
      "Creating and editing files anywhere under the home directory",
      "MCP tool calls to Slack and Asana",
      "All subagent and background task operations",
      "Web fetches and searches for research",
      "Obsidian vault writes"
    ],
    "soft_deny": [
      "Force pushing to any branch",
      "Pushing directly to main or master",
      "Running rm -rf on directories outside ~/Projects/",
      "Dropping database tables",
      "Modifying production environment variables"
    ],
    "environment": [
      "User is a solo developer on Max 20x plan",
      "Running 6 concurrent tmux sessions via cc6go",
      "Projects: mission-control, telegram-crm, telegram-crm-app",
      "Stack: Next.js, Supabase, Vercel, pnpm",
      "User wants maximum autonomy — only pause for requirements specs and critical security"
    ]
  }
}
```

## Permissions (settings.local.json)

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "MultiEdit",
      "Glob",
      "Grep",
      "Bash(*)",
      "WebFetch",
      "WebSearch",
      "Skill(*)",
      "TaskCreate",
      "TaskGet",
      "TaskList",
      "TaskUpdate",
      "TaskOutput",
      "TaskStop",
      "NotebookEdit",
      "CronCreate",
      "CronDelete",
      "CronList",
      "RemoteTrigger",
      "Read(//tmp/**)",
      "Read(//private/tmp/**)",
      "mcp__claude_ai_Slack__*",
      "mcp__claude_ai_Asana__*",
      "mcp__plugin_telegram_telegram__*"
    ],
    "defaultMode": "auto"
  }
}
```
