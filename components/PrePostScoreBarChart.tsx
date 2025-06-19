"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { createClient } from "@/utils/supabase/client";

export default function PrePostScoreBarChart() {
  const [data, setData] = useState<{ age: string; PreTest: number; PostTest: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      const supabase = createClient();
      // Fetch all students with their age and latest pre/post test scores
      const { data: students, error } = await supabase
        .from("students")
        .select("age, latest_pretest_score, latest_posttest_score");
      if (error || !students) {
        setData([]);
        setLoading(false);
        return;
      }

      // Group by age and calculate average pre/post test scores
      const ageGroups = [3, 4, 5, 6];
      const result: { age: string; PreTest: number; PostTest: number }[] = [];

      ageGroups.forEach((age) => {
        const group = students.filter((s) => s.age === age);
        const preScores = group
          .map((s) => typeof s.latest_pretest_score === "number" ? s.latest_pretest_score : null)
          .filter((v) => v !== null) as number[];
        const postScores = group
          .map((s) => typeof s.latest_posttest_score === "number" ? s.latest_posttest_score : null)
          .filter((v) => v !== null) as number[];
        const preAvg = preScores.length ? preScores.reduce((a, b) => a + b, 0) / preScores.length : 0;
        const postAvg = postScores.length ? postScores.reduce((a, b) => a + b, 0) / postScores.length : 0;
        result.push({
          age: `${age}`,
          PreTest: Number(preAvg.toFixed(2)),
          PostTest: Number(postAvg.toFixed(2)),
        });
      });

      setData(result);
      setLoading(false);
    };
    fetchScores();
  }, []);

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 16, right: 16, left: 16, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="age" label={{ value: "Age Group", position: "insideBottom", offset: -2 }} />
        <YAxis domain={[0, 10]} label={{ value: "Score (n/10)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="PreTest" fill="#8884d8" name="Pre-test" />
        <Bar dataKey="PostTest" fill="#82ca9d" name="Post-test" />
      </BarChart>
    </ResponsiveContainer>
  );
}
