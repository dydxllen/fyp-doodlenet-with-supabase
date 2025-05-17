"use client"; // Mark this file as a client component

import { useRouter } from "next/navigation"; // To get the current route
import { FiLogOut } from "react-icons/fi"; // Logout icon from react-icons
import { useEffect, useState } from "react";

export default function AdminNavbar() {
  const router = useRouter();

  const handleAdminLogout = () => {
    localStorage.removeItem("admin");
    router.push("/sign-in");
  };

  return (
    <nav className="w-full bg-blue-500 p-4 flex items-center justify-between">
      <span className="text-white font-bold text-lg">Admin Dashboard</span>
      <button
        onClick={handleAdminLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
      >
        <FiLogOut className="text-lg" />
        Log Out
      </button>
    </nav>
  );
}