import { Lock, Trophy } from "lucide-react";
import type { Badge } from "@/lib/types";
import { badgeIconMap } from "@/lib/icons";

interface Props {
  badges: Badge[];
}

const tierColors = {
  none: "border-border bg-surface opacity-30",
  bronze: "border-amber-700/30 bg-amber-900/5",
  silver: "border-zinc-400/30 bg-zinc-400/5",
  gold: "border-gold/30 bg-gold/[0.05]",
};

const tierLabels = {
  none: "",
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

export function BadgeGrid({ badges }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {badges.map((badge) => {
        const Icon = badgeIconMap[badge.icon] || Trophy;
        const tier = badge.currentTier;
        const activeTier = badge.tiers.find((t) => t.tier === tier);
        const displayName = activeTier?.name || badge.tiers[0].name;
        const displayDesc = activeTier?.description || badge.tiers[0].description;

        return (
          <div
            key={badge.id}
            className={`rounded-xl border p-4 text-center transition-all duration-300 ${tierColors[tier]}`}
          >
            <div className="flex justify-center mb-2.5">
              {tier !== "none" ? (
                <Icon
                  className={`w-5 h-5 ${
                    tier === "gold"
                      ? "text-gold"
                      : tier === "silver"
                        ? "text-zinc-400"
                        : "text-amber-700"
                  }`}
                />
              ) : (
                <Lock className="w-5 h-5 text-text-muted" />
              )}
            </div>
            <p className="text-xs font-semibold mb-0.5">{displayName}</p>
            <p className="text-[11px] text-text-muted leading-relaxed">
              {displayDesc}
            </p>
            {tier !== "none" && (
              <p
                className={`text-[9px] mt-1.5 font-mono tracking-wider uppercase ${
                  tier === "gold"
                    ? "text-gold"
                    : tier === "silver"
                      ? "text-zinc-400"
                      : "text-amber-700"
                }`}
              >
                {tierLabels[tier]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
