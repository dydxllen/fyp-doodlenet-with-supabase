// filepath: c:\Users\MSI-PC\dyllen\fyp-doodlenet-with-supabase\components\Navbar.tsx
"use client"; // Mark this file as a client component
import Link from "next/link";
import { usePathname } from "next/navigation"; // To get the current route
import { FiLogOut } from "react-icons/fi"; // Logout icon from react-icons

export default function Navbar() {
  const pathname = usePathname(); // Get the current route

  // Check if the current page is not the sign-in page
  const showLogoutButton = pathname !== "/sign-in";

  return (
    <div className="w-full bg-primary p-4 flex items-center justify-between fixed top-0 left-0 z-10">
      <img src="/doodle-it-logo.png" alt="Logo" className="h-8 ml-4 rounded-full" />
      {showLogoutButton && (
        <Link
          href="/sign-in"
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
        >
          <FiLogOut className="text-lg" /> 
          Log Out
        </Link>
      )}
    </div>
  );
}