import type { CharacterProfile } from "@/lib/types";
import { XPBar } from "./XPBar";

interface Props {
  profile: CharacterProfile;
}

export function CharacterCard({ profile }: Props) {
  const unlockedBadges = profile.badges.filter((b) => b.unlocked);

  return (
    <div className="bg-surface rounded-xl border border-border p-6 glow-accent">
      <div className="flex items-start gap-5">
        <div className="w-20 h-20 rounded-xl bg-accent/20 border-2 border-accent flex items-center justify-center text-3xl shrink-0">
          ⚔️
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold truncate">{profile.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-glow whitespace-nowrap">
              Lv. {profile.level}
            </span>
          </div>
          <p className="text-sm text-text-muted mb-1">{profile.title}</p>
          <p className="text-xs text-accent-glow font-medium mb-3">
            {profile.rank}
          </p>
          <XPBar
            current={profile.totalXp}
            max={profile.totalXp + profile.xpToNextLevel}
            label={`${profile.xpToNextLevel} XP to next level`}
          />
        </div>
      </div>
      {unlockedBadges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-text-muted mb-2">Badges</p>
          <div className="flex gap-2 flex-wrap">
            {unlockedBadges.map((badge) => (
              <span
                key={badge.id}
                className="text-xs px-2 py-1 rounded-md bg-xp/10 text-xp border border-xp/20"
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
