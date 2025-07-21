import React, { useEffect, useState, useRef } from "react";
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
    : `${avgPreTest.toFixed(1)} out of 10`;

  const displayAvgPostTest = avgPostTest === null
    ? "N/A"
    : `${avgPostTest.toFixed(1)} out of 10`;

  // Tooltip state for touch devices
  const [showPreTooltip, setShowPreTooltip] = useState(false);
  const [showPostTooltip, setShowPostTooltip] = useState(false);
  const preCardRef = useRef<HTMLDivElement>(null);
  const postCardRef = useRef<HTMLDivElement>(null);

  // Hide tooltip when clicking outside (for touch)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        preCardRef.current &&
        !preCardRef.current.contains(event.target as Node)
      ) {
        setShowPreTooltip(false);
      }
      if (
        postCardRef.current &&
        !postCardRef.current.contains(event.target as Node)
      ) {
        setShowPostTooltip(false);
      }
    }
    if (showPreTooltip || showPostTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPreTooltip, showPostTooltip]);

  // Tooltip content
  const tooltipText = (
    <>
      The average score is calculated by adding all valid scores and dividing by the number of students who have a score. Students without a score are not included.
      <br />
      Average = (sum of valid scores) / (number of valid scores).
    </>
  );

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <div className="text-red-500">Error: {errorMsg}</div>;

  return (
    <div className="flex gap-4 mb-6">
      {/* Total Students Card */}
      <div className="bg-yellow-400 text-black rounded-lg shadow p-6 flex-1 flex flex-col items-center">
        <div className="text-lg">Total Students</div>
        <div className="text-3xl font-bold">{totalStudents}</div>
      </div>
      {/* Avg Pre-Test Card */}
      <div
        ref={preCardRef}
        className={`${getCardColor(avgPreTest ?? 0)} text-white rounded-lg shadow p-6 flex-1 flex flex-col items-center relative group cursor-pointer`}
        // Show tooltip on click/tap for touch devices
        onClick={() => setShowPreTooltip((v) => !v)}
        // Prevent click from bubbling to document
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="text-lg flex items-center gap-2">
          Average Score (Pre)
          <span className="ml-1 text-white/80 text-base">ⓘ</span>
        </div>
        <div className="text-3xl font-bold">{displayAvgPreTest}</div>
        {/* Tooltip */}
        <div
          className={`
            absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10
            bg-gray-800 text-white text-xs rounded px-3 py-2 shadow
            w-64
            opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
            transition-opacity
            ${showPreTooltip ? "opacity-100 pointer-events-auto" : ""}
          `}
          style={{ minWidth: "400px" }}
        >
          {tooltipText}
        </div>
      </div>
      {/* Avg Post-Test Card */}
      <div
        ref={postCardRef}
        className={`${getCardColor(avgPostTest ?? 0)} text-white rounded-lg shadow p-6 flex-1 flex flex-col items-center relative group cursor-pointer`}
        onClick={() => setShowPostTooltip((v) => !v)}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="text-lg flex items-center gap-2">
          Average Score (Post)
          <span className="ml-1 text-white/80 text-base">ⓘ</span>
        </div>
        <div className="text-3xl font-bold">{displayAvgPostTest}</div>
        {/* Tooltip */}
        <div
          className={`
            absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10
            bg-gray-800 text-white text-xs rounded px-3 py-2 shadow
            w-64
            opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
            transition-opacity
            ${showPostTooltip ? "opacity-100 pointer-events-auto" : ""}
          `}
          style={{ minWidth: "400px" }}
        >
          {tooltipText}
        </div>
      </div>
    </div>
  );
}
