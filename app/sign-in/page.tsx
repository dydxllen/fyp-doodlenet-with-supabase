"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../globals.css";
import Navbar from "@/components/Navbar";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Login() {
  const [selectedName, setSelectedName] = useState("");
  const [age, setAge] = useState("");
  const [users, setUsers] = useState<{ name: string; age: number }[]>([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const router = useRouter();

  // Fetch students from the database
  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from("students").select("name, age");
      if (error) {
        console.error("Error fetching students:", error);
      } else {
        // Sort users by name ascending
        const sorted = (data || []).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setUsers(sorted);
      }
    };

    fetchStudents();
  }, []);

  // On mount, redirect to /menu if already signed in
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("student")) {
      router.replace("/menu");
    }
  }, [router]);

  // Handle dropdown change
  const handleNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find((user) => user.name === event.target.value);
    setSelectedName(selectedUser ? selectedUser.name : "");
    setAge(selectedUser ? selectedUser.age.toString() : "");
    setErrorMessage(""); // Clear error message when a name is selected
  };

  // Handle Enter button click
  const handleEnterClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    if (!selectedName) {
      setErrorMessage("Please select a name before proceeding.");
      return;
    }
    // Store student in localStorage
    localStorage.setItem("student", JSON.stringify({ name: selectedName, age }));

    // Fetch student_id and latest_pretest_score from students table
    const { data: studentData, error: studentError } = await supabase
      .from("students")
      .select("student_id, latest_pretest_score")
      .eq("name", selectedName)
      .single();

    if (studentError || !studentData) {
      setErrorMessage("Error fetching student information.");
      return;
    }

    // Check latest_pretest_score
    if (studentData.latest_pretest_score === null) {
      router.replace("/pre-test");
    } else {
      router.replace("/menu");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="w-full px-4 mt-4 sm:mt-12">
        {/* Logo & Title */}
        <div className="my-8 text-center">
          <img
            src="/doodle-it-full.png"
            alt="Doodle It Out"
            className="w-32 sm:w-40 mx-auto rounded-full"
          />
        </div>

        {/* Form */}
        <form className="flex flex-col w-full max-w-md mx-auto">
          {/* Name Dropdown */}
          <label htmlFor="student-name-select" className="sr-only">
            Select Name
          </label>
          <select
            id="student-name-select"
            className="w-full bg-gray-300 p-3 rounded-lg text-lg font-semibold"
            value={selectedName}
            onChange={handleNameChange}
            required
          >
            <option value="" disabled>
              Select your name
            </option>
            {users.map((user) => (
              <option key={user.name} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}

          {/* Age Display */}
            <div className="w-full mt-4 bg-gray-300 p-3 rounded-lg text-lg font-semibold text-center">
            {age ? (
              `Age: ${age}`
            ) : (
              <span className="text-gray-500">Age</span>
            )}
            </div>

          {/* Enter Button */}
          <a
            href="/menu"
            onClick={handleEnterClick}
            className="bg-secondary text-black font-bold rounded-lg py-3 px-10 mt-6 text-lg hover:bg-secondary-dark transition-all text-center inline-block"
          >
            Enter
          </a>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-6 text-center">
            {/* Teacher Login */}
            <div>
              <p className="text-sm mb-2">Are you a teacher?</p>
              <Link
                href="/admin/sign-in"
                className="bg-accent text-white font-bold py-3 px-6 rounded-lg mt-2 text-lg inline-block hover:bg-accent-dark transition-all"
              >
                I am a Teacher
              </Link>
            </div>

            {/* Doodle Page Link */}
            {/* <div>
              <p className="text-sm mb-2">Want to try doodling?</p>
              <Link
                href="/doodle"
                className="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg mt-2 text-lg inline-block hover:bg-blue-600 transition-all"
              >
                Go to Doodle Page
              </Link>
            </div> */}
          </div>
        </form>
      </div>
    </div>
  );
}
