"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, TerminalSquare, Bot, Plug, BookOpen, Command } from "lucide-react";

// Inline reference data from vault
const commands = [
  { name: "/plan", desc: "Restate requirements, assess risks, create step-by-step implementation plan" },
  { name: "/tdd", desc: "Enforce test-driven development — write tests FIRST, then implement" },
  { name: "/code-review", desc: "Run adversarial multi-layer code review (Blind Hunter, Edge Case, Acceptance)" },
  { name: "/docs", desc: "Look up live documentation for any library via Context7" },
  { name: "/e2e", desc: "Generate and run Playwright end-to-end tests with screenshots" },
  { name: "/prompt-optimize", desc: "Analyze and enrich a draft prompt into an ECC-optimized version" },
  { name: "/save-session", desc: "Save session state to ~/.claude/sessions/ for later resume" },
  { name: "/resume-session", desc: "Reload session context from where you left off" },
  { name: "/checkpoint", desc: "Save a progress snapshot during long sessions" },
  { name: "/devfleet", desc: "Orchestrate parallel Claude agents via DevFleet MCP" },
  { name: "/orchestrate", desc: "Sequential and tmux/worktree orchestration for multi-agent workflows" },
  { name: "/learn", desc: "Extract reusable patterns from the current session" },
  { name: "/learn-eval", desc: "Self-evaluate quality before saving learned patterns" },
  { name: "/instinct-status", desc: "Show learned instincts with confidence scores" },
  { name: "/evolve", desc: "Analyze instincts and suggest evolved structures" },
  { name: "/skill-create", desc: "Extract coding patterns from git history into SKILL.md files" },
  { name: "/skill-health", desc: "Show skill portfolio health dashboard" },
  { name: "/go-review", desc: "Comprehensive Go code review for idiomatic patterns and concurrency" },
  { name: "/rust-review", desc: "Rust code review for ownership, lifetimes, and unsafe usage" },
  { name: "/kotlin-review", desc: "Kotlin review for null safety, coroutines, and idiomatic patterns" },
  { name: "/python-review", desc: "Python review for PEP 8, type hints, and Pythonic idioms" },
  { name: "/cpp-review", desc: "C++ review for memory safety, modern idioms, and concurrency" },
  { name: "/gradle-build", desc: "Fix Gradle build errors for Android and KMP projects" },
  { name: "/loop-start", desc: "Start a recurring task loop" },
  { name: "/context-budget", desc: "Analyze context window usage to find optimization opportunities" },
];

const agents = [
  { name: "architect", desc: "Design system architecture with trade-off analysis" },
  { name: "planner", desc: "Create step-by-step implementation plans" },
  { name: "code-reviewer", desc: "Multi-layer adversarial code review" },
  { name: "security-reviewer", desc: "Scan for vulnerabilities and security issues" },
  { name: "tdd-guide", desc: "Guide test-driven development workflow" },
  { name: "database-reviewer", desc: "Review queries, schemas, and data access patterns" },
  { name: "chief-of-staff", desc: "Coordinate multi-agent workflows" },
  { name: "loop-operator", desc: "Manage recurring automation tasks" },
  { name: "refactor-cleaner", desc: "Clean up code structure without changing behavior" },
  { name: "doc-updater", desc: "Update documentation to match code changes" },
  { name: "e2e-runner", desc: "Generate and run Playwright E2E tests" },
  { name: "harness-optimizer", desc: "Optimize eval harness configuration" },
];

const mcps = [
  { name: "github", desc: "PRs, issues, repos — full GitHub operations" },
  { name: "memory", desc: "Persistent context across sessions" },
  { name: "filesystem", desc: "File operations beyond sandbox" },
  { name: "vercel", desc: "Deploy, preview, manage environments" },
  { name: "railway", desc: "Backend service deployments" },
  { name: "supabase", desc: "Postgres + auth + realtime database" },
  { name: "clickhouse", desc: "Analytics queries on large datasets" },
  { name: "context7", desc: "Live documentation lookup for libraries" },
  { name: "exa-web-search", desc: "Web search and research via Exa API" },
  { name: "firecrawl", desc: "Web scraping and crawling" },
  { name: "devfleet", desc: "Parallel agent dispatch in isolated worktrees" },
  { name: "playwright", desc: "Browser automation and testing" },
  { name: "browser-use", desc: "AI browser agent for web tasks" },
  { name: "fal-ai", desc: "Image/video/audio generation" },
  { name: "insaits", desc: "AI security monitoring — anomaly detection" },
  { name: "confluence", desc: "Search and retrieve Confluence pages" },
  { name: "sequential-thinking", desc: "Chain-of-thought reasoning" },
  { name: "token-optimizer", desc: "95%+ context reduction via deduplication" },
  { name: "cloudflare-workers-builds", desc: "Cloudflare Workers build management" },
  { name: "magic", desc: "Magic UI components" },
];

type Tab = "commands" | "agents" | "mcps";

export function ReferenceDrawer() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("commands");
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const data = tab === "commands" ? commands : tab === "agents" ? agents : mcps;
  const filtered = search
    ? data.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.desc.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const tabs: { id: Tab; label: string; Icon: typeof TerminalSquare; count: number }[] = [
    { id: "commands", label: "Commands", Icon: TerminalSquare, count: commands.length },
    { id: "agents", label: "Agents", Icon: Bot, count: agents.length },
    { id: "mcps", label: "MCPs", Icon: Plug, count: mcps.length },
  ];

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-text-muted text-xs hover:text-text hover:border-border-subtle transition-all duration-300 cursor-pointer"
        title="Quick Reference (⌘K)"
      >
        <Command className="w-3 h-3" />
        <span className="font-mono">K</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-bg/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 max-w-[90vw] bg-surface border-l border-border z-50 transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold">Quick Reference</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-text-muted hover:text-text cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands, agents, MCPs..."
              className="w-full bg-bg border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-gold/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSearch(""); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs transition-colors cursor-pointer ${
                tab === t.id
                  ? "text-gold border-b-2 border-gold"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <t.Icon className="w-3 h-3" />
              {t.label}
              <span className="text-[9px] text-text-muted">({t.count})</span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="px-3 py-2.5 rounded-lg hover:bg-surface-hover transition-colors"
            >
              <p className="text-sm font-mono text-gold">{item.name}</p>
              <p className="text-[12px] text-text-muted mt-0.5 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-text-muted text-center py-8">
              No results for &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      </div>
    </>
  );
}
