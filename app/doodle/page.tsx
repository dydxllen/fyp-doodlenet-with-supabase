"use client";

import { useState, useEffect } from "react";
import DoodleCanvas from "@/components/DoodleCanvasTest";
import Navbar from "@/components/Navbar";

const vocabularies = [
  { name: "Apple", image: "/apple.png" },
  { name: "Ice Cream", image: "/ice-cream.png" },
  { name: "Carrot", image: "/carrot.png" },
  { name: "Watermelon", image: "/watermelon.png" },
  { name: "Banana", image: "/banana.png" },
  { name: "Fish", image: "/fish.png" },
  { name: "Cat", image: "/cat.png" },
  { name: "Lion", image: "/lion.png" },
  { name: "Bird", image: "/bird.png" },
  { name: "Butterfly", image: "/butterfly.png" },
  { name: "Spider", image: "/spider.png" },
  { name: "Bicycle", image: "/bicycle.png"},
  { name: "Car", image: "/car.png"},
  { name: "Clock", image: "/clock.png"},
  { name: "Flower", image: "/flower.png"},
  { name: "Tree", image: "/tree.png"},
];

export default function DoodlePage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guess, setGuess] = useState({ label: "", confidence: 0 });

  // Randomize the current word index on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * vocabularies.length);
    setCurrentWordIndex(randomIndex);
  }, []);

  const handleSuccess = (label: string, confidence: number) => {
    // Show success pop-up
    alert(`Success! You matched the word "${label}" with confidence ${confidence.toFixed(2)}`);
    // Refresh the page to reset the state
    window.location.reload();
  };

  const handleGuess = (label: string, confidence: number) => {
    setGuess({ label, confidence });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-col md:flex-row justify-center items-start mt-20 w-full max-w-5xl px-4">
        {/* Left Section: Sample Image */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <div className="w-full max-w-sm border-2 border-gray-300 p-4">
            <h2 className="text-center text-xl font-bold bg-yellow-300 py-2 mb-4">
              {vocabularies[currentWordIndex].name}
            </h2>
            <div className="border-2 border-gray-300 flex items-center justify-center h-64">
              <img
                src={vocabularies[currentWordIndex].image}
                alt={vocabularies[currentWordIndex].name}
                className="h-full object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">Guess: {guess.label || "..."}</p>
              <p className="text-lg font-semibold">
                Confidence: {guess.confidence ? `${(guess.confidence * 100).toFixed(2)}%` : "..."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Doodle Canvas */}
        <div className="flex flex-col items-center w-full md:w-1/2 mt-8 md:mt-0">
          <div className="w-full max-w-sm border-2 border-gray-300 p-4">
            <h2 className="text-center text-xl font-bold text-gray-700 mb-4">
              Canvas
            </h2>
            <div className="border-2 border-gray-300">
              <DoodleCanvas
                targetWord={vocabularies[currentWordIndex].name.toLowerCase()}
                onSuccess={handleSuccess}
                onGuess={handleGuess}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}