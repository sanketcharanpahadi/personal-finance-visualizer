"use client";
import React from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const CategoryTotalPieChart = ({
  categoryData,
}: {
  categoryData: { name: string | null; color: string; total: number }[];
}) => {
  const formattedData = categoryData.map((item) => ({
    name: item.name || "Uncategorized",
    value: item.total,
    color: item.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `₹${value}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryTotalPieChart;
