"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 19 },
  { name: "Wed", value: 8 },
  { name: "Thu", value: 15 },
  { name: "Fri", value: 10 },
  { name: "Sat", value: 7 },
  { name: "Sun", value: 14 },
];

export default function LineChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
        <XAxis dataKey="name" fontSize={12} tick={{ fill: "#6b7280" }} />
        <YAxis fontSize={12} tick={{ fill: "#6b7280" }} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
