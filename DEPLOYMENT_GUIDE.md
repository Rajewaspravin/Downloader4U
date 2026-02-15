# Deployment Guide - VidGrab Video Downloader

## Quick Start: Choose Your Deployment Method

### Option 1: Frontend Only (Easiest - No Backend)
- **Best for:** Testing, simple demo
- **Platforms:** Netlify, Vercel, GitHub Pages
- **Time:** 5 minutes
- **Cost:** Free
- ⚠️ **Note:** Video download won't work without backend

### Option 2: Frontend + Backend API
- **Best for:** Full functionality
- **Platforms:** Vercel, Railway, Render
- **Time:** 30 minutes
- **Cost:** Free tier available

### Option 3: Full Stack with VPS
- **Best for:** Maximum control
- **Platforms:** DigitalOcean, AWS, Linode
- **Time:** 1-2 hours
- **Cost:** $5-10/month

---

## 🚀 Option 1: Deploy Frontend Only (GitHub Pages)

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click "New Repository"
3. Name it: `vidgrab` or `video-downloader`
4. Make it **Public**
5. Click "Create repository"

### Step 2: Upload Files

```bash
# In your terminal/command prompt
git init
git add index.html README.md
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/vidgrab.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Source: Select **main** branch
4. Folder: Select **/ (root)**
5. Click **Save**

🎉 Your site will be live at: `https://YOUR-USERNAME.github.io/vidgrab/`

---

## 🚀 Option 2: Deploy to Netlify (Frontend Only - Easiest)

### Method A: Drag & Drop

