"use client";

import { useState, useEffect } from "react";
import DoodleCanvas from "@/components/DoodleCanvasTest";
import Navbar from "@/components/Navbar";

const vocabularies = [
  { name: "Apple", image: "/apple.png" },
  // { name: "Ice Cream", image: "/ice-cream.png" },
  { name: "Carrot", image: "/carrot.png" },
  // { name: "Watermelon", image: "/watermelon.png" },
  // { name: "Banana", image: "/banana.png" },
  { name: "Fish", image: "/fish.png" },
  { name: "Cat", image: "/cat.png" },
  { name: "Lion", image: "/lion.png" },
  // { name: "Bird", image: "/bird.png" },
  // { name: "Butterfly", image: "/butterfly.png" },
  { name: "Spider", image: "/spider.png" },
  // { name: "Bicycle", image: "/bicycle.png"},
  { name: "Car", image: "/car.png"},
  { name: "Clock", image: "/clock.png"},
  { name: "Flower", image: "/flower.png"},
  { name: "Tree", image: "/tree.png"},
];

export default function DoodlePage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guess, setGuess] = useState<{ label: string; confidence: number } | null>(null);
  const [topGuesses, setTopGuesses] = useState<{ label: string; confidence: number }[] | null>(null);
  const [guessAttempted, setGuessAttempted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ label: string; confidence: number } | null>(null);

  // Show vocabularies in sequence, start from the first word
  useEffect(() => {
    setCurrentWordIndex(0);
  }, []);

  const handleSuccess = (label: string, confidence: number) => {
    setSuccessInfo({ label, confidence });
    setShowSuccess(true);
  };

  const handleGuess = (label: string, confidence: number) => {
    setGuess({ label, confidence });
    setGuessAttempted(true);
  };

  // Add handler for top guesses
  const handleTopGuesses = (guesses: { label: string; confidence: number }[]) => {
    setTopGuesses(guesses);
  };

  // Change skip handler to go to next word in sequence, looping back to first
  const handleSkip = () => {
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % vocabularies.length);
    setGuess(null);
    setTopGuesses(null);
    setGuessAttempted(false);
  };

  // Add back handler to go to previous word in sequence, looping to last if at first
  const handleBack = () => {
    setCurrentWordIndex((prevIndex) =>
      prevIndex === 0 ? vocabularies.length - 1 : prevIndex - 1
    );
    setGuess(null);
    setTopGuesses(null);
    setGuessAttempted(false);
  };

  const handleNext = () => {
    setShowSuccess(false);
    setSuccessInfo(null);
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % vocabularies.length);
    setGuess(null);
    setTopGuesses(null);
    setGuessAttempted(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Success Modal */}
      {showSuccess && successInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center max-w-xs">
            <div className="text-2xl font-bold text-green-600 mb-2">Correct!</div>
            <div className="mb-2 text-lg text-gray-700">
              You matched the word <span className="font-bold">{successInfo.label}</span>
            </div>
            <div className="mb-4 text-gray-600">
              Confidence: {(successInfo.confidence * 100).toFixed(2)}%
            </div>
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex flex-col md:flex-row justify-center items-start mt-20 w-full max-w-5xl px-4">
        {/* Left Section: Sample Image */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <div className="w-full max-w-sm border-2 border-gray-300 p-4">
            <h2 className="text-center text-4xl font-bold bg-yellow-300 py-2 mb-4">
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
              <p className="text-lg font-semibold">
                Guess: {guess ? guess.label : ""}
              </p>
              <p className="text-lg font-semibold">
                Confidence: {guess ? (guess.confidence ? `${(guess.confidence * 100).toFixed(2)}%` : "") : ""}
              </p>
              {/* Top 3 guesses */}
              <div className="mt-4">
                <p className="font-bold">Top 3 Guesses:</p>
                <ol className="list-decimal list-inside">
                  {!guessAttempted && <li className="text-gray-500">No guesses yet</li>}
                  {guessAttempted && (!topGuesses || topGuesses.length === 0) && (
                    <li className="text-red-500">Try again</li>
                  )}
                  {topGuesses && topGuesses.length > 0 && topGuesses.map((g, i) => (
                    <li key={i}>
                      {g.label} ({(g.confidence * 100).toFixed(2)}%)
                    </li>
                  ))}
                </ol>
              </div>
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
                onSkip={handleSkip}
                onBack={handleBack}
                vocabularies={vocabularies.map((v) => v.name)}
                onTopGuesses={handleTopGuesses}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}