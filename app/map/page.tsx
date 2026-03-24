"use client";

import { useProgress } from "@/lib/use-progress";
import { isSkillRevealed } from "@/lib/rpg";
import type { SkillTree } from "@/lib/types";
import skillTreesData from "@/data/skills.json";
import combosData from "@/data/combos.json";
import { treeIconMap } from "@/lib/icons";
import { SkeletonDashboard } from "@/components/Skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ComboData {
  id: string;
  name: string;
  skills: string[];
  bonusXp: number;
  description: string;
}

const TREE_X: Record<string, number> = {
  "prompt-architect": 80,
  "cli-dominance": 240,
  "mcp-mastery": 400,
  "agent-craft": 560,
  "product-shipper": 720,
  "code-comprehension": 880,
};

export default function MapPage() {
  const { completedSkills, loading } = useProgress();
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{
    name: string;
    tree: string;
    x: number;
    y: number;
  } | null>(null);

  if (loading) return <SkeletonDashboard />;

  const trees = (skillTreesData as SkillTree[]).map((t) => ({
    ...t,
    nodes: t.nodes.map((n) => ({ ...n, completed: completedSkills.has(n.id) })),
  }));

  const combos = combosData as ComboData[];

  // Node positions
  const nodePositions: Record<string, { x: number; y: number }> = {};
  trees.forEach((tree) => {
    const baseX = TREE_X[tree.id] || 0;
    tree.nodes.forEach((node, i) => {
      nodePositions[node.id] = { x: baseX, y: 80 + i * 90 };
    });
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl">Knowledge Map</h1>
        <p className="text-sm text-text-muted mt-1">
          Your vibecoding landscape. Click a node to explore.
        </p>
      </div>

      <div className="card p-4 overflow-x-auto">
        <svg
          viewBox="0 0 960 560"
          className="w-full min-w-[800px]"
          style={{ height: "500px" }}
        >
          {/* Tree labels */}
          {trees.map((tree) => {
            const x = TREE_X[tree.id];
            const Icon = treeIconMap[tree.icon];
            return (
              <g key={tree.id}>
                <text
                  x={x}
                  y={40}
                  textAnchor="middle"
                  className="fill-text-muted"
                  style={{ fontSize: 11, fontFamily: "Inter, sans-serif" }}
                >
                  {tree.name}
                </text>
              </g>
            );
          })}

          {/* Tree connections (vertical lines) */}
          {trees.map((tree) =>
            tree.nodes.slice(0, -1).map((node, i) => {
              const from = nodePositions[node.id];
              const to = nodePositions[tree.nodes[i + 1].id];
              return (
                <line
                  key={`${node.id}-line`}
                  x1={from.x}
                  y1={from.y + 16}
                  x2={to.x}
                  y2={to.y - 16}
                  stroke={tree.color}
                  strokeWidth={1.5}
                  strokeOpacity={0.2}
                />
              );
            })
          )}

          {/* Combo connections — always show (faint when incomplete) */}
          {combos.map((combo) => {
            const p1 = nodePositions[combo.skills[0]];
            const p2 = nodePositions[combo.skills[1]];
            if (!p1 || !p2) return null;
            const bothComplete =
              completedSkills.has(combo.skills[0]) &&
              completedSkills.has(combo.skills[1]);
            return (
              <g
                key={combo.id}
                onMouseEnter={() =>
                  setTooltip({ name: `${combo.name} (+${combo.bonusXp} XP)`, tree: "Combo", x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 })
                }
                onMouseLeave={() => setTooltip(null)}
                className="cursor-pointer"
              >
                <line
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={bothComplete ? "#CA8A04" : "#3F3F46"}
                  strokeWidth={bothComplete ? 1.5 : 1}
                  strokeDasharray="6 4"
                  strokeOpacity={bothComplete ? 0.6 : 0.12}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {trees.map((tree) =>
            tree.nodes.map((node) => {
              const pos = nodePositions[node.id];
              const revealed = isSkillRevealed(node, tree, completedSkills);

              if (!revealed) {
                return (
                  <g key={node.id}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={12}
                      fill="#18181B"
                      stroke="#27272A"
                      strokeWidth={1.5}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-text-muted"
                      style={{ fontSize: 8, fontFamily: "monospace" }}
                    >
                      ?
                    </text>
                  </g>
                );
              }

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/skills/${tree.id}`)}
                  onMouseEnter={() =>
                    setTooltip({ name: node.name, tree: tree.name, x: pos.x, y: pos.y })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  onTouchStart={() =>
                    setTooltip((prev) =>
                      prev?.name === node.name ? null : { name: node.name, tree: tree.name, x: pos.x, y: pos.y }
                    )
                  }
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={node.completed ? 16 : 13}
                    fill={node.completed ? `${tree.color}20` : "#18181B"}
                    stroke={node.completed ? tree.color : "#3F3F46"}
                    strokeWidth={node.completed ? 2 : 1.5}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={node.completed ? tree.color : "#71717A"}
                    style={{ fontSize: 9, fontWeight: 600, fontFamily: "monospace" }}
                  >
                    {node.completed ? "✓" : node.level}
                  </text>
                </g>
              );
            })
          )}

          {/* Tooltip */}
          {tooltip && (
            <g>
              <rect
                x={tooltip.x - 60}
                y={tooltip.y - 40}
                width={120}
                height={28}
                rx={6}
                fill="#18181B"
                stroke="#3F3F46"
                strokeWidth={1}
              />
              <text
                x={tooltip.x}
                y={tooltip.y - 29}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-text"
                style={{ fontSize: 10, fontFamily: "Inter, sans-serif" }}
              >
                {tooltip.name}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {trees.map((tree) => (
          <Link
            key={tree.id}
            href={`/skills/${tree.id}`}
            className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text transition-colors"
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: tree.color }}
            />
            {tree.name}
          </Link>
        ))}
        <span className="flex items-center gap-1.5 text-[11px] text-text-muted">
          <div className="w-6 border-t border-dashed border-gold/40" />
          Combo link
        </span>
      </div>
    </div>
  );
}
