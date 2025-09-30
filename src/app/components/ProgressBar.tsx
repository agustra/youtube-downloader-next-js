"use client";

export default function ProgressBar({ progress, isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-700">Downloading...</span>
        <span className="text-sm text-blue-600">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-blue-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}