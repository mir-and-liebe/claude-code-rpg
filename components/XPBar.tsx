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
      <div className="flex justify-between text-[11px] text-text-muted mb-1.5 font-mono">
        <span>
          {current.toLocaleString()} / {max.toLocaleString()} XP
        </span>
        {label && <span className="text-text-secondary">{label}</span>}
      </div>
      <div className="h-1.5 bg-bg rounded-full overflow-hidden">
        <div
          className="h-full rounded-full xp-bar-fill"
          style={{
            width: `${percentage}%`,
            ...(color
              ? {
                  background: `linear-gradient(90deg, ${color}60, ${color})`,
                }
              : {}),
          }}
        />
      </div>
    </div>
  );
}
