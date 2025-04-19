"use client";

import { useEffect, useRef } from "react";

export default function DoodleCanvas() {
  const sketchContainerRef = useRef<HTMLDivElement>(null); // Reference to the container div

  useEffect(() => {
    let p5Instance: any = null;

    const initSketch = () => {
      const sketch = (p: any) => {
        let classifier: any;

        p.preload = () => {
          classifier = window.ml5.imageClassifier("DoodleNet");
        };

        p.setup = () => {
          // Create the canvas and append it to the container
          const canvas = p.createCanvas(280, 280);
          canvas.parent(sketchContainerRef.current); // Append the canvas to the container div
          p.background(255);

          // Add event listener for the clear button
          const clearButton = document.getElementById("clear-button");
          clearButton?.addEventListener("click", () => p.background(255));

          // Add mouseReleased event to classify the canvas
          canvas.mouseReleased(() => {
            classifier.classify(canvas, (error: any, results: any) => {
              if (error) {
                console.error(error);
                return;
              }
              document.getElementById("label")!.innerText = `Label: ${results[0].label}`;
              document.getElementById("confidence")!.innerText = `Confidence: ${p.nf(
                results[0].confidence,
                0,
                2
              )}`;
            });
          });
        };

        p.draw = () => {
          p.strokeWeight(15);
          p.stroke(0);
          if (p.mouseIsPressed) {
            p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
          }
        };
      };

      p5Instance = new window.p5(sketch);
    };

    // Load scripts dynamically
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
      // Cleanup the p5 instance when the component unmounts
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, []);

  return (
    <div
      id="sketch-container"
      ref={sketchContainerRef}
      className="flex justify-center items-center"
    >
      {/* The canvas will be appended here */}
    </div>
  );
}