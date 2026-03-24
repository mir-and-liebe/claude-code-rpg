interface Props {
  current: number;
  max: number;
  label?: string;
  color?: string;
}

export function XPBar({ current, max, label, color }: Props) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-[10px] text-text-muted mb-1">
        <span>
          {current.toLocaleString()} / {max.toLocaleString()} XP
        </span>
        {label && <span>{label}</span>}
      </div>
      <div className="h-2.5 bg-bg rounded-full overflow-hidden border border-border">
        <div
          className="h-full rounded-full xp-bar-fill"
          style={{
            width: `${percentage}%`,
            ...(color
              ? { background: `linear-gradient(90deg, ${color}, ${color}88)` }
              : {}),
          }}
        />
      </div>
    </div>
  );
}
