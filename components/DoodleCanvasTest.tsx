"use client";

import { useEffect, useRef } from "react";
import { MdSkipNext } from "react-icons/md";
import { RxEraser } from "react-icons/rx";

export default function DoodleCanvas({
  targetWord,
  onSuccess,
  onGuess,
  onSkip,
  vocabularies = [],
  onTopGuesses,
}: {
  targetWord: string;
  onSuccess: (label: string, confidence: number) => void;
  onGuess: (label: string, confidence: number) => void;
  onSkip?: () => void;
  vocabularies?: string[];
  onTopGuesses?: (guesses: { label: string; confidence: number }[]) => void;
}) {
  const sketchContainerRef = useRef<HTMLDivElement>(null);
  const classifierRef = useRef<any>(null); // To store the classifier instance
  const p5InstanceRef = useRef<any>(null); // Store p5 instance for clearing

  useEffect(() => {
    let p5Instance: any = null;

    // Prevent loading scripts and classifier multiple times
    const loadMl5AndP5 = async () => {
      // Only load p5.js if not already loaded
      if (!window.p5) {
        await new Promise<void>((resolve) => {
          const p5Script = document.createElement("script");
          p5Script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.min.js";
          p5Script.async = true;
          p5Script.onload = () => resolve();
          document.body.appendChild(p5Script);
        });
      }
      // Only load ml5.js if not already loaded
      if (!window.ml5) {
        await new Promise<void>((resolve) => {
          const ml5Script = document.createElement("script");
          ml5Script.src = "https://unpkg.com/ml5@0.12.2/dist/ml5.min.js";
          ml5Script.async = true;
          ml5Script.onload = () => resolve();
          document.body.appendChild(ml5Script);
        });
      }
    };

    const initSketch = () => {
      // Guard: Clear any existing canvas in the container before creating a new one
      if (sketchContainerRef.current) {
        sketchContainerRef.current.innerHTML = "";
      }
      const sketch = (p: any) => {
        p.preload = () => {
          // Only create classifier if not already created
          if (!classifierRef.current) {
            classifierRef.current = window.ml5.imageClassifier("DoodleNet");
          }
        };

        p.setup = () => {
          const canvas = p.createCanvas(280, 280);
          canvas.parent(sketchContainerRef.current);
          p.background(255);
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
      p5InstanceRef.current = p5Instance;
    };

    loadMl5AndP5().then(() => {
      initSketch();
    });

    return () => {
      // Ensure p5 instance is always removed
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
      p5InstanceRef.current = null;
      // Always reset classifier so model reloads on next mount
      classifierRef.current = null;
      // Manually clear the sketch container
      if (sketchContainerRef.current) {
        sketchContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  // Clear canvas handler using p5 instance
  const handleClear = () => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.background(255);
    }
  };

  const handleGuess = () => {
    const canvas = document.querySelector("canvas");
    if (canvas && classifierRef.current) {
      classifierRef.current.classify(canvas, (error: any, results: any) => {
        if (error) {
          console.error(error);
          // No predictions found, send empty guess to parent
          if (onTopGuesses) onTopGuesses([]);
          onGuess("", 0);
          return;
        }

        // Normalize function to convert to doodlenet label format (lowercase, hyphens)
        const normalize = (str: string) =>
          str.trim().toLowerCase().replace(/[\s_]+/g, "-");

        // Only allow guesses within vocabularies (case-insensitive), skip "camouflage" and "syringe"
        const vocabSet = new Set(
          vocabularies.map((v) => normalize(v))
        );
        const excludedWords = new Set(["camouflage", "syringe"]);
        const filtered = results.filter(
          (r: any) =>
            !excludedWords.has(normalize(r.label)) &&
            vocabSet.has(normalize(r.label))
        );

        // Log the top 3 guesses with their confidence
        const top3 = filtered.slice(0, 3).map((r: any) => ({
          label: r.label,
          confidence: r.confidence,
        }));
        console.log("Top 3 guesses:", top3);

        // Call onTopGuesses if provided
        if (onTopGuesses) {
          onTopGuesses(top3);
        }

        let label = "...";
        let confidence = 0;
        if (filtered.length > 0) {
          label = filtered[0].label.toLowerCase();
          confidence = filtered[0].confidence;
        } else {
          // No predictions found, send empty guess to parent
          onGuess("", 0);
          return;
        }

        // Log guess result
        console.log(`Guess: ${label}, Confidence: ${confidence.toFixed(2)}`);

        // Call onGuess callback to update UI
        onGuess(label, confidence);

        // Normalize both label and targetWord for comparison (handle "ice cream" vs "ice-cream")
        if (normalize(label) === normalize(targetWord)) {
          // Trigger success callback
          onSuccess(label, confidence);
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-start mb-4">
        <div
          id="sketch-container"
          ref={sketchContainerRef}
          className="flex justify-center items-center"
        >
          {/* The canvas will be appended here */}
        </div>
        {/* Skip and Clear Canvas vertically on the right */}
        <div className="flex flex-col space-y-2 ml-2">
          {onSkip && (
            <button
              onClick={onSkip}
              className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center"
              type="button"
              aria-label="Skip"
            >
              <MdSkipNext size={24} />
            </button>
          )}
          <button
            id="clear-button"
            onClick={handleClear}
            className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition-all flex items-center justify-center"
            type="button"
            aria-label="Clear Canvas"
          >
            <RxEraser size={24} />
          </button>
        </div>
      </div>
      {/* Guess button at the bottom */}
      <button
        onClick={handleGuess}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all mt-2"
        type="button"
      >
        Guess
      </button>
    </div>
  );
}