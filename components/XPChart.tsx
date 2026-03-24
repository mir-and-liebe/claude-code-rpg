"use client";

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

export function XPChart({ data }: Props) {
  if (data.length < 2) return null;

  return (
    <div className="card p-5">
      <h2 className="text-xl mb-4">XP Over Time</h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tick={{ fill: "#71717A", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#27272A" }}
            />
            <YAxis
              tick={{ fill: "#71717A", fontSize: 10 }}
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
