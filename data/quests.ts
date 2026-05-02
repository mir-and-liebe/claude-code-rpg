import type { QuestChain } from "@/lib/types";

export const questChains: QuestChain[] = [
  {
    id: "basics",
    name: "The Awakening",
    description: "Your first loop — state outcomes, load context, inspect, and review",
    icon: "Rocket",
    skillTreeId: "prompt-architect",
    skillNodeId: "pa-1",
    chainBonusXp: 50,
    concepts: [
      {
        title: "AI Is Your Pair Builder",
        content:
          "Vibecoding starts when you stop asking for vague help and start directing an AI collaborator toward a concrete product outcome. The key skill is clear intent plus enough context to act.",
        tips: [
          "State the outcome: 'make onboarding collect timezone before the dashboard loads'",
          "Provide context: mention files, errors, screenshots, constraints, and acceptance criteria",
          "Ask for inspection first when the codebase is unfamiliar",
          "Review the diff before you accept the work",
        ],
      },
    ],
    takeaways: [
      "State the product outcome before the implementation",
      "Load enough context for the AI to act responsibly",
      "Inspect first, then change",
      "The playground/ folder is your safe space to experiment",
    ],
    quests: [
      { id: "quest-1-1", title: "Inspect before acting", prompt: "Read exercises/01-hello.js and explain what it does before making any changes", xpReward: 25, order: 1 },
      { id: "quest-1-2", title: "State a tiny outcome", prompt: "Change the greeting in exercises/01-hello.js to say 'Hello from Vibecoding RPG!'", xpReward: 25, order: 2 },
      { id: "quest-1-3", title: "Run code", prompt: "Run exercises/01-hello.js with Node", xpReward: 25, order: 3 },
      { id: "quest-1-4", title: "Create a safe experiment", prompt: "Create a file in playground/ called my-first-script.js that prints the current date and time, then run it", xpReward: 30, order: 4 },
      { id: "quest-1-5", title: "Review the diff", prompt: "Show me what changed in this project and summarize whether the changes match the requested outcome", xpReward: 25, order: 5 },
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
          "The best vibecoders read systems before changing them. AI can search, summarize, and trace code quickly, but you still decide whether the map is trustworthy.",
        tips: [
          '"What does this project do, based on the code?"',
          '"Find all files that handle authentication"',
          '"Trace where userId enters and leaves the system"',
          '"Explain processOrder for a product manager and an engineer"',
          '"What are the risky areas to inspect before changing this?"',
        ],
      },
    ],
    takeaways: [
      "Always read before you edit",
      "Ask the AI to explain code at whatever level you need",
      "Use search to find relevant code across a project",
      "Tracing request flows helps you understand systems",
    ],
    quests: [
      { id: "quest-2-1", title: "Understand a module", prompt: "Read exercises/02-webapp.js and explain the architecture", xpReward: 25, order: 1 },
      { id: "quest-2-2", title: "Search for patterns", prompt: "Find all functions in exercises/02-webapp.js that handle errors", xpReward: 25, order: 2 },
      { id: "quest-2-3", title: "Trace the flow", prompt: "Trace what happens when a request hits the /users endpoint in exercises/02-webapp.js", xpReward: 30, order: 3 },
      { id: "quest-2-4", title: "Find dependencies", prompt: "What external modules would exercises/02-webapp.js need to run?", xpReward: 25, order: 4 },
      { id: "quest-2-5", title: "Summarize for shipping", prompt: "Give me a one-paragraph summary of what exercises/02-webapp.js does, suitable for a README and for deciding the next product slice", xpReward: 25, order: 5 },
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
          "The more precise your request, the better the result. Tell the AI what behavior should change, where to look, why it matters, and how you will judge success.",
        tips: [
          '"Add input validation to createUser and preserve existing response shapes"',
          '"Rename greet to welcome and update all call sites"',
          '"Add DELETE /users/:id with a 404 for missing users"',
        ],
      },
    ],
    takeaways: [
      "Review changes before accepting them",
      "If a change isn't right, ask for a smaller patch or a revert",
      "Always inspect the diff before moving to the next step",
    ],
    quests: [
      { id: "quest-3-1", title: "Fix a bug", prompt: "There's a bug in exercises/03-buggy.js — the calculateTotal function doesn't handle discounts correctly. Find and fix it.", xpReward: 30, order: 1 },
      { id: "quest-3-2", title: "Add a feature", prompt: "Add a search function to exercises/03-buggy.js that finds products by name (case-insensitive)", xpReward: 30, order: 2 },
      { id: "quest-3-3", title: "Refactor", prompt: "The formatReport function in exercises/03-buggy.js has repetitive code. Clean it up.", xpReward: 30, order: 3 },
      { id: "quest-3-4", title: "Multi-step edit", prompt: "In exercises/03-buggy.js, add a currency parameter to both calculateTotal and formatReport, defaulting to 'USD', then show the diff and explain the behavioral change", xpReward: 35, order: 4 },
    ],
  },
  {
    id: "git-workflow",
    name: "The Chronicle",
    description: "Use branches, diffs, commits, and PRs as your shipping safety rails",
    icon: "GitBranch",
    skillTreeId: "cli-dominance",
    skillNodeId: "cli-2",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Git Is Your Shipping Ledger",
        content:
          "Git turns AI-assisted work into controlled checkpoints. Whether you use Claude Code, Codex, Cursor, or a plain terminal, the rhythm is the same: branch, change, inspect, commit, and open a reviewable PR.",
        tips: [
          '"Create a branch for this product slice"',
          '"Show me what changed and group it by intent"',
          '"Commit my changes with a good message"',
          '"Create a pull request with test notes"',
          '"Summarize risks before merge"',
        ],
      },
    ],
    takeaways: [
      "Always commit before starting new work",
      "Use branches to keep experiments separate",
      "A good commit message explains the product intent, not just the files",
    ],
    quests: [
      { id: "quest-4-1", title: "Baseline", prompt: "Inspect the current git status and explain whether it is safe to start a new product slice", xpReward: 25, order: 1 },
      { id: "quest-4-2", title: "Branch & change", prompt: "Create a branch called lesson-4-practice, then add a short product-intent comment to exercises/01-hello.js", xpReward: 30, order: 2 },
      { id: "quest-4-3", title: "Commit", prompt: "Show the diff, then commit the changes with a descriptive message that explains the intent", xpReward: 25, order: 3 },
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
        title: "Show the AI the Error",
        content:
          "The fastest way to fix a bug is to give the AI three things: the error message, the file or flow where it happens, and the expected behavior.",
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
      "AI can run code, see errors, and fix them in a loop",
      "Ask about edge cases to catch hidden bugs",
      "AI can spot performance issues too",
    ],
    quests: [
      { id: "quest-5-1", title: "Runtime error", prompt: "Run exercises/05-bugs.js and fix all the errors", xpReward: 30, order: 1 },
      { id: "quest-5-2", title: "Logic error", prompt: "The isPalindrome function in exercises/05-bugs.js says 'racecar' is not a palindrome. Fix it.", xpReward: 30, order: 2 },
      { id: "quest-5-3", title: "Edge cases", prompt: "Test the safeDivide function in exercises/05-bugs.js with edge cases and fix any issues", xpReward: 30, order: 3 },
      { id: "quest-5-4", title: "Performance", prompt: "The findDuplicates function in exercises/05-bugs.js is inefficient. Make it faster, then explain the complexity before and after.", xpReward: 35, order: 4 },
    ],
  },
  {
    id: "building-features",
    name: "The Forge",
    description: "Slice product ideas into buildable, testable increments",
    icon: "Sparkles",
    skillTreeId: "product-shipper",
    skillNodeId: "ps-1",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Think Product, Talk Code",
        content:
          "Describe what the feature should let a user do, why it matters, and what counts as done. Vibecoding works best when the product slice is small enough to build and verify in one loop.",
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
      "AI can build complete features from a clear, testable description",
    ],
    quests: [
      { id: "quest-6-1", title: "Build from scratch", prompt: "Create exercises/06-todo.js — a command-line todo app for a solo founder that stores tasks in exercises/06-todos.json. Support: add, list, complete, and delete.", xpReward: 40, order: 1 },
      { id: "quest-6-2", title: "Test your feature", prompt: "Run exercises/06-todo.js with different commands to test it: add a task, list tasks, complete one, delete one", xpReward: 25, order: 2 },
      { id: "quest-6-3", title: "Enhance it", prompt: "Add a 'priority' field (high/medium/low) to the todo app, and a way to filter by priority", xpReward: 35, order: 3 },
      { id: "quest-6-4", title: "Polish", prompt: "Add clear terminal output, a help command, and a short usage note so the feature feels shippable", xpReward: 30, order: 4 },
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
          "Tests are executable acceptance criteria. Use AI to draft them, but make sure they prove the product behavior you actually promised.",
        tips: [
          '"Write tests for the calculateTotal function"',
          '"Run the tests and fix any failures"',
          '"Add edge case tests for safeDivide"',
          '"Set up a test framework for this project"',
        ],
      },
    ],
    takeaways: [
      "AI can set up test frameworks and write comprehensive tests",
      "TDD works well with vibecoding — describe behavior, write tests, then implement",
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
          "AI is strong at refactoring when you set the guardrails: preserve behavior, reduce duplication, improve naming, and run tests afterward.",
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
      "AI understands patterns like DRY, SOLID, and separation of concerns",
      "Use /simplify as a code review tool",
      "Modernizing syntax improves readability and maintainability",
    ],
    quests: [
      { id: "quest-8-1", title: "Simplify messy code", prompt: "Read exercises/08-messy.js and refactor it to be clean, readable, and well-structured", xpReward: 35, order: 1 },
      { id: "quest-8-2", title: "Extract patterns", prompt: "The handler functions in exercises/08-messy.js share a lot of logic. Extract the common patterns.", xpReward: 35, order: 2 },
      { id: "quest-8-3", title: "Modernize", prompt: "Convert the callback-based code in exercises/08-messy.js to use modern async/await", xpReward: 35, order: 3 },
      { id: "quest-8-4", title: "Use /simplify", prompt: "Type /simplify or ask for a focused refactor review of your recent changes", xpReward: 25, order: 4 },
    ],
  },
  {
    id: "advanced",
    name: "The Arcane Arts",
    description: "Agents, MCP servers, project instructions, and automation workflows",
    icon: "Cpu",
    skillTreeId: "mcp-mastery",
    skillNodeId: "mcp-1",
    chainBonusXp: 50,
    concepts: [
      {
        title: "Level Up Your Workflow",
        content:
          "Advanced vibecoding is about leverage: project instructions for persistent context, workflow commands for repeatable moves, agents for delegated work, and MCPs for external tools.",
        tips: [
          "Project instructions — conventions loaded automatically",
          "Workflow commands — repeatable planning, testing, review, and commit moves",
          "Agents — parallel focused work",
          "MCPs — connect to databases, APIs, docs, browsers, and deploys",
        ],
      },
    ],
    takeaways: [
      "Project instructions keep AI aligned with your conventions",
      "Workflow commands speed up common moves",
      "Agents let you delegate focused work",
      "MCPs extend AI tools to external systems",
    ],
    quests: [
      { id: "quest-9-1", title: "Enhance project instructions", prompt: "Create or update project instructions to include coding conventions: use const/let (never var), prefer arrow functions, always handle errors", xpReward: 30, order: 1 },
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
          "Here is the solo shipping loop: Discover → Plan → Build → Test → Review → Ship → Iterate. This quest chain combines everything you have learned.",
        tips: [
          '1. Discover — "What does this codebase do and where is the risk?"',
          '2. Plan — "I need to add X. What is the smallest shippable slice?"',
          '3. Build — "Implement the plan we discussed"',
          '4. Test — "Write tests and run them"',
          "5. Review — /simplify",
          "6. Ship — commit and prepare a PR or deploy note",
          '7. Iterate — "What should we improve next based on what changed?"',
        ],
      },
    ],
    takeaways: [
      "Navigate any codebase quickly",
      "Describe features clearly and get good implementations",
      "Debug issues by showing the AI the error and expected behavior",
      "Use git workflow naturally through conversation",
      "Write and run tests efficiently",
      "Refactor code with confidence",
      "Use project instructions to set persistent context",
      "Combine multiple skills in a single workflow",
    ],
    quests: [
      {
        id: "quest-10-boss",
        title: "Boss Quest: Ship a Bookmark Manager API",
        prompt: "Ship a complete REST API in exercises/10-bookmarks.js with: bookmarks (url, title, tags, createdAt), CRUD endpoints + search by tag, input validation and error handling, tests for all endpoints, a README usage note, then commit the result with a message that explains the product slice",
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
