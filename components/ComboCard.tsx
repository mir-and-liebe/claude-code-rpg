import { Zap } from "lucide-react";
import type { SkillCombo } from "@/lib/types";

interface Props {
  combos: SkillCombo[];
}

export function ComboCard({ combos }: Props) {
  if (combos.length === 0) return null;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-gold" />
        <h3 className="text-[10px] text-gold tracking-widest uppercase font-mono">
          Discovered Combos
        </h3>
        <span className="text-[11px] text-text-muted ml-auto font-mono">
          {combos.length} found
        </span>
      </div>
      <div className="space-y-2">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-gold/[0.03] border border-gold/10"
          >
            <div>
              <p className="text-sm font-semibold">{combo.name}</p>
              <p className="text-[11px] text-text-muted">{combo.description}</p>
            </div>
            <span className="text-xs text-gold font-mono whitespace-nowrap ml-3">
              +{combo.bonusXp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
