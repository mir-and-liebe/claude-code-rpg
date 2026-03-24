import { Lock, Trophy } from "lucide-react";
import type { Badge } from "@/lib/types";
import { badgeIconMap } from "@/lib/icons";

interface Props {
  badges: Badge[];
}

export function BadgeGrid({ badges }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {badges.map((badge) => {
        const Icon = badgeIconMap[badge.icon] || Trophy;
        return (
          <div
            key={badge.id}
            className={`rounded-xl border p-4 text-center transition-all duration-200 ${
              badge.unlocked
                ? "border-xp/30 bg-xp/5 glow-xp"
                : "border-border bg-surface opacity-40 grayscale"
            }`}
          >
            <div className="flex justify-center mb-2">
              {badge.unlocked ? (
                <Icon className="w-6 h-6 text-xp" />
              ) : (
                <Lock className="w-6 h-6 text-text-muted" />
              )}
            </div>
            <p className="text-xs font-bold font-mono mb-0.5">{badge.name}</p>
            <p className="text-[10px] text-text-muted">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
}
