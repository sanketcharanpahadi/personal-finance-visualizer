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

const MonthlyTotalBarChart = ({
  data,
}: {
  data: { month: string; total: number }[];
}) => {
  return (
    <BarChart width={500} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="total" fill="#8884d8" />
    </BarChart>
  );
};

export default MonthlyTotalBarChart;
