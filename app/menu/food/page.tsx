"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function FoodCategoryPage() {
  const vocabularies = [
    { name: "Apple", image: "/apple.png", stars: 3 },
    { name: "Cookie", image: "/cookie.png", stars: 2 },
    { name: "Carrot", image: "/carrot.png", stars: 1 },
    { name: "Watermelon", image: "/watermelon.png", stars: 0 },
    { name: "Banana", image: "/banana.png", stars: 3 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Category Title */}
      <div className="text-center py-6 bg-blue-300">
        <h1 className="text-3xl font-bold text-white">Food</h1>
      </div>

      <div className="flex justify-center my-4">
        <a
          href="/menu/food/doodle-game"
          className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition"
        >
          Start Doodle Game
        </a>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {vocabularies.map((vocab, index) => (
          <button
            key={index}
            className="flex flex-col items-center bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            onClick={() => alert(`Navigate to doodle page for ${vocab.name}`)}
          >
            <img
              src={vocab.image}
              alt={vocab.name}
              className="w-24 h-24 object-contain mb-4"
            />
            <p className="text-lg font-semibold mb-2">{vocab.name}</p>
            <div className="flex">
              {[...Array(3)].map((_, starIndex) => (
                <svg
                  key={starIndex}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={starIndex < vocab.stars ? "gold" : "none"}
                  viewBox="0 0 24 24"
                  stroke="gold"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}