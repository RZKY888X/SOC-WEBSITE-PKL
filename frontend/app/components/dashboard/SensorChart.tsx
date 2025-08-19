"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { SensorData } from "../../lib/types";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#FF6384"];

interface SensorChartProps {
  title: string;
  data: SensorData[];
}

export default function SensorChart({ title, data }: SensorChartProps) {
  return (
    <div className='text-center'>
      <ResponsiveContainer width='100%' height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            nameKey='name'
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props) => {
              const index = (props as { dataIndex?: number })?.dataIndex;
              const unit =
                typeof index === "number" ? data[index]?.unit || "" : "";
              return [`${value}${unit}`, name];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <p className='mt-2 font-bold text-sm'>{title}</p>
    </div>
  );
}
