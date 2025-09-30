# 🚀 Deployment Guide

## Railway Deployment

### Prerequisites
1. Create Railway account: https://railway.app
2. Install Railway CLI: `npm install -g @railway/cli`
3. Get Railway token from dashboard

### Setup
1. **Connect Repository**:
   ```bash
   railway login
   railway init
   railway link
   ```

2. **Add Environment Variables** (if needed):
   ```bash
   railway variables set NODE_ENV=production
   ```

3. **Deploy**:
   ```bash
   railway up
   ```

### GitHub Actions Setup
1. Go to repository Settings → Secrets and variables → Actions
2. Add secret: `RAILWAY_TOKEN` with your Railway token
3. Push to main branch will auto-deploy

## Alternative Deployments

### VPS Deployment
```bash
# Clone repository
git clone https://github.com/agustra/youtube-downloader-next-js.git
cd youtube-downloader-next-js

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "youtube-downloader" -- start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Notes
- ❌ **Vercel**: Not supported (binary dependencies)
- ✅ **Railway**: Recommended (supports binaries)
- ✅ **VPS**: Full control
- ✅ **DigitalOcean**: App Platform supports custom binaries