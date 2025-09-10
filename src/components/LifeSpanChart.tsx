"use client";

import React from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface LifeSpanPoint {
  index: number;
  name: string;
  avg: number;
  range: string;
  color: string;
}

interface LifeSpanChartProps {
  data: LifeSpanPoint[];
}

interface DotProps {
  cx?: number;
  cy?: number;
  payload?: LifeSpanPoint;
}

const CustomDot: React.FC<DotProps> = ({ cx, cy, payload }) => {
  if (typeof cx !== "number" || typeof cy !== "number" || !payload) return null;
  return <circle cx={cx} cy={cy} r={5} fill={payload.color} />;
};

interface TooltipProps {
  active?: boolean;
  payload?: { payload: LifeSpanPoint }[];
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-white shadow rounded px-2 py-1 text-sm">
      {`${point.name}: ${point.range}`}
    </div>
  );
};

export default function LifeSpanChart({ data }: LifeSpanChartProps) {
  return (
    <div className="w-full h-96 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Breed Lifespans</h2>

      <ResponsiveContainer width="100%" height="90%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="index" tick={false} />
          <YAxis
            type="number"
            dataKey="avg"
            name="Average Lifespan"
            unit=" yrs"
            domain={[0, "dataMax + 2"]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} shape={<CustomDot />} />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-400"></span> Low Life span
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Intermediate Life span
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-400"></span> High Life span
        </div>
      </div>
    </div>
  );
}
