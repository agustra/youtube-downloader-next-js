"use client";
import { useState } from "react";
import axios from "axios";
import VideoInfo from "./components/VideoInfo";
import DownloadOptions from "./components/DownloadOptions";
import BatchDownload from "./components/BatchDownload";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const fetchVideoInfo = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setVideoInfo(null); // Clear previous video info

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const response = await axios.get(
        `/api/info?url=${encodeURIComponent(url)}`,
        { 
          signal: controller.signal,
          timeout: 15000 
        }
      );
      
      clearTimeout(timeoutId);
      setVideoInfo(response.data);
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ECONNABORTED') {
        setError("Timeout - URL mungkin tidak valid atau server lambat.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Gagal mengambil info video. Pastikan URL valid.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchDownload = async (urlList, format, quality) => {
    setDownloading(true);
    setError("");
    
    try {
      const response = await axios.post('/api/batch-download', {
        urls: urlList,
        format,
        quality
      }, {
        responseType: 'blob',
        timeout: 600000, // 10 minutes for batch
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `batch_download_${format}.zip`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Batch download error:", err);
      setError("Batch download gagal. Coba lagi.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownload = async (format, quality) => {
    setDownloading(true);
    setError("");
    
    try {
      const response = await axios.get(
        `/api/download?url=${encodeURIComponent(url)}&format=${format}&quality=${quality}`,
        {
          responseType: "blob",
          timeout: 300000, // 5 minutes
        }
      );

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      
      const extension = format === "mp3" ? "mp3" : "mp4";
      const cleanTitle = videoInfo.title.replace(/[^a-zA-Z0-9 ]/g, "");
      link.download = `${cleanTitle}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download error:", err);
      setError("Download gagal. Coba lagi.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="relative inline-block">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight hover:scale-105 transition-transform duration-300">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              YouTube
            </span>
            <span className="text-white"> Downloader</span>
          </h1>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-lg blur opacity-20 animate-pulse"></div>
        </div>
        <p className="text-xl text-gray-300 animate-fade-in-delay">Download video dan audio berkualitas tinggi</p>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto">
        {/* Input Section */}
        <div className="bg-white/10 rounded-2xl p-8 mb-8 border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 animate-slide-up">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste link YouTube di sini..."
              aria-label="YouTube URL input"
              className="flex-1 px-6 py-4 text-lg text-white placeholder-gray-300 bg-white/10 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/15 focus:scale-[1.02] transition-all duration-200"
              onKeyPress={(e) => e.key === "Enter" && fetchVideoInfo()}
            />
            <button
              onClick={fetchVideoInfo}
              disabled={loading || !url}
              aria-label="Analyze YouTube video"
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : "Analisis"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <p className="text-red-100 text-lg font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Video Info & Download Options */}
        {videoInfo && (
          <div className="bg-white/10 rounded-2xl p-8 mb-8 border border-white/20 shadow-xl">
            {/* Download Progress */}
            {downloading && (
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                  <div>
                    <p className="text-blue-100 font-semibold">Sedang memproses download...</p>
                    <p className="text-blue-200 text-sm">Mohon tunggu, proses ini membutuhkan waktu beberapa menit</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Video Info */}
              <div>
                <div className="relative group mb-6">
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-full h-48 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                  {videoInfo.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-lg">Durasi: {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-lg">Channel: {videoInfo.channel}</span>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    Download Options
                  </span>
                </h3>
                <DownloadOptions 
                  videoInfo={videoInfo} 
                  onDownload={handleDownload}
                  disabled={downloading}
                  compact={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="bg-white/10 rounded-2xl p-8 mb-8 border border-white/20 shadow-xl animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="bg-white/20 rounded-xl h-48 mb-6"></div>
                <div className="bg-white/20 rounded h-6 mb-4"></div>
                <div className="bg-white/20 rounded h-4 w-3/4"></div>
              </div>
              <div>
                <div className="bg-white/20 rounded h-8 mb-6 w-1/2"></div>
                <div className="space-y-4">
                  <div className="bg-white/20 rounded h-12"></div>
                  <div className="bg-white/20 rounded h-12"></div>
                  <div className="bg-white/20 rounded h-12"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!videoInfo && !loading && (
          <div className="bg-white/5 rounded-2xl p-12 mb-8 border border-white/10 text-center animate-fade-in hover:bg-white/10 transition-all duration-300">
            <div className="text-6xl mb-4 animate-bounce">🎬</div>
            <h3 className="text-2xl font-bold text-white mb-2">Siap untuk download?</h3>
            <p className="text-gray-300 text-lg mb-4">Paste URL YouTube di atas untuk memulai</p>
            <div className="flex justify-center gap-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}

        {/* Batch Download */}
        <BatchDownload 
          onBatchDownload={handleBatchDownload}
          disabled={downloading}
        />
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 animate-fade-in">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <p className="text-gray-300 text-sm mb-2">Dibuat dengan ❤️ menggunakan Next.js</p>
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <span>Fast</span>
            <span>•</span>
            <span>Secure</span>
            <span>•</span>
            <span>Free</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
