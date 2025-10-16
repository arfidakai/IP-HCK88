import express from "express";
import axios from "axios";

const router = express.Router();
const YT_API = "https://www.googleapis.com/youtube/v3";
const YT_KEY = process.env.YOUTUBE_API_KEY;

router.post("/recommend", async (req, res) => {
  const { interest } = req.body;
  try {
    const { data } = await axios.get(`${YT_API}/search`, {
      params: {
        part: "snippet",
        q: `${interest} tutorial programming`,
        maxResults: 9,
        type: "video",
        key: YT_KEY,
      },
    });

    const videos = data.items.map((v) => ({
      videoId: v.id.videoId,
      title: v.snippet.title,
      thumbnail: v.snippet.thumbnails.medium.url,
    }));

    res.json({ videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

router.get("/trending", async (req, res) => {
  const { pageToken } = req.query;
  try {
    const { data } = await axios.get(`${YT_API}/search`, {
      params: {
        part: "snippet",
        q: "programming tutorial OR web development OR backend development OR frontend development OR data science OR python tutorial OR machine learning course OR cloud computing OR devops tutorial",
        type: "video",
        maxResults: 1000,
        order: "viewCount",
        regionCode: "US",
        key: YT_KEY,
        pageToken: pageToken || "",
      },
    });

    const videos = data.items
      .filter((v) => !v.snippet.title.toLowerCase().includes("shorts"))
      .map((v) => ({
        videoId: v.id.videoId,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails.medium.url,
      }));

    res.json({
      videos,
      nextPageToken: data.nextPageToken,
    });
  } catch (err) {
    console.error("🔥 Failed to fetch trending tech videos:", err.message);
    res.status(500).json({ error: "Failed to load trending videos" });
  }
});

export default router;
