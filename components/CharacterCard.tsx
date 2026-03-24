import { Swords, Shield } from "lucide-react";
import type { CharacterProfile } from "@/lib/types";
import { XPBar } from "./XPBar";

interface Props {
  profile: CharacterProfile;
}

export function CharacterCard({ profile }: Props) {
  const unlockedBadges = profile.badges.filter((b) => b.unlocked);

  return (
    <div className="bg-surface rounded-xl border border-accent/20 p-6 glow-accent relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="flex items-start gap-5 relative">
        <div className="w-20 h-20 rounded-xl bg-accent/10 border-2 border-accent/40 flex items-center justify-center shrink-0">
          <Swords className="w-9 h-9 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold truncate neon-text-green">
              {profile.name}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-mono whitespace-nowrap">
              Lv. {profile.level}
            </span>
          </div>
          <p className="text-sm text-text-muted mb-1">{profile.title}</p>
          <div className="flex items-center gap-1.5 mb-3">
            <Shield className="w-3 h-3 text-accent-glow" />
            <p className="text-xs text-accent-glow font-medium font-mono">
              {profile.rank}
            </p>
          </div>
          <XPBar
            current={profile.totalXp}
            max={profile.totalXp + profile.xpToNextLevel}
            label={`${profile.xpToNextLevel} XP to next level`}
          />
        </div>
      </div>
      {unlockedBadges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border relative">
          <p className="text-xs text-text-muted mb-2 font-mono">Badges</p>
          <div className="flex gap-2 flex-wrap">
            {unlockedBadges.map((badge) => (
              <span
                key={badge.id}
                className="text-xs px-2 py-1 rounded-md bg-xp/10 text-xp border border-xp/20 font-mono cursor-default"
                title={badge.description}
              >
                {badge.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
