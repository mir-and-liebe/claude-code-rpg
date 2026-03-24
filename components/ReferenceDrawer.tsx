"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, TerminalSquare, Bot, Plug, BookOpen, Command, Copy, Check } from "lucide-react";

interface RefItem {
  name: string;
  desc: string;
  category?: string;
}

const commands: RefItem[] = [
  // Workflow
  { name: "/plan", desc: "Create step-by-step implementation plan. WAIT for confirm.", category: "Workflow" },
  { name: "/tdd", desc: "Enforce test-driven development — tests FIRST, then implement", category: "Workflow" },
  { name: "/code-review", desc: "Adversarial multi-layer review (Blind Hunter, Edge Case, Acceptance)", category: "Workflow" },
  { name: "/e2e", desc: "Generate and run Playwright end-to-end tests", category: "Workflow" },
  { name: "/checkpoint", desc: "Save progress snapshot during long sessions", category: "Workflow" },
  { name: "/save-session", desc: "Save session state for later resume", category: "Workflow" },
  { name: "/resume-session", desc: "Reload session context from where you left off", category: "Workflow" },
  { name: "/devfleet", desc: "Orchestrate parallel Claude agents via DevFleet MCP", category: "Workflow" },
  { name: "/orchestrate", desc: "Sequential and tmux/worktree multi-agent orchestration", category: "Workflow" },
  // Learning
  { name: "/learn", desc: "Extract reusable patterns from current session", category: "Learning" },
  { name: "/learn-eval", desc: "Self-evaluate quality before saving patterns", category: "Learning" },
  { name: "/instinct-status", desc: "Show learned instincts with confidence scores", category: "Learning" },
  { name: "/evolve", desc: "Analyze instincts and suggest evolved structures", category: "Learning" },
  { name: "/promote", desc: "Promote project instincts to global scope", category: "Learning" },
  { name: "/skill-create", desc: "Extract coding patterns from git history into SKILL.md", category: "Learning" },
  { name: "/skill-health", desc: "Show skill portfolio health dashboard", category: "Learning" },
  // Tools
  { name: "/docs", desc: "Live documentation lookup via Context7", category: "Tools" },
  { name: "/prompt-optimize", desc: "Analyze and enrich a draft prompt (ECC-optimized)", category: "Tools" },
  { name: "/context-budget", desc: "Analyze context window usage for optimization", category: "Tools" },
  { name: "/loop-start", desc: "Start a recurring task loop", category: "Tools" },
  // Language-specific
  { name: "/go-review", desc: "Go: idiomatic patterns, concurrency safety, error handling", category: "Language" },
  { name: "/go-build", desc: "Go: fix build errors, vet warnings, linter issues", category: "Language" },
  { name: "/go-test", desc: "Go: TDD with table-driven tests, 80%+ coverage", category: "Language" },
  { name: "/rust-review", desc: "Rust: ownership, lifetimes, unsafe, idiomatic patterns", category: "Language" },
  { name: "/rust-build", desc: "Rust: fix borrow checker, dependency issues", category: "Language" },
  { name: "/rust-test", desc: "Rust: TDD with cargo-llvm-cov coverage", category: "Language" },
  { name: "/kotlin-review", desc: "Kotlin: null safety, coroutines, idiomatic patterns", category: "Language" },
  { name: "/kotlin-build", desc: "Kotlin: fix Gradle, compiler, dependency issues", category: "Language" },
  { name: "/python-review", desc: "Python: PEP 8, type hints, Pythonic idioms, security", category: "Language" },
  { name: "/cpp-review", desc: "C++: memory safety, modern idioms, concurrency", category: "Language" },
  { name: "/cpp-build", desc: "C++: fix CMake, linker, build errors", category: "Language" },
  { name: "/gradle-build", desc: "Fix Gradle build errors for Android and KMP", category: "Language" },
];

const agents: RefItem[] = [
  { name: "architect", desc: "Design system architecture with trade-off analysis", category: "Design" },
  { name: "planner", desc: "Create step-by-step implementation plans", category: "Design" },
  { name: "chief-of-staff", desc: "Coordinate multi-agent workflows", category: "Design" },
  { name: "code-reviewer", desc: "Multi-layer adversarial code review", category: "Quality" },
  { name: "security-reviewer", desc: "Vulnerability scanning and security analysis", category: "Quality" },
  { name: "database-reviewer", desc: "Query, schema, and data access review", category: "Quality" },
  { name: "tdd-guide", desc: "Guide test-driven development workflow", category: "Quality" },
  { name: "e2e-runner", desc: "Generate and run Playwright E2E tests", category: "Quality" },
  { name: "refactor-cleaner", desc: "Clean up code without changing behavior", category: "Maintenance" },
  { name: "doc-updater", desc: "Update documentation to match code changes", category: "Maintenance" },
  { name: "docs-lookup", desc: "Find and retrieve documentation", category: "Maintenance" },
  { name: "loop-operator", desc: "Manage recurring automation tasks", category: "Automation" },
  { name: "harness-optimizer", desc: "Optimize eval harness configuration", category: "Automation" },
  { name: "build-error-resolver", desc: "Generic build error resolution", category: "Build" },
  { name: "go-build-resolver", desc: "Go-specific build error fixing", category: "Build" },
  { name: "go-reviewer", desc: "Go code review for idiomatic patterns", category: "Build" },
  { name: "rust-build-resolver", desc: "Rust borrow checker and build fixes", category: "Build" },
  { name: "rust-reviewer", desc: "Rust ownership and safety review", category: "Build" },
  { name: "kotlin-build-resolver", desc: "Kotlin/Gradle build error fixing", category: "Build" },
  { name: "kotlin-reviewer", desc: "Kotlin idiomatic patterns and null safety", category: "Build" },
  { name: "cpp-build-resolver", desc: "C++ CMake and linker error fixing", category: "Build" },
  { name: "cpp-reviewer", desc: "C++ memory safety and modern idioms", category: "Build" },
  { name: "java-build-resolver", desc: "Java build and dependency fixing", category: "Build" },
  { name: "java-reviewer", desc: "Java Spring Boot patterns review", category: "Build" },
  { name: "python-reviewer", desc: "Python PEP 8 and type hint review", category: "Build" },
  { name: "typescript-reviewer", desc: "TypeScript type safety and patterns", category: "Build" },
  { name: "flutter-reviewer", desc: "Flutter widget and state review", category: "Build" },
  { name: "pytorch-build-resolver", desc: "PyTorch CUDA and dependency fixing", category: "Build" },
];

