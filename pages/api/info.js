import youtubedl from 'youtube-dl-exec';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes('youtube.com')) {
    return res.status(400).json({ error: "URL YouTube tidak valid" });
  }

  try {
    const info = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
    });

    const videoInfo = {
      title: info.title,
      duration: info.duration,
      channel: info.uploader,
      thumbnail: info.thumbnail,
      formats: info.formats?.slice(0, 5).map(f => ({
        qualityLabel: f.height ? `${f.height}p` : 'audio',
        hasVideo: f.vcodec !== 'none',
        hasAudio: f.acodec !== 'none',
        container: f.ext,
      })) || []
    };

    res.status(200).json(videoInfo);
  } catch (error) {
    console.error("Error fetching video info:", error);
    res.status(500).json({ error: "Gagal mengambil info video" });
  }
}