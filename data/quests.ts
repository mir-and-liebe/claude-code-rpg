import type { QuestChain } from "@/lib/types";

export const questChains: QuestChain[] = [
  {
    id: "basics",
    name: "The Awakening",
    description: "Your first commands — learn to speak the language of Claude Code",
    icon: "Rocket",
    skillTreeId: "prompt-architect",
    skillNodeId: "pa-1",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Claude Code is Your Pair Programmer",
        content:
          "Claude Code lives in your terminal. It can read files, write code, run commands, and help you build anything. The key skill is learning how to ask.",
        tips: [
          "Be specific: 'fix the TypeError in server.js line 42' beats 'fix this'",
          "'the login form doesn't submit, debug it' beats 'make it work'",
          "'add unit tests for calculateTotal' beats 'add tests'",
        ],
      },
    ],
    takeaways: [
      "Be specific in your requests",
      "Claude Code can read, write, and run code",
      "You can ask questions about code and get explanations",
      "The playground/ folder is your safe space to experiment",
    ],
    quests: [
      { id: "quest-1-1", title: "Explore a file", prompt: "Read the file exercises/01-hello.js and explain what it does", xpReward: 25, order: 1 },
      { id: "quest-1-2", title: "Make a change", prompt: "Change the greeting in exercises/01-hello.js to say 'Hello from Claude Code Academy!'", xpReward: 25, order: 2 },
      { id: "quest-1-3", title: "Run code", prompt: "Run exercises/01-hello.js with Node", xpReward: 25, order: 3 },
      { id: "quest-1-4", title: "Create something new", prompt: "Create a file in playground/ called my-first-script.js that prints the current date and time, then run it", xpReward: 30, order: 4 },
      { id: "quest-1-5", title: "Ask a question", prompt: "What files are in this project?", xpReward: 25, order: 5 },
    ],
  },
  {
    id: "reading-code",
    name: "The Scout's Eye",
    description: "Navigate unfamiliar codebases and understand code structure fast",
    icon: "Search",
    skillTreeId: "code-comprehension",
    skillNodeId: "cc-1",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Explore Before You Change",
        content:
          "The best developers read code before writing it. Claude Code is exceptional at helping you understand existing code fast.",
        tips: [
          '"What does this project do?"',
          '"Find all files that handle authentication"',
          '"Search for where userId is used"',
          '"Explain the function processOrder in detail"',
          '"What\'s the architecture of this app?"',
        ],
      },
    ],
    takeaways: [
      "Always read before you edit",
      "Ask Claude to explain code at whatever level you need",
      "Use search to find relevant code across a project",
      "Tracing request flows helps you understand systems",
    ],
    quests: [
      { id: "quest-2-1", title: "Understand a module", prompt: "Read exercises/02-webapp.js and explain the architecture", xpReward: 25, order: 1 },
      { id: "quest-2-2", title: "Search for patterns", prompt: "Find all functions in exercises/02-webapp.js that handle errors", xpReward: 25, order: 2 },
      { id: "quest-2-3", title: "Trace the flow", prompt: "Trace what happens when a request hits the /users endpoint in exercises/02-webapp.js", xpReward: 30, order: 3 },
      { id: "quest-2-4", title: "Find dependencies", prompt: "What external modules would exercises/02-webapp.js need to run?", xpReward: 25, order: 4 },
      { id: "quest-2-5", title: "Summarize", prompt: "Give me a one-paragraph summary of what exercises/02-webapp.js does, suitable for a README", xpReward: 25, order: 5 },
    ],
  },
  {
    id: "editing-code",
    name: "The Blade's Edge",
    description: "Request precise code changes, add features, and modify behavior",
    icon: "Pencil",
    skillTreeId: "code-comprehension",
    skillNodeId: "cc-2",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Be Specific About What You Want",
        content:
          "The more precise your request, the better the result. Tell Claude Code what to change, where to change it, and why.",
        tips: [
          '"Add input validation to the createUser function"',
          '"Rename the greet function to welcome"',
          '"Add a DELETE /users/:id endpoint"',
        ],
      },
    ],
    takeaways: [
      "Review changes before accepting them",
      "If a change isn't right, say 'undo that' or be more specific",
      "You can say 'show me the diff' to see what changed",
    ],
    quests: [
      { id: "quest-3-1", title: "Fix a bug", prompt: "There's a bug in exercises/03-buggy.js — the calculateTotal function doesn't handle discounts correctly. Find and fix it.", xpReward: 30, order: 1 },
      { id: "quest-3-2", title: "Add a feature", prompt: "Add a search function to exercises/03-buggy.js that finds products by name (case-insensitive)", xpReward: 30, order: 2 },
      { id: "quest-3-3", title: "Refactor", prompt: "The formatReport function in exercises/03-buggy.js has repetitive code. Clean it up.", xpReward: 30, order: 3 },
      { id: "quest-3-4", title: "Multi-step edit", prompt: "In exercises/03-buggy.js, add a currency parameter to both calculateTotal and formatReport, defaulting to 'USD'", xpReward: 35, order: 4 },
    ],
  },
  {
    id: "git-workflow",
    name: "The Chronicle",
    description: "Commits, branches, diffs, and pull requests through conversation",
    icon: "GitBranch",
    skillTreeId: "cli-dominance",
    skillNodeId: "cli-2",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Claude Code is Git-Aware",
        content:
          "Claude Code understands your git state. It can commit, branch, diff, and even create GitHub pull requests — all through natural language.",
        tips: [
          '"Initialize a git repo"',
          '"Commit my changes with a good message"',
          '"Create a new branch called feature/add-search"',
          '"Show me what changed since the last commit"',
          '"Create a pull request"',
        ],
      },
    ],
    takeaways: [
      "Claude Code handles git commands through natural language",
      "Always commit before starting new work",
      "Use branches to keep experiments separate",
      "Claude writes good commit messages automatically",
    ],
    quests: [
      { id: "quest-4-1", title: "Initialize", prompt: "Initialize a git repo in this project and make an initial commit with all files", xpReward: 25, order: 1 },
      { id: "quest-4-2", title: "Branch & change", prompt: "Create a branch called lesson-4-practice, then add a comment to exercises/01-hello.js", xpReward: 30, order: 2 },
      { id: "quest-4-3", title: "Commit", prompt: "Commit the changes with a descriptive message", xpReward: 25, order: 3 },
      { id: "quest-4-4", title: "View history", prompt: "Show me the git log", xpReward: 25, order: 4 },
      { id: "quest-4-5", title: "Switch back", prompt: "Switch back to the main branch", xpReward: 25, order: 5 },
    ],
  },
  {
    id: "debugging",
    name: "The Bug Hunter",
    description: "Use error messages to guide fixes and debug like a pro",
    icon: "Bug",
    skillTreeId: "code-comprehension",
    skillNodeId: "cc-3",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Show Claude the Error",
        content:
          "The fastest way to fix a bug is to show Claude Code: the error message, the file where it happens, and what you expected instead.",
        tips: [
          '"I\'m getting this error: [paste error]. Fix it."',
          '"This function returns undefined when it should return a number"',
          '"Run this file and fix any errors"',
          '"Why does this test fail?"',
        ],
      },
    ],
    takeaways: [
      "Always include the error message",
      "Claude can run code, see errors, and fix them in a loop",
      "Ask about edge cases to catch hidden bugs",
      "Claude can spot performance issues too",
    ],
    quests: [
      { id: "quest-5-1", title: "Runtime error", prompt: "Run exercises/05-bugs.js and fix all the errors", xpReward: 30, order: 1 },
      { id: "quest-5-2", title: "Logic error", prompt: "The isPalindrome function in exercises/05-bugs.js says 'racecar' is not a palindrome. Fix it.", xpReward: 30, order: 2 },
      { id: "quest-5-3", title: "Edge cases", prompt: "Test the safeDivide function in exercises/05-bugs.js with edge cases and fix any issues", xpReward: 30, order: 3 },
      { id: "quest-5-4", title: "Performance", prompt: "The findDuplicates function in exercises/05-bugs.js is inefficient. Make it faster.", xpReward: 35, order: 4 },
    ],
  },
  {
    id: "building-features",
    name: "The Forge",
    description: "Describe features clearly and watch them come to life",
    icon: "Sparkles",
    skillTreeId: "product-shipper",
    skillNodeId: "ps-1",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Think Product, Talk Code",
        content:
          "Describe what you want the feature to do, not just the code you want written. Use the formula: 'Build a [thing] that [does what] so that [why/who benefits]'.",
        tips: [
          '"Build a todo list CLI that lets users add, list, complete, and delete tasks"',
          '"Add a search endpoint that filters users by name"',
          '"Create a utility that reads a CSV and outputs summary statistics"',
        ],
      },
    ],
    takeaways: [
      "Describe features in terms of user actions and outcomes",
      "Build incrementally — start simple, then enhance",
      "Test as you go",
      "Claude can build complete features from a description",
    ],
    quests: [
      { id: "quest-6-1", title: "Build from scratch", prompt: "Create exercises/06-todo.js — a command-line todo app that stores tasks in exercises/06-todos.json. Support: add, list, complete, and delete.", xpReward: 40, order: 1 },
      { id: "quest-6-2", title: "Test your feature", prompt: "Run exercises/06-todo.js with different commands to test it: add a task, list tasks, complete one, delete one", xpReward: 25, order: 2 },
      { id: "quest-6-3", title: "Enhance it", prompt: "Add a 'priority' field (high/medium/low) to the todo app, and a way to filter by priority", xpReward: 35, order: 3 },
      { id: "quest-6-4", title: "Polish", prompt: "Add colorful terminal output and a help command to the todo app", xpReward: 30, order: 4 },
    ],
  },
  {
    id: "testing",
    name: "The Proving Ground",
    description: "Write tests, run suites, and practice test-driven development",
    icon: "CheckCircle",
    skillTreeId: "product-shipper",
    skillNodeId: "ps-2",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Tests Are Your Safety Net",
        content:
          "Claude Code can both write and run tests. Use this to verify your code works, catch regressions, and document expected behavior.",
        tips: [
          '"Write tests for the calculateTotal function"',
          '"Run the tests and fix any failures"',
          '"Add edge case tests for safeDivide"',
          '"Set up a test framework for this project"',
        ],
      },
    ],
    takeaways: [
      "Claude can set up test frameworks and write comprehensive tests",
      "TDD works great with Claude — describe the behavior, write tests, then implement",
      "Always run tests after making changes",
      "Edge case tests catch the bugs that matter most",
    ],
    quests: [
      { id: "quest-7-1", title: "Setup testing", prompt: "Install a test framework and create exercises/07-math.test.js to test exercises/07-math.js", xpReward: 30, order: 1 },
      { id: "quest-7-2", title: "Write comprehensive tests", prompt: "Add tests for all edge cases in the math functions", xpReward: 30, order: 2 },
      { id: "quest-7-3", title: "TDD style", prompt: "Write tests first for a parseDate function that handles 'YYYY-MM-DD', 'Month DD, YYYY', and 'MM/DD/YYYY' formats, then implement it", xpReward: 40, order: 3 },
      { id: "quest-7-4", title: "Run & fix", prompt: "Run all the tests and fix any failures", xpReward: 25, order: 4 },
    ],
  },
  {
    id: "refactoring",
    name: "The Alchemist",
    description: "Clean up messy code and improve quality with confidence",
    icon: "RefreshCw",
    skillTreeId: "code-comprehension",
    skillNodeId: "cc-4",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Same Behavior, Better Code",
        content:
          "Claude Code excels at refactoring because it can understand the intent of existing code, apply known patterns, and make changes consistently.",
        tips: [
          '"This code is hard to read, simplify it"',
          '"Extract the validation logic into its own function"',
          '"Convert these callbacks to async/await"',
          '"Remove duplication between these two functions"',
        ],
      },
    ],
    takeaways: [
      "Refactoring is safe when you have tests",
      "Claude understands patterns like DRY, SOLID, and separation of concerns",
      "Use /simplify as a code review tool",
      "Modernizing syntax improves readability and maintainability",
    ],
    quests: [
      { id: "quest-8-1", title: "Simplify messy code", prompt: "Read exercises/08-messy.js and refactor it to be clean, readable, and well-structured", xpReward: 35, order: 1 },
      { id: "quest-8-2", title: "Extract patterns", prompt: "The handler functions in exercises/08-messy.js share a lot of logic. Extract the common patterns.", xpReward: 35, order: 2 },
      { id: "quest-8-3", title: "Modernize", prompt: "Convert the callback-based code in exercises/08-messy.js to use modern async/await", xpReward: 35, order: 3 },
      { id: "quest-8-4", title: "Use /simplify", prompt: "Type /simplify in Claude Code to review your recent changes for quality", xpReward: 25, order: 4 },
    ],
  },
  {
    id: "advanced",
    name: "The Arcane Arts",
    description: "Agents, MCP servers, CLAUDE.md, and automation workflows",
    icon: "Cpu",
    skillTreeId: "mcp-mastery",
    skillNodeId: "mcp-1",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Level Up Your Workflow",
        content:
          "Claude Code has powerful features beyond basic editing: CLAUDE.md for project memory, slash commands for common actions, subagents for parallel work, and MCP for external tools.",
        tips: [
          "CLAUDE.md — Project conventions loaded automatically",
          "Slash commands — /simplify, /commit, and more",
          "Subagents — Parallel focused work",
          "MCP — Connect to databases, APIs, and services",
        ],
      },
    ],
    takeaways: [
      "CLAUDE.md is your project's instruction manual for Claude",
      "Slash commands speed up common workflows",
      "Subagents let Claude do multiple things at once",
      "MCP extends Claude's reach to external systems",
    ],
    quests: [
      { id: "quest-9-1", title: "Enhance CLAUDE.md", prompt: "Update CLAUDE.md to include coding conventions: use const/let (never var), prefer arrow functions, always handle errors", xpReward: 30, order: 1 },
      { id: "quest-9-2", title: "Multi-step automation", prompt: "Create a script that initializes a new Node.js project with TypeScript, ESLint, and Prettier configured", xpReward: 40, order: 2 },
      { id: "quest-9-3", title: "Slash commands", prompt: "Try /commit after making some changes", xpReward: 25, order: 3 },
      { id: "quest-9-4", title: "Parallel work", prompt: "Search all exercise files for functions that don't handle errors, AND create a summary of all functions", xpReward: 35, order: 4 },
    ],
  },
  {
    id: "real-world",
    name: "The Final Trial",
    description: "Put it all together with a complete end-to-end project",
    icon: "Trophy",
    skillTreeId: "product-shipper",
    skillNodeId: "ps-5",
    chainBonusXp: 100,
    concepts: [
      {
        title: "The Full Workflow",
        content:
          "Here's how experienced developers use Claude Code daily: Explore → Plan → Build → Test → Review → Commit → PR. This quest chain combines everything you've learned.",
        tips: [
          '1. Explore — "What does this codebase do?"',
          '2. Plan — "I need to add X. What\'s the best approach?"',
          '3. Build — "Implement the plan we discussed"',
          '4. Test — "Write tests and run them"',
          "5. Review — /simplify",
          "6. Commit — /commit",
          '7. PR — "Create a pull request"',
        ],
      },
    ],
    takeaways: [
      "Navigate any codebase quickly",
      "Describe features clearly and get good implementations",
      "Debug issues by showing Claude the error",
      "Use git workflow naturally through conversation",
      "Write and run tests efficiently",
      "Refactor code with confidence",
      "Use CLAUDE.md to set project context",
      "Combine multiple skills in a single workflow",
    ],
    quests: [
      {
        id: "quest-10-boss",
        title: "Boss Quest: Build a Bookmark Manager API",
        prompt: "Build a complete REST API in exercises/10-bookmarks.js with: bookmarks (url, title, tags, createdAt), CRUD endpoints + search by tag, input validation and error handling, tests for all endpoints, then commit the result with a good message",
        xpReward: 150,
        order: 1,
      },
    ],
  },
];

export function getQuestChain(chainId: string): QuestChain | undefined {
  return questChains.find((c) => c.id === chainId);
}

export function getAllQuestIds(): string[] {
  return questChains.flatMap((c) => c.quests.map((q) => q.id));
}

export function getTotalQuestXp(): number {
  return questChains.reduce(
    (total, chain) =>
      total + chain.chainBonusXp + chain.quests.reduce((s, q) => s + q.xpReward, 0),
    0
  );
}
