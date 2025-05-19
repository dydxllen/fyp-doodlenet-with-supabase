"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import DoodleCanvas from "@/components/DoodleCanvas";

const vocabularies = [
  { name: "Apple", image: "/apple.png" },
  { name: "Ice Cream", image: "/ice-cream.png" },
  { name: "Carrot", image: "/carrot.png" },
  { name: "Watermelon", image: "/watermelon.png" },
  { name: "Banana", image: "/banana.png" },
];

export default function FoodDoodleGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState({ label: "", confidence: 0 });
  const [showSuccess, setShowSuccess] = useState(false);

  const currentVocab = vocabularies[currentIndex];

  const handleSuccess = (label: string, confidence: number) => {
    setGuess({ label, confidence });
    setShowSuccess(true);
  };

  const handleGuess = (label: string, confidence: number) => {
    setGuess({ label, confidence });
  };

  const handleNext = () => {
    setShowSuccess(false);
    setGuess({ label: "", confidence: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSkip = () => {
    setShowSuccess(false);
    setGuess({ label: "", confidence: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= vocabularies.length) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-full py-20">
          <h2 className="text-2xl font-bold mb-4">Great job!</h2>
          <p>You have completed all the food doodles!</p>
          <a href="/menu/food" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">Back to Food Menu</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Navbar />
      <main className="flex flex-col md:flex-row justify-center items-start mt-12 w-full max-w-5xl px-4">
        {/* Left Section: Vocabulary and Image */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <div className="w-full max-w-sm border-2 border-gray-300 p-4 bg-white rounded-lg">
            <h2 className="text-center text-xl font-bold bg-yellow-300 py-2 mb-4 rounded">
              {currentVocab.name}
            </h2>
            <div className="border-2 border-gray-300 flex items-center justify-center h-64 bg-gray-50 rounded">
              <img
                src={currentVocab.image}
                alt={currentVocab.name}
                className="h-full object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">
                Guess: {guess.label ? guess.label : "..."}
              </p>
              <p className="text-lg font-semibold">
                Confidence: {guess.confidence ? `${(guess.confidence * 100).toFixed(2)}%` : "..."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Doodle Canvas */}
        <div className="flex flex-col items-center w-full md:w-1/2 mt-8 md:mt-0">
          <div className="w-full max-w-sm border-2 border-gray-300 p-4 bg-white rounded-lg">
            <h2 className="text-center text-xl font-bold text-gray-700 mb-4">
              Canvas
            </h2>
            <div className=" ">
              <DoodleCanvas
                targetWord={currentVocab.name.toLowerCase()}
                onSuccess={handleSuccess}
                onGuess={handleGuess}
                onSkip={handleSkip}
              />
            </div>
            {showSuccess && (
              <div className="mt-6 bg-green-100 rounded shadow p-4 text-center">
                <p className="font-bold text-green-700 mb-2">
                  Correct! The model recognized your doodle.
                </p>
                <button
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleNext}
                >
                  Next Word
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}