# YouTube Downloader

Modern web application untuk download video dan audio dari YouTube dengan UI yang elegan dan fitur lengkap.

## ✨ Features

- 🎥 **Video Download** - Download video dalam berbagai kualitas (144p - 1080p)
- 🎵 **Audio Download** - Extract audio ke MP3 dengan kualitas pilihan (64K - 320K)
- 📦 **Batch Download** - Download multiple videos sekaligus dalam ZIP
- 🎨 **Modern UI** - Glassmorphism design dengan dark theme
- 📱 **Responsive** - Mobile-friendly interface
- ⚡ **Fast** - Optimized performance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm atau yarn

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd youtube-downloader-next-js
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Downloader**: youtube-dl-exec
- **Archive**: archiver (untuk batch download)

## 📖 Usage

### Single Download
1. Paste YouTube URL
2. Click "Analisis" untuk get video info
3. Pilih format (MP3/MP4) dan kualitas
4. Click "Download"

### Batch Download
1. Click "Batch Download Multiple Videos"
2. Paste multiple URLs (satu per baris)
3. Pilih "Download All as MP3" atau "Download All as MP4"
4. Download ZIP file berisi semua video/audio

## 🚧 Deployment

**Note**: Aplikasi ini tidak bisa di-deploy ke Vercel karena:
- Binary dependencies (youtube-dl-exec)
- File system operations
- Long execution time

### Recommended Deployment:
- **Railway** - Support binary dependencies
- **VPS** - Full control dengan Docker
- **DigitalOcean App Platform** - Custom binaries support

## 📝 License

MIT License - Gunakan dengan bijak dan patuhi ToS YouTube.