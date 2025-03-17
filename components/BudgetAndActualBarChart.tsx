"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BudgetAndActualBarChart = ({
  data,
}: {
  data: { category: string; budget: number; actual: number }[];
}) => {
  return (
    <BarChart width={500} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="category" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="budget" fill="#8884d8" />
      <Bar dataKey="actual" fill="#82ca9d" />
    </BarChart>
  );
};

export default BudgetAndActualBarChart;
