import { Package } from "lucide-react";
import type { CollectionSet, Badge } from "@/lib/types";

interface Props {
  collection: CollectionSet;
  badges: Badge[];
}

export function CollectionCard({ collection, badges }: Props) {
  const earned = collection.badges.filter((bid) => {
    const badge = badges.find((b) => b.id === bid);
    return badge && badge.currentTier !== "none";
  }).length;
  const total = collection.badges.length;
  const complete = earned === total;

  return (
    <div
      className={`card p-4 ${complete ? "border-gold/20 bg-gold/[0.02]" : ""}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Package
          className={`w-4 h-4 ${complete ? "text-gold" : "text-text-muted"}`}
        />
        <h4 className="text-sm font-semibold">{collection.name}</h4>
        <span className="text-[10px] text-text-muted ml-auto font-mono">
          {earned}/{total}
        </span>
      </div>
      <p className="text-[11px] text-text-muted mb-2">
        {(collection as CollectionSet & { description?: string }).description ||
          ""}
      </p>
      {complete && (
        <p className="text-[11px] text-gold font-mono">
          +{collection.bonusXp} bonus XP
        </p>
      )}
    </div>
  );
}
