export default function VideoInfo({ videoInfo }) {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/10 rounded-2xl p-8 mb-8 border border-white/20 shadow-xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative group">
          <img
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
            className="w-full md:w-64 h-48 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {videoInfo.title}
          </h2>
          <div className="flex flex-wrap gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-lg">Durasi: {formatDuration(videoInfo.duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-lg">Channel: {videoInfo.channel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
