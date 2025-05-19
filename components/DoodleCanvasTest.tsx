"use client";

import { useEffect, useRef } from "react";

export default function DoodleCanvas({
  targetWord,
  onSuccess,
  onGuess,
}: {
  targetWord: string;
  onSuccess: (label: string, confidence: number) => void;
  onGuess: (label: string, confidence: number) => void;
}) {
  const sketchContainerRef = useRef<HTMLDivElement>(null);
  const classifierRef = useRef<any>(null); // To store the classifier instance

  useEffect(() => {
    let p5Instance: any = null;

    const initSketch = () => {
      const sketch = (p: any) => {
        p.preload = () => {
          classifierRef.current = window.ml5.imageClassifier("DoodleNet");
        };

        p.setup = () => {
          const canvas = p.createCanvas(280, 280);
          canvas.parent(sketchContainerRef.current);
          p.background(255);

          const clearButton = document.getElementById("clear-button");
          clearButton?.addEventListener("click", () => p.background(255));
        };

        p.draw = () => {
          p.strokeWeight(15);
          p.stroke(0);
          if (p.mouseIsPressed) {
            p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
          }
        };

        // Prevent scrolling while drawing, but allow button touches
        p.touchStarted = (event: any) => {
          if (
            event &&
            event.target &&
            event.target.nodeName === "CANVAS"
          ) {
            return false;
          }
          return true;
        };
        p.touchMoved = (event: any) => {
          if (
            event &&
            event.target &&
            event.target.nodeName === "CANVAS"
          ) {
            return false;
          }
          return true;
        };
      };

      p5Instance = new window.p5(sketch);
    };

    const loadScripts = async () => {
      const p5Script = document.createElement("script");
      p5Script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.min.js";
      p5Script.async = true;
      document.body.appendChild(p5Script);

      const ml5Script = document.createElement("script");
      ml5Script.src = "https://unpkg.com/ml5@0.12.2/dist/ml5.min.js";
      ml5Script.async = true;
      document.body.appendChild(ml5Script);

      p5Script.onload = () => {
        ml5Script.onload = () => {
          initSketch();
        };
      };
    };

    loadScripts();

    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, []);

  const handleGuess = () => {
    const canvas = document.querySelector("canvas");
    if (canvas && classifierRef.current) {
      classifierRef.current.classify(canvas, (error: any, results: any) => {
        if (error) {
          console.error(error);
          return;
        }

        const label = results[0].label.toLowerCase();
        const confidence = results[0].confidence;

        // Log guesses to the network tab
        console.log(`Guess: ${label}, Confidence: ${confidence.toFixed(2)}`);

        // Call onGuess callback to update UI
        onGuess(label, confidence);

        // Check if the guess matches the target word
        if (label === targetWord) {
          // Trigger success callback
          onSuccess(label, confidence);
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        id="sketch-container"
        ref={sketchContainerRef}
        className="flex justify-center items-center mb-4"
      >
        {/* The canvas will be appended here */}
      </div>
      <button
        onClick={handleGuess}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all mb-2"
        type="button"
      >
        Guess
      </button>
      <button
        id="clear-button"
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all"
        type="button"
      >
        Clear Canvas
      </button>
    </div>
  );
}