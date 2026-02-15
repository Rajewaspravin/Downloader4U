# VidGrab - Video Downloader Website

A modern, responsive video downloader website supporting YouTube, Instagram, TikTok, Facebook, and other platforms with HD, Full HD, and 4K download options. Includes Google AdSense integration for monetization.

## Features

- ✅ Multi-platform support (YouTube, Instagram, TikTok, Facebook, Twitter, Vimeo, etc.)
- ✅ Multiple quality options (480p, 720p HD, 1080p Full HD, 4K Ultra HD)
- ✅ Responsive design (works on all devices)
- ✅ Google AdSense ready with placeholder positions
- ✅ Clean, modern UI with smooth animations
- ✅ Fast and user-friendly

## Google AdSense Integration

### Step 1: Apply for Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in with your Google account
3. Add your website URL and submit application
4. Wait for approval (usually 1-3 days)

### Step 2: Get Your AdSense Code

Once approved:

1. Log in to your AdSense account
2. Go to **Ads** → **Overview** → **By ad unit**
3. Click **+ New ad unit**
4. Create these ad units:
   - **Display ad** (728x90) - for top banner
   - **Display ad** (300x250) - for medium rectangle
   - **Display ad** (336x280) - for large rectangle

### Step 3: Replace Placeholder Code

In `index.html`, find sections marked with:
```html
<!-- Replace this div with your Google AdSense code -->
```

Replace with your actual AdSense code, which looks like:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### Ad Placement Locations

The website has 4 strategic ad placements:

1. **Top Banner** (728x90) - Below hero text, above download box
2. **Medium Rectangle** (300x250) - In quality selection area
3. **Large Rectangle** (336x280) - Below features section
4. You can add more in footer or sidebar

## Making the Downloader Functional

The current website is a **frontend demo**. To make it actually download videos, you need a **backend API**. Here are your options:

### Option 1: Use a Third-Party API

Popular APIs for video downloading:

1. **RapidAPI Video Downloader APIs**
   - Search "video downloader" on [RapidAPI](https://rapidapi.com/)
   - Popular options: All Video Downloader, Social Media Downloader
   - Usually require API key and have usage limits

2. **yt-dlp API Services**
   - Some providers offer yt-dlp as a service
   - Examples: Loader.to API, SaveFrom.net API

### Option 2: Build Your Own Backend (Recommended for Control)

**Requirements:**
- Server (VPS, AWS, DigitalOcean, etc.)
- Node.js or Python environment
- yt-dlp library

**Example with Node.js + yt-dlp:**

```javascript
// server.js
const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

app.get('/api/download', async (req, res) => {
    const { url, quality } = req.query;
    
    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality });
        
        res.header('Content-Disposition', `attachment; filename="video.mp4"`);
        ytdl(url, { format }).pipe(res);
    } catch (error) {
        res.status(400).json({ error: 'Invalid URL' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

**Example with Python + yt-dlp:**

```python
# app.py
from flask import Flask, request, send_file
import yt_dlp

app = Flask(__name__)

@app.route('/api/download')
def download():
    url = request.args.get('url')
    quality = request.args.get('quality')
    
    ydl_opts = {
        'format': f'best[height<={quality}]',
        'outtmpl': 'downloads/%(title)s.%(ext)s'
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = ydl.prepare_filename(info)
        return send_file(filename, as_attachment=True)

if __name__ == '__main__':
    app.run(port=5000)
```

### Option 3: Client-Side Only (Limited)

For YouTube only, you can use `ytdl-core` client-side, but this has limitations and may violate YouTube ToS.

## Deployment

### Free Hosting Options:

1. **Netlify** (frontend only)
   - Drag and drop `index.html`
   - Free SSL certificate
   - Custom domain support

2. **Vercel** (frontend + serverless backend)
   - Connect GitHub repo
   - Deploy with one click
   - Free tier available

3. **GitHub Pages** (frontend only)
   - Free hosting
   - Enable in repository settings

4. **Cloudflare Pages** (frontend)
   - Fast CDN
   - Free tier available

### For Full Backend:

1. **Railway.app** - Easy deployment for Node.js/Python
2. **Heroku** - Popular but has paid tiers
3. **DigitalOcean** - $5/month VPS
4. **AWS EC2** - Free tier for 12 months

## Legal Considerations

⚠️ **Important:** 

1. **Copyright**: Downloading copyrighted content without permission may be illegal
2. **Terms of Service**: Most platforms prohibit downloading their content
3. **Disclaimer**: Always include a disclaimer that users should only download content they have rights to
4. **DMCA**: Implement DMCA takedown procedures if hosting content

## Monetization Tips

1. **AdSense Optimization**:
   - Place ads above the fold
   - Use responsive ad units
   - Test different ad formats
   - Monitor performance in AdSense dashboard

2. **Additional Revenue**:
   - Affiliate links to video editing software
   - Premium features (faster downloads, no ads)
   - Sponsored content

3. **Traffic Generation**:
   - SEO optimization
   - Social media marketing
   - Content marketing (blog about video downloading)
   - YouTube tutorials

## SEO Optimization

The website includes:
- Meta descriptions
- Semantic HTML
- Mobile-responsive design
- Fast loading times

Consider adding:
- Sitemap.xml
- Robots.txt
- Blog section for content marketing
- Schema markup
- Social media meta tags

## Support

For issues or questions:
- Check Terms of Service of video platforms
- Ensure compliance with copyright laws
- Test thoroughly before launching
- Monitor AdSense policy compliance

## Files Included

- `index.html` - Main website file (fully functional frontend)
- `README.md` - This documentation

## Next Steps

1. ✅ Replace AdSense placeholders with real ad code
2. ✅ Choose and implement a backend solution
3. ✅ Deploy to hosting provider
4. ✅ Submit to Google AdSense
5. ✅ Test all functionality
6. ✅ Add analytics (Google Analytics)
7. ✅ Implement SEO best practices
8. ✅ Market your website

## License

This is a demo/template. Use at your own risk and ensure compliance with all applicable laws and platform terms of service.
