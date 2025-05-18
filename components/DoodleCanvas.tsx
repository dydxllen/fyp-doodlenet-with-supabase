"use client";

import { useEffect, useRef } from "react";
import { RxEraser } from "react-icons/rx";
import { MdSkipNext } from "react-icons/md";

export default function DoodleCanvas({
  targetWord,
  onSuccess,
  onGuess,
  onSkip,
}: {
  targetWord: string;
  onSuccess: (label: string, confidence: number) => void;
  onGuess: (label: string, confidence: number) => void;
  onSkip?: () => void;
}) {
  const sketchContainerRef = useRef<HTMLDivElement>(null);
  const classifierRef = useRef<any>(null);

  useEffect(() => {
    let p5Instance: any = null;

    const initSketch = () => {
      const sketch = (p: any) => {
        // const canvasSize = 280; // Fixed size for all devices

        p.preload = () => {
          classifierRef.current = window.ml5.imageClassifier("DoodleNet");
        };

        p.setup = () => {
          const canvas = p.createCanvas(280, 280);
          canvas.parent(sketchContainerRef.current);
          p.background(255);
          p.noFill();
          p.stroke(200);
          p.strokeWeight(2);
          p.rect(1, 1, 278, 278); // Draw border inside canvas

          const clearButton = document.getElementById("clear-button");
          clearButton?.addEventListener("click", () => p.background(255));
        };

        p.draw = () => {
          p.strokeWeight(15);
          p.stroke(0);
          if (p.mouseIsPressed) {
            p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
          }
          // Redraw border on every frame
          p.noFill();
          p.stroke(200);
          p.strokeWeight(2);
          p.rect(1, 1, 278, 278);
        };

        p.touchStarted = () => false;
        p.touchMoved = () => false;
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
      // Log the drawing submission
      console.log("Drawing submitted for guessing.", canvas);

      // Try to extract the pixel array from the canvas and log it
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // imageData.data is a Uint8ClampedArray of RGBA values
        // For terminal-friendly output, you might want to log a simplified version
        // For example, log a 2D array of grayscale values (0-255)
        const grayscaleArray: number[][] = [];
        for (let y = 0; y < canvas.height; y++) {
          const row: number[] = [];
          for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];
        // Simple average for grayscale
        const gray = Math.round((r + g + b) / 3);
        row.push(gray);
          }
          grayscaleArray.push(row);
        }
        console.log("Grayscale pixel array:", grayscaleArray);
      }

      classifierRef.current.classify(canvas, (error: any, results: any) => {
        if (error) {
          console.error(error);
          return;
        }

        const label = results[0].label.toLowerCase();
        const confidence = results[0].confidence;

        // Log the result of the guess
        console.log("Guess result:", { label, confidence });

        onGuess(label, confidence);

        if (label === targetWord) {
          onSuccess(label, confidence);
        }
      });
    }
  };

  const handleClear = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-row items-start justify-center">
        {/* Canvas */}
        <div
          id="sketch-container"
          ref={sketchContainerRef}
          className="flex justify-center items-center mb-2 border-2 border-gray-300 bg-white rounded"
          style={{ width: 280, height: 280, position: "relative", zIndex: 1 }}
        >
          {/* Canvas will be appended here */}
        </div>
        {/* Icon Buttons */}
        <div className="flex flex-col ml-2 space-y-2 mt-2 z-10">
          <button
            id="clear-button"
            onClick={handleClear}
            aria-label="Clear Canvas"
            className="p-2 bg-gray-200 rounded-full hover:bg-red-200 transition"
            type="button"
          >
            <RxEraser className="w-6 h-6 text-gray-700" />
          </button>
          {onSkip && (
            <button
              onClick={onSkip}
              aria-label="Skip"
              className="p-2 bg-gray-200 rounded-full hover:bg-blue-200 transition"
              type="button"
            >
              <MdSkipNext className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </div>
      </div>
      {/* Guess Button below canvas */}
      <button
        onClick={handleGuess}
        className="mt-3 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all z-10"
        type="button"
      >
        Guess
      </button>
    </div>
  );
}