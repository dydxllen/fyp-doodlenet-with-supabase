import DoodleNet from "./DoodleNet";

export default function SketchPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Doodle Classification</h1>
      <DoodleNet />
    </div>
  );
}