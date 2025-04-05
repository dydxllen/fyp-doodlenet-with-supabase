"use client";

import { useState } from "react";
import Link from "next/link";
import "../globals.css"; // Import global styles
import Navbar from "@/components/Navbar";

export default function Login() {
  const [selectedName, setSelectedName] = useState("");
  const [age, setAge] = useState("");

  // Dummy database (replace with real API call)
  const users = [
    { name: "Alice", age: 5 },
    { name: "Bob", age: 6 },
    { name: "Charlie", age: 7 },
    { name: "Darren", age: 18 },
  ];

  // Handle dropdown change
  const handleNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find((user) => user.name === event.target.value);
    setSelectedName(selectedUser ? selectedUser.name : "");
    setAge(selectedUser ? selectedUser.age.toString() : "");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-poppins text-text ">
      {/* Navbar */}
      <Navbar/>
      {/* <div className="w-full bg-primary p-4 flex items-center fixed top-0 left-0 z-10">
        <img src="/doodle-it-logo.png" alt="Logo" className="h-8 ml-4" />
        <div className="ml-auto mr-4 cursor-pointer">
          <div className="h-1 w-6 bg-black mb-1"></div>
          <div className="h-1 w-6 bg-black mb-1"></div>
          <div className="h-1 w-6 bg-black"></div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="mt-12 w-full px-4">
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
          <label className="font-semibold text-lg mb-2">Select Name</label>
          <select
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

          {/* Age Display */}
          <div className="w-full mt-4 bg-gray-300 p-3 rounded-lg text-lg font-semibold text-center">
            {age ? `Age: ${age}` : "Age (Populated data)"}
          </div>

          {/* Enter Button */}
          <Link
            href="/main-menu"
            className="bg-secondary text-black font-bold rounded-lg py-3 px-10 mt-6 text-lg hover:bg-secondary-dark transition-all text-center inline-block"
          >
            Enter
          </Link>

          {/* Teacher Login */}
          <div className="mt-10 text-center">
            <p className="text-sm">Are you a teacher?</p>
            <Link
              href=""
              className="bg-accent text-white font-bold py-3 px-8 rounded-lg mt-2 text-lg inline-block hover:bg-accent-dark transition-all"
            >
              I am a Teacher
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
