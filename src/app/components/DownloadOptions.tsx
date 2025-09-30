"use client";
import { useState } from "react";

export default function DownloadOptions({ videoInfo, onDownload, disabled = false, compact = false }) {
  const [selectedFormat, setSelectedFormat] = useState("mp4");
  const [selectedQuality, setSelectedQuality] = useState("");

  const videoQualities = ['144p', '240p', '360p', '480p', '720p', '1080p'];
  const audioQualities = ['64K', '128K', '192K', '320K'];

  const handleDownload = () => {
    const defaultQuality = selectedFormat === "mp3" ? "128K" : "360p";
    onDownload(selectedFormat, selectedQuality || defaultQuality);
  };

  return (
    <div className={compact ? "" : "bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl"}>
      {!compact && (
        <h3 className="text-3xl font-bold text-white mb-8 text-center">
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Download Options
          </span>
        </h3>
      )}

      {/* Format Selection */}
      <div className={compact ? "mb-6" : "mb-8"}>
        <label className={`block font-bold text-white ${compact ? "text-lg mb-4" : "text-xl mb-6"}`}>
          Pilih Format:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="relative cursor-pointer group">
            <input
              type="radio"
              value="mp4"
              checked={selectedFormat === "mp4"}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="sr-only"
            />
            <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedFormat === "mp4" 
                ? "bg-blue-500/20 border-blue-400 shadow-lg" 
                : "bg-white/5 border-white/20 hover:bg-blue-500/10 hover:border-blue-400/50"
            }`}>
              <div className="text-center">
                <div className="text-3xl mb-2">🎥</div>
                <div className="text-lg font-semibold text-white">Video (MP4)</div>
                <div className="text-sm text-gray-300">Dengan audio</div>
              </div>
            </div>
          </label>
          
          <label className="relative cursor-pointer group">
            <input
              type="radio"
              value="mp3"
              checked={selectedFormat === "mp3"}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="sr-only"
            />
            <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedFormat === "mp3" 
                ? "bg-purple-500/20 border-purple-400 shadow-lg" 
                : "bg-white/5 border-white/20 hover:bg-purple-500/10 hover:border-purple-400/50"
            }`}>
              <div className="text-center">
                <div className="text-3xl mb-2">🎧</div>
                <div className="text-lg font-semibold text-white">Audio (MP3)</div>
                <div className="text-sm text-gray-300">Hanya suara</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Quality Selection */}
      <div className={compact ? "mb-6" : "mb-8"}>
        <label className={`block font-bold text-white ${compact ? "text-lg mb-4" : "text-xl mb-6"}`}>
          Pilih Kualitas:
        </label>
        <select
          value={selectedQuality}
          onChange={(e) => setSelectedQuality(e.target.value)}
          className="w-full px-6 py-4 text-lg text-white bg-white/10 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
        >
          {selectedFormat === "mp3" 
            ? audioQualities.map((quality) => (
                <option key={quality} value={quality} className="bg-gray-800">
                  {quality} (Audio Bitrate)
                </option>
              ))
            : videoQualities.map((quality) => (
                <option key={quality} value={quality} className="bg-gray-800">
                  {quality}
                </option>
              ))
          }
        </select>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={disabled}
        className="w-full py-5 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 cursor-pointer disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
      >
        {disabled ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <span>⬇️</span>
            Download {selectedFormat.toUpperCase()}
          </div>
        )}
      </button>
    </div>
  );
}
