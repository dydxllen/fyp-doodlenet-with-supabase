import Link from "next/link";
import "./globals.css"; // Import global styles

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Logo */}
      <img
        src="/doodle-it-full.png"
        alt="Doodle It Out Logo"
        className="w-40 sm:w-48 md:w-56 lg:w-64 mb-8 rounded-full"
      />

      {/* Enter Button */}
      <Link href="/sign-in">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all sm:px-8 sm:py-4 sm:text-xl">
          Enter
        </button>
      </Link>
    </div>
  );
}
