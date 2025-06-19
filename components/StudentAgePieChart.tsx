"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { createClient } from "@/utils/supabase/client";

const COLORS = ["#FFBB28", "#FF8042", "#00C49F", "#0088FE"];

export default function StudentAgePieChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAges = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data: students, error } = await supabase
        .from("students")
        .select("age");
      if (error) {
        setData([]);
        setLoading(false);
        return;
      }
      // Count students by age (3-6)
      const ageCounts: Record<number, number> = { 3: 0, 4: 0, 5: 0, 6: 0 };
      students?.forEach((s) => {
        if (s.age >= 3 && s.age <= 6) ageCounts[s.age]++;
      });
      setData(
        Object.entries(ageCounts).map(([age, count]) => ({
          name: `${age} years old`,
          value: count,
        }))
      );
      setLoading(false);
    };
    fetchAges();
  }, []);

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
