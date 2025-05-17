"use client"; // Mark this file as a client component
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // To get the current route
import { FiLogOut } from "react-icons/fi"; // Logout icon from react-icons
import { useEffect, useState } from "react";
import { useLogout } from "@/utils/logout";

export default function Navbar() {
  const pathname = usePathname(); // Get the current route
  const router = useRouter();
  const showLogoutButton = pathname !== "/sign-in";
  const [student, setStudent] = useState<{ name: string } | null>(null);

  // Scroll state
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Get student from localStorage
    const stored = localStorage.getItem("student");
    if (stored) {
      setStudent(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setShow(true);
        setLastScrollY(window.scrollY);
        return;
      }
      if (window.scrollY > lastScrollY) {
        setShow(false); // Scrolling down
      } else {
        setShow(true); // Scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const logout = useLogout();

  return (
    <div
      className={`w-full bg-primary p-4 flex items-center justify-between transition-transform duration-300 z-10 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ position: "sticky", top: 0 }}
    >
      <div className="flex items-center gap-4">
        <img src="/doodle-it-logo.png" alt="Logo" className="h-8 ml-4 rounded-full" />
        {student && (
          <span className="font-semibold text-white bg-blue-400 px-4 py-2 rounded-full">
            Hi, {student.name}
          </span>
        )}
      </div>
      {showLogoutButton && (
        <button
          onClick={logout}
          className="flex-shrink-0 w-auto flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
        >
          <FiLogOut className="text-lg" />
          Log Out
        </button>
      )}
    </div>
  );
}