"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("student")) {
      router.replace("/sign-in");
    }
  }, [router]);

  const categories = [
    { name: "Food", image: "/food-category.png", link: "/menu/food" },
    { name: "Object", image: "/object-category.png", link: "/menu/object" },
    { name: "Animal", image: "/animal-category.png", link: "/menu/animal" },
    { name: "Test", image: "/post-test.png", link: "/menu/post-test" },
  ];  

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pt-20 px-4">
        <h1 className="text-2xl font-bold mb-8">Select a Category</h1>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              className="group flex flex-col items-center justify-center"
            >
              <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p className="mt-2 text-lg font-semibold group-hover:text-blue-500 transition-colors duration-300">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}