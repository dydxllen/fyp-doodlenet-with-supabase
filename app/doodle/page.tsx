import DoodleCanvas from "@/components/DoodleCanvas";
import Navbar from "@/components/Navbar";

export default function DoodlePage() {
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
              Apple
            </h2>
            <div className="border-2 border-gray-300 flex items-center justify-center h-64">
              <p className="text-gray-500">Image sample</p>
            </div>
          </div>
          <div className="mt-4 w-full max-w-sm">
            <div className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg text-center">
              <p id="label" className="font-bold">Label: ...</p>
              <p id="confidence" className="text-sm">Confidence: ...</p>
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
              <DoodleCanvas />
            </div>
          </div>
          <div className="mt-4 w-full max-w-sm">
            <button
              id="clear-button"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
            >
              Clear Canvas
            </button>
          </div>
        </div>
      </main>

      {/* Footer: Drawing Tools */}
      <footer className="mt-8 w-full max-w-5xl px-4">
        <div className="flex justify-center items-center bg-gray-200 py-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <img
                src="/icons/pencil-icon.svg"
                alt="Pencil"
                className="w-8 h-8"
              />
              <p className="text-gray-600 text-sm">Pencil</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/icons/eraser-icon.svg"
                alt="Eraser"
                className="w-8 h-8"
              />
              <p className="text-gray-600 text-sm">Eraser</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}