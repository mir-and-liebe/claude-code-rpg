import { Swords, Shield } from "lucide-react";
import type { CharacterProfile } from "@/lib/types";
import { XPBar } from "./XPBar";

interface Props {
  profile: CharacterProfile;
}

export function CharacterCard({ profile }: Props) {
  const earnedBadges = profile.badges.filter((b) => b.currentTier !== "none");

  return (
    <div className="card p-6">
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-xl bg-gold/5 border border-gold/20 flex items-center justify-center shrink-0">
          <Swords className="w-8 h-8 text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="text-2xl tracking-tight">{profile.name}</h2>
            <span className="text-xs text-gold font-mono">
              Lv. {profile.level}
            </span>
          </div>
          <p className="text-sm text-text-secondary mb-1">{profile.title}</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-gold/60" />
              <p className="text-xs text-gold tracking-wide">{profile.rank}</p>
            </div>
            {profile.characterClass && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-hover text-text-muted font-mono capitalize">
                {profile.characterClass}
              </span>
            )}
          </div>
          <XPBar
            current={profile.totalXp}
            max={profile.totalXp + profile.xpToNextLevel}
            label={`${profile.xpToNextLevel} XP to next level`}
          />
        </div>
      </div>
      {earnedBadges.length > 0 && (
        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-[10px] text-text-muted tracking-widest uppercase mb-3">
            Badges
          </p>
          <div className="flex gap-2 flex-wrap">
            {earnedBadges.map((badge) => {
              const tier = badge.tiers.find((t) => t.tier === badge.currentTier);
              const tierColor =
                badge.currentTier === "gold"
                  ? "bg-gold/5 text-gold border-gold/15"
                  : badge.currentTier === "silver"
                    ? "bg-zinc-400/5 text-zinc-400 border-zinc-400/15"
                    : "bg-amber-700/5 text-amber-700 border-amber-700/15";
              return (
                <span
                  key={badge.id}
                  className={`text-xs px-2.5 py-1 rounded-md border cursor-default ${tierColor}`}
                  title={tier?.description}
                >
                  {tier?.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
