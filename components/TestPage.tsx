"use client";
import React, { useState } from "react";
import questionBank from "@/questionBank.json";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const vocabularies = [
  { name: "Apple", image: "/apple.png" },
  // { name: "Ice Cream", image: "/ice-cream.png" },
  { name: "Carrot", image: "/carrot.png" },
  // { name: "Watermelon", image: "/watermelon.png" },
  // { name: "Banana", image: "/banana.png" },
  { name: "Fish", image: "/fish.png" },
  { name: "Cat", image: "/cat.png" },
  { name: "Lion", image: "/lion.png" },
  // { name: "Bird", image: "/bird.png" },
  // { name: "Butterfly", image: "/butterfly.png" },
  { name: "Spider", image: "/spider.png" },
  // { name: "Bicycle", image: "/bicycle.png" },
  { name: "Car", image: "/car.png" },
  { name: "Clock", image: "/clock.png" },
  { name: "Flower", image: "/flower.png" },
  { name: "Tree", image: "/tree.png" },
];

type Question = {
  image: string;
  choices: string[];
  answer: string;
};

interface TestPageProps {
  questionsCount?: number; // default 10
  mode?: "pre" | "post"; // add mode prop
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TestPage: React.FC<TestPageProps> = ({ questionsCount = 10, mode = "post" }) => {
  // Shuffle and pick N questions
  const shuffled = React.useMemo(() => {
    const arr = [...questionBank];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, questionsCount);
  }, [questionsCount]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(questionsCount).fill(null)
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showPreTestModal, setShowPreTestModal] = useState(mode === "pre" || mode === "post"); // show modal if pre- or post-test
  const [saving, setSaving] = useState(false);
  const isLast = current === shuffled.length - 1;
  const router = useRouter();

  const handleSelect = (choice: string) => {
    if (showFeedback) return;
    setSelected(choice);
  };

  const handleNext = () => {
    if (selected == null || showFeedback) return;
    setShowFeedback(true);
    // Update score if correct
    if (selected === shuffled[current].answer) setScore(score + 1);
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);

