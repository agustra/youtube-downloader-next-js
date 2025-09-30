import { useState } from "react";

export default function BatchDownload({ onBatchDownload, disabled }) {
  const [urls, setUrls] = useState("");
  const [showBatch, setShowBatch] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("mp3");
  const [selectedQuality, setSelectedQuality] = useState("");

  const audioQualities = ['64K', '128K', '192K', '320K'];
  const videoQualities = ['144p', '240p', '360p', '480p', '720p', '1080p'];

  const handleBatchDownload = () => {
    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url && url.includes('youtube.com'));
    
    if (urlList.length === 0) {
      alert('Masukkan minimal 1 URL YouTube yang valid');
      return;
    }

    const defaultQuality = selectedFormat === "mp3" ? "128K" : "360p";
    onBatchDownload(urlList, selectedFormat, selectedQuality || defaultQuality);
  };

  if (!showBatch) {
    return (
      <div className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl mb-8">
        <button
          onClick={() => setShowBatch(true)}
          className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          📦 Batch Download Multiple Videos
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Batch Download
          </span>
        </h3>
        <button
          onClick={() => setShowBatch(false)}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          ✕
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-white mb-3">
          YouTube URLs (satu per baris):
        </label>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder={`https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://www.youtube.com/watch?v=9bZkp7q19f0
https://www.youtube.com/watch?v=kJQP7kiw5Fk`}
          className="w-full h-32 px-4 py-3 text-white placeholder-gray-300 bg-white/10 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 resize-none"
        />
        <p className="text-sm text-gray-300 mt-2">
          {urls.split('\n').filter(url => url.trim() && url.includes('youtube.com')).length} URL valid
        </p>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-white mb-4">
          Format:
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="relative cursor-pointer group">
            <input
              type="radio"
              value="mp3"
              checked={selectedFormat === "mp3"}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="sr-only"
            />
            <div className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
              selectedFormat === "mp3" 
                ? "bg-purple-500/20 border-purple-400 shadow-lg" 
                : "bg-white/5 border-white/20 hover:bg-purple-500/10 hover:border-purple-400/50"
            }`}>
              <div className="text-2xl mb-1">🎵</div>
              <div className="text-white font-semibold">MP3</div>
            </div>
          </label>
          
          <label className="relative cursor-pointer group">
            <input
              type="radio"
              value="mp4"
              checked={selectedFormat === "mp4"}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="sr-only"
            />
            <div className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
              selectedFormat === "mp4" 
                ? "bg-blue-500/20 border-blue-400 shadow-lg" 
                : "bg-white/5 border-white/20 hover:bg-blue-500/10 hover:border-blue-400/50"
            }`}>
              <div className="text-2xl mb-1">🎥</div>
              <div className="text-white font-semibold">MP4</div>
            </div>
          </label>
        </div>
      </div>

      {/* Quality Selection */}
      <div className="mb-6">
        <label className="block text-lg font-semibold text-white mb-4">
          Kualitas:
        </label>
        <select
          value={selectedQuality}
          onChange={(e) => setSelectedQuality(e.target.value)}
          className="w-full px-4 py-3 text-white bg-white/10 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
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
        onClick={handleBatchDownload}
        disabled={disabled}
        className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
      >
        {disabled ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <span>📦</span>
            Download All as {selectedFormat.toUpperCase()}
          </div>
        )}
      </button>
    </div>
  );
}