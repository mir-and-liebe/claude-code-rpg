import { Flame } from "lucide-react";

interface Props {
  current: number;
  best: number;
}

export function StreakBadge({ current, best }: Props) {
  if (current === 0 && best === 0) return null;

  const size = current >= 7 ? "w-5 h-5" : current >= 3 ? "w-4 h-4" : "w-3.5 h-3.5";
  const label =
    current >= 7
      ? "On fire!"
      : current >= 3
        ? `${current} day streak`
        : current >= 1
          ? `${current} day streak`
          : `Best: ${best} days`;

  return (
    <div className="flex items-center gap-1.5">
      <Flame
        className={`${size} ${current >= 1 ? "text-fire" : "text-text-muted"}`}
      />
      <span
        className={`text-[11px] font-mono ${current >= 1 ? "text-fire" : "text-text-muted"}`}
      >
        {label}
      </span>
    </div>
  );
}
