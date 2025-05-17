"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import bcrypt from "bcryptjs";

export default function AdminSignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    // Query the admin table to get the hashed password
    const { data: admin, error } = await supabase
      .from("admin")
      .select("*")
      .eq("username", username)
      .single();

    console.log("Admin Query Result:", admin, error);

    if (error || !admin) {
      setError("Invalid username or password");
      return;
    }

    // Compare the plain-text password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      setError("Invalid username or password");
      return;
    }

    localStorage.setItem("admin", JSON.stringify({ username }));
    router.push("/admin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Admin Sign-In</h1>
      <form
        onSubmit={handleSignIn}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}