const mcps: RefItem[] = [
  { name: "github", desc: "PRs, issues, repos — full GitHub operations", category: "Core" },
  { name: "memory", desc: "Persistent context across sessions", category: "Core" },
  { name: "filesystem", desc: "File operations beyond sandbox", category: "Core" },
  { name: "sequential-thinking", desc: "Chain-of-thought reasoning", category: "Core" },
  { name: "vercel", desc: "Deploy, preview, manage environments", category: "Deploy" },
  { name: "railway", desc: "Backend service deployments", category: "Deploy" },
  { name: "cloudflare-workers-builds", desc: "Cloudflare Workers build management", category: "Deploy" },
  { name: "cloudflare-workers-bindings", desc: "Cloudflare Workers bindings config", category: "Deploy" },
  { name: "cloudflare-docs", desc: "Cloudflare documentation search", category: "Deploy" },
  { name: "cloudflare-observability", desc: "Cloudflare logs and observability", category: "Deploy" },
  { name: "supabase", desc: "Postgres + auth + realtime database", category: "Data" },
  { name: "clickhouse", desc: "Analytics queries on large datasets", category: "Data" },
  { name: "context7", desc: "Live documentation lookup for libraries", category: "Research" },
  { name: "exa-web-search", desc: "Web search and research via Exa API", category: "Research" },
  { name: "firecrawl", desc: "Web scraping and crawling", category: "Research" },
  { name: "confluence", desc: "Search and retrieve Confluence pages", category: "Research" },
  { name: "devfleet", desc: "Parallel agent dispatch in isolated worktrees", category: "AI" },
  { name: "browser-use", desc: "AI browser agent for web tasks", category: "AI" },
  { name: "browserbase", desc: "Cloud browser sessions via Browserbase", category: "AI" },
  { name: "fal-ai", desc: "Image/video/audio generation", category: "AI" },
  { name: "playwright", desc: "Browser automation and testing", category: "AI" },
  { name: "insaits", desc: "AI security monitoring — anomaly detection", category: "Security" },
  { name: "token-optimizer", desc: "95%+ context reduction via deduplication", category: "Utility" },
  { name: "magic", desc: "Magic UI components", category: "Utility" },
];

type Tab = "commands" | "agents" | "mcps";

export function ReferenceDrawer() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("commands");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
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
          d.desc.toLowerCase().includes(search.toLowerCase()) ||
          (d.category || "").toLowerCase().includes(search.toLowerCase())
      )
    : data;

  // Group by category
  const categories = [...new Set(filtered.map((d) => d.category || "Other"))];

  function handleCopy(name: string) {
    navigator.clipboard.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  }

  const tabs: { id: Tab; label: string; Icon: typeof TerminalSquare; count: number }[] = [
    { id: "commands", label: "Commands", Icon: TerminalSquare, count: commands.length },
    { id: "agents", label: "Agents", Icon: Bot, count: agents.length },
    { id: "mcps", label: "MCPs", Icon: Plug, count: mcps.length },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-text-muted text-xs hover:text-text hover:border-border-subtle transition-all duration-300 cursor-pointer"
        title="Quick Reference (⌘K)"
      >
        <Command className="w-3 h-3" />
        <span className="font-mono">K</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-bg/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-96 max-w-[90vw] bg-surface border-l border-border z-50 transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal={open}
        aria-label="Quick Reference"
      >
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

        <div className="flex-1 overflow-y-auto p-3">
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <p className="text-[9px] text-text-muted tracking-widest uppercase font-mono px-3 mb-1.5">
                {cat}
              </p>
              {filtered
                .filter((d) => (d.category || "Other") === cat)
                .map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-surface-hover transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-gold">{item.name}</p>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(item.name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 cursor-pointer text-text-muted hover:text-text"
                      title="Copy"
                    >
                      {copied === item.name ? (
                        <Check className="w-3 h-3 text-gold" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ))}
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
