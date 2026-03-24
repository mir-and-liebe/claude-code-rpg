"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import bestpracticesData from "@/data/bestpractices.json";
import type { BestPractice } from "@/lib/types";
import { BestPracticeCard } from "@/components/BestPracticeCard";

export default function BestPracticesPage() {
  const practices = bestpracticesData as BestPractice[];
  const categories = [...new Set(practices.map((p) => p.category))];
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = practices.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.what.toLowerCase().includes(search.toLowerCase()) ||
      p.why.toLowerCase().includes(search.toLowerCase()) ||
      p.relatedTools.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !activeCategory || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCategories = [...new Set(filtered.map((p) => p.category))];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl">Best Practices</h1>
        <p className="text-sm text-text-muted mt-1">
          Every best practice from your Claude Code setup, explained with
          what it does and why it matters.
        </p>
      </div>

      {/* Search + Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search practices, tools, concepts..."
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-gold/30 focus:outline-none transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-[11px] px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              !activeCategory
                ? "bg-gold/10 border-gold/20 text-gold"
                : "border-border text-text-muted hover:text-text"
            }`}
          >
            All ({practices.length})
          </button>
          {categories.map((cat) => {
            const count = practices.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={`text-[11px] px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gold/10 border-gold/20 text-gold"
                    : "border-border text-text-muted hover:text-text"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {filteredCategories.map((category) => (
        <div key={category}>
          <h2 className="text-xl mb-3">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered
              .filter((p) => p.category === category)
              .map((practice) => (
                <BestPracticeCard key={practice.id} practice={practice} />
              ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-sm text-text-muted text-center py-12">
          No practices match &ldquo;{search}&rdquo;
        </p>
      )}
    </div>
  );
}
