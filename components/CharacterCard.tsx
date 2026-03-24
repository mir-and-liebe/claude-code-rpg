import { Swords, Shield } from "lucide-react";
import type { CharacterProfile } from "@/lib/types";
import { XPBar } from "./XPBar";

interface Props {
  profile: CharacterProfile;
}

export function CharacterCard({ profile }: Props) {
  const unlockedBadges = profile.badges.filter((b) => b.unlocked);

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
          <div className="flex items-center gap-1.5 mb-4">
            <Shield className="w-3 h-3 text-gold/60" />
            <p className="text-xs text-gold tracking-wide">{profile.rank}</p>
          </div>
          <XPBar
            current={profile.totalXp}
            max={profile.totalXp + profile.xpToNextLevel}
            label={`${profile.xpToNextLevel} XP to next level`}
          />
        </div>
      </div>
      {unlockedBadges.length > 0 && (
        <div className="mt-5 pt-5 border-t border-border">
          <p className="text-[10px] text-text-muted tracking-widest uppercase mb-3">
            Badges
          </p>
          <div className="flex gap-2 flex-wrap">
            {unlockedBadges.map((badge) => (
              <span
                key={badge.id}
                className="text-xs px-2.5 py-1 rounded-md bg-gold/5 text-gold border border-gold/15 cursor-default"
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
