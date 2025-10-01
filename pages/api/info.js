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
    console.log('🔍 Starting video info fetch for:', url);
    
    // Check if youtube-dl-exec is available
    try {
      const { execSync } = require('child_process');
      const pythonCheck = execSync('python3 --version', { encoding: 'utf8' });
      const ffmpegCheck = execSync('ffmpeg -version', { encoding: 'utf8' });
      const ytdlpCheck = execSync('yt-dlp --version', { encoding: 'utf8' });
      console.log('✅ Dependencies check:', { python: pythonCheck.trim(), ffmpeg: 'OK', ytdlp: ytdlpCheck.trim() });
    } catch (depError) {
      console.error('❌ Dependencies missing:', depError.message);
    }
    
    // Test if youtube-dl-exec is available
    let info = await Promise.race([
      youtubedl(url, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        skipDownload: true,
        quiet: false, // Enable output for debugging
        noPlaylist: true,
        listFormats: false,
        // Railway specific options
        preferFreeFormats: true,
        youtubeSkipDashManifest: true
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 30000)
      )
    ]);
    
    console.log('📊 Raw youtube-dl response:', typeof info);
    
    // Parse JSON if response is string
    if (typeof info === 'string') {
      try {
        // Extract JSON from youtube-dl output
        const jsonMatch = info.match(/\{.*\}$/s);
        if (jsonMatch) {
          info = JSON.parse(jsonMatch[0]);
          console.log('✅ Successfully parsed JSON from string response');
        } else {
          throw new Error('No JSON found in string response');
        }
      } catch (parseError) {
        console.log('❌ Failed to parse JSON:', parseError.message);
        throw new Error(`Failed to parse youtube-dl response: ${parseError.message}`);
      }
    }
    
    // Check if info is valid object
    if (!info || typeof info !== 'object') {
      throw new Error(`Invalid youtube-dl response: ${typeof info}`);
    }
    
    console.log('📊 Parsed info object keys:', Object.keys(info));
    
    console.log('📋 Video info extracted:', {
      title: info.title,
      duration: info.duration,
      uploader: info.uploader
    });
    
    const videoInfo = {
      title: info.title || info._title || 'Unknown Title',
      duration: info.duration || info._duration || 0,
      channel: info.uploader || info.channel || info._uploader || 'Unknown Channel',
      thumbnail: info.thumbnail || info.thumbnails?.[0]?.url || '',
      formats: [
        { qualityLabel: "720p", hasVideo: true, hasAudio: true },
        { qualityLabel: "480p", hasVideo: true, hasAudio: true },
        { qualityLabel: "360p", hasVideo: true, hasAudio: true },
        { qualityLabel: "audio", hasVideo: false, hasAudio: true }
      ]
    };
    
    console.log('✅ Processed video info:', videoInfo);

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
    console.error("❌ Error fetching video info:", error.message);
    console.error("❌ Full error:", error);
    
    // More specific error messages
    let errorMessage = "Gagal mengambil info video";
    if (error.message.includes('youtube-dl')) {
      errorMessage = "YouTube downloader tidak tersedia di server";
    } else if (error.message.includes('Timeout')) {
      errorMessage = "Request timeout - coba lagi";
    } else if (error.message.includes('Private video')) {
      errorMessage = "Video private atau tidak tersedia";
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}