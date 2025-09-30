import youtubedl from 'youtube-dl-exec';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';
import os from 'os';
import { WebSocketServer } from 'ws';

// Global WebSocket server
let wss;
if (!global.wss) {
  global.wss = new WebSocketServer({ port: 8080 });
  wss = global.wss;
} else {
  wss = global.wss;
}

export default async function handler(req, res) {
  const { url, format, quality } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  const tempDir = os.tmpdir();
  const filename = `download_${Date.now()}`;
  const outputPath = path.join(tempDir, filename);

  try {
    let options;
    let contentType;
    let downloadFilename;

    if (format === "mp3") {
      const audioQuality = {
        '64K': '64K',
        '128K': '128K', 
        '192K': '192K',
        '320K': '320K'
      }[quality] || '128K';
      
      options = {
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: audioQuality,
        format: 'bestaudio',
        output: `${outputPath}.%(ext)s`
      };
      contentType = "audio/mpeg";
      downloadFilename = "audio.mp3";
    } else {
      const videoFormat = {
        '144p': 'worst[height<=144]',
        '240p': 'worst[height<=240]', 
        '360p': 'worst[height<=360]',
        '480p': 'worst[height<=480]',
        '720p': 'best[height<=720]',
        '1080p': 'best[height<=1080]'
      }[quality] || 'worst[height<=360]';
      
      options = {
        format: videoFormat,
        output: `${outputPath}.%(ext)s`
      };
      contentType = "video/mp4";
      downloadFilename = "video.mp4";
    }

    await youtubedl(url, options);

    // Find the actual file (extension might vary)
    const fs = require('fs');
    const files = fs.readdirSync(tempDir).filter(f => f.startsWith(filename));
    
    if (files.length === 0) {
      throw new Error('Download file not found');
    }

    const actualFile = path.join(tempDir, files[0]);
    
    res.setHeader("Content-Disposition", `attachment; filename="${downloadFilename}"`);
    res.setHeader("Content-Type", contentType);

    const stream = createReadStream(actualFile);
    stream.pipe(res);

    stream.on('end', async () => {
      try {
        await unlink(actualFile);
        
        // Cleanup player script cache files
        const fs = require('fs');
        const cacheFiles = fs.readdirSync('.').filter(f => f.includes('-player-script.js'));
        for (const file of cacheFiles) {
          try {
            await unlink(file);
          } catch (err) {
            // Ignore cleanup errors
          }
        }
      } catch (err) {
        console.error('Error deleting temp file:', err);
      }
    });

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Download failed" });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};