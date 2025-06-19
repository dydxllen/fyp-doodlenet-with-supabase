"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts";
import { createClient } from "@/utils/supabase/client";

// List of vocabularies to display on the chart
const VOCABULARIES = [
  "Apple",
  "Carrot",
  "Fish",
  "Cat",
  "Lion",
  "Spider",
  "Car",
  "Clock",
  "Flower",
  "Tree",
];

// Age groups to compare
const AGE_GROUPS = [3, 4, 5, 6];

// Colors for each age group bar
const AGE_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

export default function VocabComparisonBarChart() {
  // State for chart data and loading
  const [preTestChartData, setPreTestChartData] = useState<any[]>([]);
  const [postTestChartData, setPostTestChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch and process data for the charts
    const fetchAndProcessVocabStats = async () => {
      setLoading(true);
      const supabase = createClient();

      // Query all correct answers with student age joined
      const { data: answers, error } = await supabase
        .from("student_answers")
        .select(
          "question, test_type, is_correct, student_id, students:students!student_answers_student_id_fkey(age)"
        )
        .eq("is_correct", true);

      if (error || !answers) {
        setPreTestChartData([]);
        setPostTestChartData([]);
        setLoading(false);
        return;
      }

      // Filter out answers where student or age is missing
      const validAnswers = answers.filter((answer) => {
        // Supabase join returns students as an array, so extract the first element
        const student = Array.isArray(answer.students) ? answer.students[0] : answer.students;
        return (
          student !== null &&
          typeof student.age === "number" &&
          AGE_GROUPS.includes(student.age)
        );
      });

      // Initialize stats objects for pre-test and post-test
      const preTestStats: Record<string, Record<number, number>> = {};
      const postTestStats: Record<string, Record<number, number>> = {};

      // Set initial counts to zero for each vocab and age group
      for (const vocab of VOCABULARIES) {
        preTestStats[vocab] = {};
        postTestStats[vocab] = {};
        for (const age of AGE_GROUPS) {
          preTestStats[vocab][age] = 0;
          postTestStats[vocab][age] = 0;
        }
      }

      // Count correct answers for each vocab, age, and test type
      for (const answer of validAnswers) {
        const vocab = answer.question;
        // Extract student object from array if needed
        const student = Array.isArray(answer.students) ? answer.students[0] : answer.students;
        const age = student.age;
        const testType = answer.test_type;

        // Only process if vocab and age are in our defined lists
        if (VOCABULARIES.includes(vocab) && AGE_GROUPS.includes(age)) {
          if (testType === "pre") {
            preTestStats[vocab][age] = preTestStats[vocab][age] + 1;
          } else if (testType === "post") {
            postTestStats[vocab][age] = postTestStats[vocab][age] + 1;
          }
        }
      }

      // Convert stats objects to arrays for recharts
      const preTestChartRows = VOCABULARIES.map((vocab) => {
        const row: any = { vocab };
        for (const age of AGE_GROUPS) {
          row[`age${age}`] = preTestStats[vocab][age];
        }
        return row;
      });

      const postTestChartRows = VOCABULARIES.map((vocab) => {
        const row: any = { vocab };
        for (const age of AGE_GROUPS) {
          row[`age${age}`] = postTestStats[vocab][age];
        }
        return row;
      });

      setPreTestChartData(preTestChartRows);
      setPostTestChartData(postTestChartRows);
      setLoading(false);
    };

    fetchAndProcessVocabStats();
  }, []);

  return (
    <div className="w-full flex flex-col gap-8">
      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      ) : (
        <>
          {/* Pre-test Chart */}
          <div>
            <h3 className="font-semibold mb-2">Pre-test Vocabulary Comparison</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={preTestChartData}
                margin={{ top: 16, right: 16, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="vocab"
                  label={{
                    value: "Vocabulary",
                    position: "insideBottom",
                    offset: -4
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  label={{
                    value: "Number Correct",
                    angle: -90,
                    position: "insideLeft",
                    dy: 50
                  }}
                />
                <Tooltip />
                <Legend />
                {AGE_GROUPS.map((age, index) => (
                  <Bar
                    key={age}
                    dataKey={`age${age}`}
                    fill={AGE_COLORS[index]}
                    name={`${age} years old`}
                  >
                    <LabelList
                      dataKey={`age${age}`}
                      position="top"
                      formatter={(value: number) => (value > 0 ? value : "")}
                    />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Post-test Chart */}
          <div>
            <h3 className="font-semibold mb-2">Post-test Vocabulary Comparison</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={postTestChartData}
                margin={{ top: 16, right: 16, left: 10, bottom: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="vocab"
                  label={{
                    value: "Vocabulary",
                    position: "insideBottom",
                    offset: -4
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  label={{
                    value: "Number Correct",
                    angle: -90,
                    position: "insideLeft",
                    dy: 50
                  }}
                />
                <Tooltip />
                <Legend />
                {AGE_GROUPS.map((age, index) => (
                  <Bar
                    key={age}
                    dataKey={`age${age}`}
                    fill={AGE_COLORS[index]}
                    name={`${age} years old`}
                  >
                    <LabelList
                      dataKey={`age${age}`}
                      position="top"
                      formatter={(value: number) => (value > 0 ? value : "")}
                    />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
