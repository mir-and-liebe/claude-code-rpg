import type { Badge } from "@/lib/types";

interface Props {
  badges: Badge[];
}

export function BadgeGrid({ badges }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`rounded-xl border p-4 text-center transition-all ${
            badge.unlocked
              ? "border-xp/50 bg-xp/5 glow-xp"
              : "border-border bg-surface opacity-40 grayscale"
          }`}
        >
          <div className="text-2xl mb-2">
            {badge.unlocked ? "🏆" : "🔒"}
          </div>
          <p className="text-xs font-bold mb-0.5">{badge.name}</p>
          <p className="text-[10px] text-text-muted">{badge.description}</p>
        </div>
      ))}
    </div>
  );
}