    const timeout = setTimeout(() => {
      setShowFeedback(false);
      setSelected(null);
      if (!isLast) {
        setCurrent(current + 1);
      }
    }, 1000);
    setFeedbackTimeout(timeout);
  };

  const handleEnd = async () => {
    if (selected == null || showFeedback) return;
    setShowFeedback(true);

    // Prepare the final answers array
    const finalAnswers = [...answers];
    finalAnswers[current] = selected;

    // Calculate the final score
    const finalScore = finalAnswers.reduce(
      (acc, ans, idx) => acc + (ans === shuffled[idx].answer ? 1 : 0),
      0
    );

    setAnswers(finalAnswers);
    setScore(finalScore);

    setTimeout(async () => {
      setShowFeedback(false);
      setShowResult(true);

      // Save pre-test or post-test score
      if (mode === "pre" || mode === "post") {
        setSaving(true);
        // Get student name from localStorage
        let student = null;
        if (typeof window !== "undefined") {
          try {
            student = JSON.parse(localStorage.getItem("student") || "{}");
          } catch {}
        }
        if (student && student.name) {
          // Get student_id from DB (if not already stored in localStorage)
          let student_id = student.student_id;
          if (!student_id) {
            const { data } = await supabase
              .from("students")
              .select("student_id")
              .eq("name", student.name)
              .single();
            student_id = data?.student_id;
            // Optionally store in localStorage for next time
            if (student_id) {
              localStorage.setItem("student", JSON.stringify({ ...student, student_id }));
            }
          }
          if (student_id) {
            // 1. Insert a new test_attempts row and get attempt_id
            const { data: attemptData, error: attemptError } = await retryRequest(
              () =>
                supabase
                  .from("test_attempts")
                  .insert([
                    {
                      student_id,
                      test_type: mode,
                      score: finalScore,
                    },
                  ])
                  .select("attempt_id")
                  .single()
            );
            if (attemptError || !attemptData) {
              alert("Failed to save test attempt. Please try again.");
              setSaving(false);
              return;
            }
            const attempt_id = attemptData.attempt_id;

            // 2. Insert answers with the new attempt_id
            const records = shuffled.map((q, idx) => ({
              student_id,
              attempt_id,
              test_type: mode,
              question: q.answer,
              answer: finalAnswers[idx],
              is_correct: finalAnswers[idx] === q.answer,
            }));

            const { error: insertError, data: insertedAnswers } = await retryRequest(
              async () => await supabase.from("student_answers").insert(records).select()
            );
            if (insertError) {
              console.error("Insert error:", insertError, "Records:", records);
              alert("Failed to save answers after several attempts. Please check your connection and try again.");
              setSaving(false);
              return;
            }
            if (!insertedAnswers || insertedAnswers.length !== records.length) {
              console.warn("Not all answers were saved!", { insertedAnswers, records });
              alert("Some answers may not have been saved. Please check your connection.");
              setSaving(false);
              return;
            }

            // Update summary score in students table with retry
            const scoreField = mode === "pre" ? "latest_pretest_score" : "latest_posttest_score";
            const { error: updateError } = await retryRequest(
              () =>
                supabase
                  .from("students")
                  .update({ [scoreField]: finalScore })
                  .eq("student_id", student_id)
                  .select()
                  .then((res) => res)
            );
            if (updateError) {
              alert("Failed to update score after several attempts. Please check your connection and try again.");
              setSaving(false);
              return;
            }
          }
        }
        setSaving(false);
      }
    }, 1000);
  };

  // Compliment based on score
  const compliment = score === questionsCount
    ? "Excellent! Perfect score! 🎉"
    : score >= Math.floor(questionsCount * 0.7)
      ? "Well done! 👍"
      : score >= Math.floor(questionsCount * 0.4)
        ? "Good try! Keep practicing!"
        : "Don't give up! Try again!";

  React.useEffect(() => {
    return () => {
      if (feedbackTimeout) clearTimeout(feedbackTimeout);
    };
  }, [feedbackTimeout]);

  const q = shuffled[current];

  // Find the image path from vocabularies using the answer (case-insensitive)
  const vocabImage =
    vocabularies.find(
      (v) => v.name.toLowerCase() === q.answer.toLowerCase()
    )?.image || "";

  return (
    <div className="flex flex-col items-center w-full">
      {/* Navbar */}
      <Navbar />
      {/* Pre-test/Post-test Modal */}
      {(showPreTestModal && (mode === "pre" || mode === "post")) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-xs">
            <div className="text-2xl font-bold mb-4">
              {mode === "pre" ? "Pre-Test" : "Post-Test"}
            </div>
            <div className="mb-6 text-center">
              {mode === "pre"
                ? (
                  <>
                    This is a pre-test to assess your current knowledge.<br />
                    Are you ready to begin?
                  </>
                )
                : (
                  <>
                    This is a post-test to assess what you have learned.<br />
                    Are you ready to begin?
                  </>
                )
              }
            </div>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-lg font-bold px-8 py-3 rounded-xl"
              onClick={() => setShowPreTestModal(false)}
            >
              Start
            </button>
          </div>
        </div>
      )}
      {/* Hide quiz until modal is closed */}
      {!showPreTestModal && (
        <>
          {/* Header */}
          <div className="flex justify-between w-full max-w-3xl mt-8 mb-4">
            <h2 className="text-2xl font-bold">{`Question ${
              current + 1
            }${isLast ? " (last)" : ""}`}</h2>
            <div className="text-center">
              <div className="font-bold text-lg">Points</div>
              <div className="text-4xl font-bold">
                {score}/{questionsCount}
              </div>
            </div>
          </div>
          {/* Image and Choices Side by Side */}
          <div className="flex flex-row items-center justify-center w-full max-w-3xl mb-8 gap-8">
            {/* Image */}
            <div
              className="bg-gray-200 rounded-lg flex items-center justify-center"
              style={{ width: 320, height: 320 }}
            >
              {/* Show image matching the word */}
              {vocabImage ? (
                <img
                  src={vocabImage}
                  alt={q.answer}
                  className="object-contain w-full h-full"
                />
              ) : (
                <span className="text-xl text-gray-400">No image</span>
              )}
            </div>
            {/* Choices */}
            <div className="flex flex-col gap-4 w-full max-w-xs">
              {q.choices.map((choice) => {
                let btnClass = "bg-yellow-300 hover:bg-yellow-400";
                if (showFeedback && selected != null) {
                  if (choice === q.answer) {
                    btnClass = "bg-green-400 ring-4 ring-green-600";
                  } else if (selected === choice) {
                    btnClass = "bg-red-400 ring-4 ring-red-600";
                  }
                } else if (selected === choice) {
                  btnClass = "bg-yellow-400 ring-4 ring-yellow-600";
                }
                return (
                  <button
                    key={choice}
                    className={`rounded-2xl py-4 text-lg font-bold transition-all ${btnClass}`}
                    onClick={() => handleSelect(choice)}
                    disabled={showFeedback}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Navigation */}
          <div className="flex gap-8 w-full max-w-2xl justify-center">
            {/* <button
              className="bg-gray-200 rounded-full px-10 py-4 text-lg font-bold flex items-center gap-2"
              onClick={() => {
                setCurrent(current - 1);
                setSelected(answers[current - 1]);
              }}
              disabled={current === 0}
            >
              &#8592; Previous
            </button> */}
            {!isLast ? (
              <button
                className="bg-gray-200 rounded-full px-10 py-4 text-lg font-bold flex items-center gap-2"
                onClick={handleNext}
                disabled={selected === null || showFeedback}
              >
                Next &#8594;
              </button>
            ) : (
              <button
                className="bg-green-500 text-white rounded-full px-24 py-4 text-lg font-bold"
                onClick={handleEnd}
                disabled={selected === null || showFeedback}
              >
                End
              </button>
            )}
          </div>
          {/* Result Modal */}
          {showResult && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center max-w-xs">
                <div className="text-3xl font-bold mb-2">Quiz Complete!</div>
                <div className="text-2xl font-bold mb-4">
                  Score: {score}/{questionsCount}
                </div>
                <div className="text-lg mb-6">{compliment}</div>
                {saving ? (
                  <div className="text-gray-500 mb-4">Saving your score...</div>
                ) : (
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-lg font-bold px-8 py-3 rounded-xl"
                    onClick={() => {
                      router.push("/menu");
                    }}
                  >
                    Back to Menu
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TestPage;

// Helper function for retrying Supabase requests
async function retryRequest(fn: () => PromiseLike<any>, retries = 3, delay = 1000): Promise<any> {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      const { error, ...rest } = await fn();
      if (!error) return { error: null, ...rest };
      lastError = error;
    } catch (err) {
      lastError = err;
      console.error("Request threw an exception:", err);
    }
    await new Promise((res) => setTimeout(res, delay));
  }
  return { error: lastError };
}