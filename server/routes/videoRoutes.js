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
    const { data } = await axios.get(`${YT_API}/videos`, {
      params: {
        part: "snippet",
        chart: "mostPopular",
        regionCode: "US",
        videoCategoryId: "28",
        maxResults: 10,
        key: YT_KEY,
        pageToken: pageToken || "",
      },
    });

    const videos = data.items.map((v) => ({
      videoId: v.id,
      title: v.snippet.title,
      thumbnail: v.snippet.thumbnails.medium.url,
    }));

    res.json({
      videos,
      nextPageToken: data.nextPageToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load trending videos" });
  }
});

export default router;
