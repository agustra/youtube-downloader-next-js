import youtubedl from 'youtube-dl-exec';
import archiver from 'archiver';
import path from 'path';
import os from 'os';
import { unlink } from 'fs/promises';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { urls, format, quality } = req.body;

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: "URLs array required" });
  }

  const tempDir = os.tmpdir();
  const batchId = `batch_${Date.now()}`;
  const downloadedFiles = [];

  try {
    // Download all files
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const filename = `${batchId}_${i}`;
      const outputPath = path.join(tempDir, filename);

      // Get video info first
      const info = await youtubedl(url, { dumpSingleJson: true });
      const videoTitle = info.title.replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 50);

      let options;
      if (format === "mp3") {
        const audioQuality = {
          '64K': '64K', '128K': '128K', '192K': '192K', '320K': '320K'
        }[quality] || '128K';
        
        options = {
          extractAudio: true,
          audioFormat: 'mp3',
          audioQuality: audioQuality,
          format: 'bestaudio',
          output: `${outputPath}.%(ext)s`
        };
      } else {
        const videoFormat = {
          '144p': 'worst[height<=144]', '240p': 'worst[height<=240]', 
          '360p': 'worst[height<=360]', '480p': 'worst[height<=480]',
          '720p': 'best[height<=720]', '1080p': 'best[height<=1080]'
        }[quality] || 'worst[height<=360]';
        
        options = {
          format: videoFormat,
          output: `${outputPath}.%(ext)s`
        };
      }

      await youtubedl(url, options);

      // Find downloaded file
      const fs = require('fs');
      const files = fs.readdirSync(tempDir).filter(f => f.startsWith(filename));
      if (files.length > 0) {
        downloadedFiles.push({
          path: path.join(tempDir, files[0]),
          title: videoTitle
        });
      }
    }

    // Create ZIP archive
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="batch_download.zip"`);
    
    archive.pipe(res);

    // Add files to archive
    downloadedFiles.forEach((fileInfo, index) => {
      const ext = format === 'mp3' ? 'mp3' : 'mp4';
      const filename = `${fileInfo.title}.${ext}`;
      archive.file(fileInfo.path, { name: filename });
    });

    await archive.finalize();

    // Cleanup files
    for (const fileInfo of downloadedFiles) {
      try {
        await unlink(fileInfo.path);
      } catch (err) {
        console.error('Cleanup error:', err);
      }
    }

  } catch (error) {
    console.error("Batch download error:", error);
    res.status(500).json({ error: "Batch download failed" });
  }
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};