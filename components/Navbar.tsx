"use client"; // Mark this file as a client component
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // To get the current route
import { FiLogOut, FiArrowLeft } from "react-icons/fi"; // Logout and back icons from react-icons
import { useEffect, useState } from "react";
import { useLogout } from "@/utils/logout";

export default function Navbar() {
  const pathname = usePathname(); // Get the current route
  const router = useRouter();
  const showLogoutButton = pathname !== "/sign-in";
  const [student, setStudent] = useState<{ name: string } | null>(null);

  // Determine if back button should be shown
  const doodleGamePages = [
    "menu/doodle-game/food",
    "menu/doodle-game/animal",
    "menu/doodle-game/object",
  ];
  const showBackButton = !doodleGamePages.includes(pathname);

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

  // Add handleBack function
  const handleBack = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      const newPath = "/" + segments.slice(0, -1).join("/");
      router.push(newPath);
    } else {
      router.push("/");
    }
  };

  return (
    <div
      className={`w-full bg-primary p-4 flex items-center justify-between transition-transform duration-300 z-10 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ position: "sticky", top: 0 }}
    >
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="mr-2 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 text-primary p-2 transition"
            aria-label="Back"
          >
            <FiArrowLeft className="text-xl" />
          </button>
        )}
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