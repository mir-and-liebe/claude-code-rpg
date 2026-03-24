"use client";

import { useState, useRef, useEffect } from "react";
import { TerminalSquare, ArrowRight } from "lucide-react";
import commandResponses from "@/data/command-responses.json";
import skillTreesData from "@/data/skills.json";
import type { SkillTree } from "@/lib/types";
import Link from "next/link";

const skillToTree: Record<string, string> = {};
for (const tree of skillTreesData as SkillTree[]) {
  for (const node of tree.nodes) {
    skillToTree[node.id] = tree.id;
  }
}

type Responses = Record<string, { output: string; relatedSkill: string }>;
const responses = commandResponses as Responses;
const allCommands = Object.keys(responses);

interface HistoryEntry {
  input: string;
  output: string;
  relatedSkill?: string;
}

export default function PlaygroundPage() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [triedCommands, setTriedCommands] = useState<Set<string>>(new Set());
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  function handleSubmit() {
    const cmd = input.trim();
    if (!cmd) return;

    setCmdHistory((prev) => [cmd, ...prev]);
    setHistoryIdx(-1);

    const response = responses[cmd];
    if (response) {
      setHistory((prev) => [
        ...prev,
        { input: cmd, output: response.output, relatedSkill: response.relatedSkill },
      ]);
      setTriedCommands((prev) => new Set(prev).add(cmd));
    } else {
      const closest = allCommands.find((c) => c.startsWith(cmd));
      setHistory((prev) => [
        ...prev,
        {
          input: cmd,
          output: closest
            ? `Unknown command. Did you mean ${closest}?`
            : `Unknown command: ${cmd}\nType a slash command like /plan, /tdd, or /docs`,
        },
      ]);
    }
    setInput("");
    setSuggestions([]);
  }

  function handleInputChange(val: string) {
    setInput(val);
    if (val.startsWith("/") && val.length > 1) {
      const matches = allCommands.filter((c) =>
        c.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const idx = Math.min(historyIdx + 1, cmdHistory.length - 1);
        setHistoryIdx(idx);
        setInput(cmdHistory[idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const idx = historyIdx - 1;
        setHistoryIdx(idx);
        setInput(cmdHistory[idx]);
      } else {
        setHistoryIdx(-1);
        setInput("");
      }
    } else if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      setInput(suggestions[0]);
      setSuggestions([]);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl">Playground</h1>
        <p className="text-sm text-text-muted mt-1">
          Explore Claude Code commands in a simulated terminal. Type any command to see how it works.
        </p>
      </div>

      <div className="card overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-bg">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-fire/50" />
            <div className="w-3 h-3 rounded-full bg-xp/50" />
            <div className="w-3 h-3 rounded-full bg-health/50" />
          </div>
          <span className="text-[11px] text-text-muted font-mono ml-2">
            claude-code-playground
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          className="h-[400px] overflow-y-auto p-4 space-y-4 bg-bg font-mono text-sm"
        >
          {/* Welcome message */}
          {history.length === 0 && (
            <div className="text-text-muted">
              <p>Welcome to the Claude Code Playground.</p>
              <p className="mt-1 mb-3">
                Type a slash command or click one to try it:
              </p>
              <div className="flex flex-wrap gap-2">
                {["/plan", "/tdd", "/devfleet", "/docs", "/code-review", "/instinct-status"].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      const response = responses[cmd];
                      if (response) {
                        setHistory((prev) => [...prev, { input: cmd, output: response.output, relatedSkill: response.relatedSkill }]);
                        setCmdHistory((prev) => [cmd, ...prev]);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-surface-hover border border-border text-gold text-[12px] font-mono hover:border-gold/20 transition-colors cursor-pointer"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {history.map((entry, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 text-gold">
                <span className="text-text-muted">❯</span>
                {entry.input}
              </div>
              <pre className="mt-1.5 text-text-secondary whitespace-pre-wrap leading-relaxed">
                {entry.output}
              </pre>
              {entry.relatedSkill && (
                <Link
                  href={`/skills/${skillToTree[entry.relatedSkill] || "prompt-architect"}`}
                  className="inline-flex items-center gap-1 mt-2 text-[11px] text-gold/60 hover:text-gold transition-colors"
                >
                  <ArrowRight className="w-3 h-3" />
                  Related skill tree
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="relative border-t border-border bg-bg">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 bg-surface border border-border rounded-t-lg overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); setSuggestions([]); inputRef.current?.focus(); }}
                  className="w-full text-left px-4 py-2 text-sm font-mono text-text-secondary hover:bg-surface-hover cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center px-4 py-3">
            <span className="text-gold mr-2 font-mono">❯</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a slash command..."
              className="flex-1 bg-transparent text-text font-mono text-sm outline-none placeholder:text-text-muted"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 text-[11px] text-text-muted">
        <span className="flex items-center gap-1">
          <TerminalSquare className="w-3 h-3" />
          {triedCommands.size}/{allCommands.length} tried
        </span>
        <span>&middot;</span>
        <span>Tab to autocomplete</span>
        <span>&middot;</span>
        <span>↑↓ history</span>
      </div>
    </div>
  );
}