1. Go to [Netlify](https://www.netlify.com/)
2. Sign up/Login
3. Click "Add new site" → "Deploy manually"
4. Drag `index.html` file
5. Done! You get a URL like: `https://random-name.netlify.app`

### Method B: Connect GitHub

1. Push code to GitHub (see Option 1)
2. On Netlify, click "Add new site" → "Import from Git"
3. Connect GitHub account
4. Select your repository
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: (leave empty or put `/`)
6. Click "Deploy"

### Add Custom Domain

1. Buy domain from Namecheap, GoDaddy, etc.
2. In Netlify: Domain Settings → Add custom domain
3. Update DNS records at your domain registrar
4. Wait for SSL certificate (automatic)

---

## 🚀 Option 3: Deploy to Vercel (Frontend + Optional Backend)

### For Frontend Only:

1. Go to [Vercel](https://vercel.com/)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Deploy settings:
   - Framework: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
6. Click "Deploy"

### For Frontend + Backend:

1. Create `api` folder in your project
2. Move `backend-example-nodejs.js` to `api/download.js`
3. Update code to work with Vercel serverless functions
4. Deploy same as above

**Example Vercel Serverless Function:**

Create `api/video-info.js`:
```javascript
const ytdl = require('ytdl-core');

export default async function handler(req, res) {
    const { url } = req.query;
    
    if (!ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    
    const info = await ytdl.getInfo(url);
    res.json({
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails[0].url
    });
}
```

---

## 🚀 Option 4: Deploy Backend to Railway

Railway is great for deploying Node.js backends.

### Step 1: Prepare Backend

1. Create new folder: `backend`
2. Copy `backend-example-nodejs.js` and `package.json`
3. Create `Procfile`:

```
web: node backend-example-nodejs.js
```

### Step 2: Deploy to Railway

1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway auto-detects Node.js
7. Click "Deploy"

### Step 3: Get Backend URL

Railway gives you a URL like: `https://your-app.railway.app`

### Step 4: Update Frontend

In `index.html`, update the fetch calls:

```javascript
// Change this
const API_URL = 'http://localhost:3000';

// To this
const API_URL = 'https://your-app.railway.app';
```

---

## 🚀 Option 5: Deploy to DigitalOcean (VPS)

For maximum control and scalability.

### Step 1: Create Droplet

1. Sign up at [DigitalOcean](https://www.digitalocean.com/)
2. Create Droplet:
   - Image: Ubuntu 22.04
   - Plan: Basic ($5/month)
   - Region: Choose closest to your audience
   - Authentication: SSH keys (recommended)

### Step 2: Connect to Server

```bash
ssh root@your-droplet-ip
```

### Step 3: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install nginx
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2
```

### Step 4: Deploy Application

```bash
# Clone your repository
git clone https://github.com/YOUR-USERNAME/vidgrab.git
cd vidgrab

# Install dependencies
npm install

# Start backend with PM2
pm2 start backend-example-nodejs.js --name vidgrab-api
pm2 save
pm2 startup
```

### Step 5: Configure Nginx

```bash
nano /etc/nginx/sites-available/vidgrab
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /root/vidgrab;
        index index.html;
        try_files $uri $uri/ =404;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/vidgrab /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 6: Add SSL (Free with Let's Encrypt)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## 🌐 Domain Configuration

### Point Domain to Your Site

#### For Netlify/Vercel:
1. Go to your DNS provider (Namecheap, GoDaddy, etc.)
2. Add DNS records:
   - Type: A
   - Name: @
   - Value: (provided by Netlify/Vercel)

#### For DigitalOcean/VPS:
1. Add A record:
   - Type: A
   - Name: @
   - Value: Your droplet IP
2. Add CNAME record:
   - Type: CNAME
   - Name: www
   - Value: your-domain.com

---

## 📊 Post-Deployment Checklist

### Essential Steps After Deployment:

- [ ] Test website on desktop
- [ ] Test website on mobile
- [ ] Test all download functionality
- [ ] Check all links work
- [ ] Verify AdSense code is present
- [ ] Set up Google Analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Test site speed with PageSpeed Insights
- [ ] Set up monitoring (UptimeRobot)
- [ ] Create backup system
- [ ] Test SSL certificate

### SEO Setup:

1. **Google Search Console**
   - Add property
   - Verify ownership
   - Submit sitemap

2. **Google Analytics**
   - Create property
   - Add tracking code
   - Set up goals

3. **Sitemap**
   - Create sitemap.xml
   - Submit to Google

---

## 🔧 Troubleshooting

### Frontend Not Loading?
- Check console for errors (F12)
- Verify file paths are correct
- Check HTTPS/HTTP issues

### Backend Not Working?
- Check server logs
- Verify API endpoint URLs
- Test with Postman/Insomnia
- Check CORS settings

### Ads Not Showing?
- Verify AdSense code is correct
- Wait 24-48 hours after adding code
- Check AdSense policy compliance
- Test in incognito mode

### Slow Performance?
- Enable Gzip compression
- Minify CSS/JS
- Optimize images
- Use CDN
- Enable caching

---

## 💰 Cost Breakdown

### Free Options:
- GitHub Pages: **$0/month**
- Netlify: **$0/month** (100GB bandwidth)
- Vercel: **$0/month** (100GB bandwidth)

### Paid Options:
- Railway: **$5-10/month**
- DigitalOcean: **$5/month** (basic droplet)
- Domain: **$10-15/year**
- SSL: **Free** (Let's Encrypt)

### Expected Costs for 10,000 visitors/day:
- Netlify/Vercel: **$0** (within free tier)
- Railway: **$5-10/month**
- DigitalOcean: **$10-20/month**
- Domain: **$10-15/year**

**Total: $15-30/month for full functionality**

---

## 🚀 Scaling Tips

### As Your Traffic Grows:

**0-1,000 visitors/day:**
- Free tier hosting (Netlify/Vercel)
- GitHub Pages

**1,000-10,000 visitors/day:**
- Railway or Vercel Pro
- Basic DigitalOcean droplet

**10,000-100,000 visitors/day:**
- DigitalOcean with load balancer
- Cloudflare CDN
- Database for caching

**100,000+ visitors/day:**
- Multiple servers
- Redis caching
- CDN for static assets
- Consider AWS/Azure

---

## 📚 Additional Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

## 🎯 Recommended Path

**For Beginners:**
1. Deploy frontend to Netlify (5 minutes)
2. Test and add content
3. Apply for AdSense
4. Add backend later when needed

**For Full Functionality:**
1. Deploy frontend to Vercel
2. Deploy backend to Railway
3. Connect custom domain
4. Add AdSense
5. Set up analytics

**For Production:**
1. Buy domain
2. Deploy to DigitalOcean
3. Set up SSL
4. Configure CDN
5. Implement monitoring
6. Set up backups

Choose based on your technical skills and requirements! 🚀
