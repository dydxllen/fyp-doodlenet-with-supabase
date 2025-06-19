import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js"; 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Student = {
  latest_posttest_score: any;
  latest_pretest_score: any;
  id: string;
  pre_test_score: number | null;
  post_test_score: number | null;
};

const getCardColor = (score: number): string => {
  if (score >= 5) {
    return "bg-green-400";
  }
  return "bg-red-400";
};

export default function StudentStatsCards() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await supabase.from("students").select("*");
      if (error) {
        setErrorMsg(error.message);
        setStudents([]);
      } else if (data) {
        setStudents(data);
      }
      setLoading(false);
    };
    fetchStudents();
  }, []);

  const totalStudents = students.length;

  // Only average non-null scores
  // Extract valid pre-test and post-test scores (exclude nulls and NaN)
  const preTestScores = students
    .map(students => students.latest_pretest_score)
    .filter((score): score is number => score !== null && !isNaN(score));

  const postTestScores = students
    .map(students => students.latest_posttest_score)
    .filter((score): score is number => score !== null && !isNaN(score));

  let avgPreTest: number | null = null;
  let avgPostTest: number | null = null;
  let totalPreTest = 0;
  let totalPostTest = 0;

  if (preTestScores.length > 0) {
    totalPreTest = preTestScores.reduce((a, b) => a + b, 0);
    avgPreTest = totalPreTest / preTestScores.length;
  }
  if (postTestScores.length > 0) {
    totalPostTest = postTestScores.reduce((a, b) => a + b, 0);
    avgPostTest = totalPostTest / postTestScores.length;
  }

  // Debugging logs
  // console.log("preTestScores:", preTestScores);
  // console.log("postTestScores:", postTestScores);
  // console.log("totalPreTest:", totalPreTest);
  // console.log("totalPostTest:", totalPostTest);
  // console.log("preTestScores.length:", preTestScores.length);
  // console.log("postTestScores.length:", postTestScores.length);

  // Prevent NaN display, show N/A if no valid scores
  const displayAvgPreTest = avgPreTest === null
    ? "N/A"
    : `${avgPreTest.toFixed(1)}/10`;

  const displayAvgPostTest = avgPostTest === null
    ? "N/A"
    : `${avgPostTest.toFixed(1)}/10`;

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <div className="text-red-500">Error: {errorMsg}</div>;

  return (
    <div className="flex gap-4 mb-6">
      {/* Total Students Card */}
      <div className="bg-yellow-400 text-black rounded-lg shadow p-6 flex-1 flex flex-col items-center">
        <div className="text-3xl font-bold">{totalStudents}</div>
        <div className="text-lg mt-2">Total Students</div>
      </div>
      {/* Avg Pre-Test Card */}
      <div className={`${getCardColor(avgPreTest ?? 0)} text-white rounded-lg shadow p-6 flex-1 flex flex-col items-center`}>
        <div className="text-3xl font-bold">{displayAvgPreTest}</div>
        <div className="text-lg mt-2">Avg Pre-Test</div>
      </div>
      {/* Avg Post-Test Card */}
      <div className={`${getCardColor(avgPostTest ?? 0)} text-white rounded-lg shadow p-6 flex-1 flex flex-col items-center`}>
        <div className="text-3xl font-bold">{displayAvgPostTest}</div>
        <div className="text-lg mt-2">Avg Post-Test</div>
      </div>
    </div>
  );
}
