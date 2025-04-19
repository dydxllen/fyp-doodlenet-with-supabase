// Extending the global Window interface to include p5 and ml5 properties.
// These are used for integrating the p5.js and ml5.js libraries into the project.
declare global {
    interface Window {
      p5: any;
      ml5: any;
    }
  }
  
export {};