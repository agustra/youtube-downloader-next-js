import youtubedl from 'youtube-dl-exec';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes('youtube.com')) {
    return res.status(400).json({ error: "URL YouTube tidak valid" });
  }

  // Check cache first
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.status(200).json(cached.data);
  }

  try {
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      skipDownload: true,
      quiet: true,
      noPlaylist: true,
      // Skip format extraction for speed
      listFormats: false
    });

    const videoInfo = {
      title: info.title || 'Unknown Title',
      duration: info.duration || 0,
      channel: info.uploader || info.channel || 'Unknown Channel',
      thumbnail: info.thumbnail || info.thumbnails?.[0]?.url || '',
      // Simplified formats - predefined options
      formats: [
        { qualityLabel: "720p", hasVideo: true, hasAudio: true },
        { qualityLabel: "480p", hasVideo: true, hasAudio: true },
        { qualityLabel: "360p", hasVideo: true, hasAudio: true },
        { qualityLabel: "audio", hasVideo: false, hasAudio: true }
      ]
    };

    // Cache the result
    cache.set(cacheKey, {
      data: videoInfo,
      timestamp: Date.now()
    });

    // Clean old cache entries
    if (cache.size > 100) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }

    res.status(200).json(videoInfo);
  } catch (error) {
    console.error("Error fetching video info:", error);
    res.status(500).json({ error: "Gagal mengambil info video" });
  }
}