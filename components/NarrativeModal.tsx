"use client";

import { useEffect, useState } from "react";
import { X, Scroll } from "lucide-react";
import { useProgress } from "@/lib/use-progress";
import { getCurrentChapter } from "@/lib/rpg";
import narrativeData from "@/data/narrative.json";
import type { NarrativeChapter } from "@/lib/types";

export function NarrativeModal() {
  const { completedSkills, progress, markChapterSeen } = useProgress();
  const [chapter, setChapter] = useState<NarrativeChapter | null>(null);

  useEffect(() => {
    if (!progress) return;
    const currentId = getCurrentChapter(completedSkills.size, 30);
    if (!currentId) return;
    if (progress.last_seen_chapter === currentId) return;

    const ch = (narrativeData as NarrativeChapter[]).find(
      (c) => c.id === currentId
    );
    if (ch) setChapter(ch);
  }, [completedSkills.size, progress]);

  if (!chapter) return null;

  function dismiss() {
    if (chapter) markChapterSeen(chapter.id);
    setChapter(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm">
      <div className="max-w-lg w-full mx-4 card p-8 relative">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <Scroll className="w-5 h-5 text-gold" />
          <p className="text-[10px] text-gold tracking-widest uppercase font-mono">
            New Chapter Unlocked
          </p>
        </div>
        <h2 className="text-2xl mb-4">{chapter.title}</h2>
        <p className="text-[14px] text-text-secondary leading-relaxed">
          {chapter.text}
        </p>
        <button
          onClick={dismiss}
          className="mt-6 w-full py-2.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm hover:bg-gold/15 transition-colors cursor-pointer"
        >
          Continue your quest
        </button>
      </div>
    </div>
  );
}
