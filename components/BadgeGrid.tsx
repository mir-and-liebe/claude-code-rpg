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
            className={`rounded-xl border p-4 text-center transition-all duration-300 ${
              badge.unlocked
                ? "border-gold/20 bg-gold/[0.03] badge-unlocked"
                : "border-border bg-surface opacity-30"
            }`}
          >
            <div className="flex justify-center mb-2.5">
              {badge.unlocked ? (
                <Icon className="w-5 h-5 text-gold" />
              ) : (
                <Lock className="w-5 h-5 text-text-muted" />
              )}
            </div>
            <p className="text-xs font-semibold mb-0.5">{badge.name}</p>
            <p className="text-[11px] text-text-muted leading-relaxed">
              {badge.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
