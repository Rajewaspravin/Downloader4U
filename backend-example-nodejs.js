// backend-example-nodejs.js
// This is an example backend implementation using Node.js
// You'll need to install: npm install express ytdl-core cors

const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your frontend domain
app.use(cors({
    origin: 'https://your-domain.com' // Replace with your actual domain
}));

app.use(express.json());

// Get video info endpoint
app.get('/api/video-info', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate URL
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        // Get video info
        const info = await ytdl.getInfo(url);
        
        // Extract available formats
        const formats = info.formats
            .filter(format => format.hasVideo && format.hasAudio)
            .map(format => ({
                quality: format.qualityLabel,
                format: format.container,
                fileSize: format.contentLength,
                itag: format.itag
            }));

        // Remove duplicates and sort by quality
        const uniqueFormats = [...new Map(formats.map(item => [item.quality, item])).values()]
            .sort((a, b) => {
                const qualityOrder = { '2160p': 4, '1440p': 3, '1080p': 2, '720p': 1, '480p': 0, '360p': -1 };
                return (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0);
            });

        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            duration: info.videoDetails.lengthSeconds,
            author: info.videoDetails.author.name,
            formats: uniqueFormats
        });

    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).json({ error: 'Failed to fetch video information' });
    }
});

// Download video endpoint
app.get('/api/download', async (req, res) => {
    try {
        const { url, quality } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        // Get video info for filename
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

        // Set response headers
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        // Choose format based on quality
        let formatOptions = { quality: 'highest' };
        
        if (quality === '4k') {
            formatOptions = { quality: '2160p' };
        } else if (quality === '1080p') {
            formatOptions = { quality: '1080p' };
        } else if (quality === '720p') {
            formatOptions = { quality: '720p' };
        } else if (quality === '480p') {
            formatOptions = { quality: '480p' };
        }

        // Stream video to response
        ytdl(url, {
            format: 'mp4',
            ...formatOptions
        }).pipe(res);

    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).json({ error: 'Failed to download video' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for serverless deployment (Vercel, Netlify, etc.)
module.exports = app;
