"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { date: string; xp: number }[];
}

type Range = "7d" | "30d" | "all";

export function XPChart({ data }: Props) {
  const [range, setRange] = useState<Range>("all");

  if (data.length < 2) {
    return (
      <div className="card p-5">
        <h2 className="text-xl mb-3">XP Over Time</h2>
        <p className="text-sm text-text-muted py-6 text-center">
          Complete your second session to see your progress chart
        </p>
      </div>
    );
  }

  const now = new Date();
  const filtered =
    range === "all"
      ? data
      : data.filter((d) => {
          const date = new Date(d.date);
          const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
          return diff <= (range === "7d" ? 7 : 30);
        });

  const displayData = filtered.length >= 2 ? filtered : data;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">XP Over Time</h2>
        <div className="flex gap-1">
          {(["7d", "30d", "all"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer font-mono ${
                range === r
                  ? "bg-gold/10 border-gold/20 text-gold"
                  : "border-border text-text-muted hover:text-text"
              }`}
            >
              {r === "all" ? "All" : r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData}>
            <XAxis
              dataKey="date"
              tick={{ fill: "#8C8C9E", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#27272A" }}
            />
            <YAxis
              tick={{ fill: "#8C8C9E", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#27272A" }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#18181B",
                border: "1px solid #27272A",
                borderRadius: 8,
                fontSize: 12,
                color: "#FAFAFA",
              }}
            />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="#CA8A04"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#CA8A04" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
