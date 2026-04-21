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
        maxResults: 50,
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
    const status = err?.response?.status;
    const payload = err?.response?.data;
    const reason = payload?.error?.errors?.[0]?.reason;
    const msg = payload?.error?.message || err.message || "Failed to load trending videos";
    console.error("🔥 Failed to fetch trending tech videos:", status, reason, msg);
    res.status(status || 500).json({ error: msg, reason, status });
  }
});

export default router;

// Diagnostics: simple ping to verify API key and quota
router.get("/youtube/ping", async (req, res) => {
  try {
    console.log("🔑 YT_KEY loaded:", YT_KEY ? `${YT_KEY.substring(0, 10)}...` : "MISSING");
    const { data } = await axios.get(`${YT_API}/search`, {
      params: {
        part: "snippet",
        q: "test",
        maxResults: 1,
        type: "video",
        key: YT_KEY,
      },
    });
    res.json({ ok: true, items: data.items?.length ?? 0 });
  } catch (err) {
    const status = err?.response?.status;
    const payload = err?.response?.data;
    const reason = payload?.error?.errors?.[0]?.reason;
    const msg = payload?.error?.message || err.message;
    console.error("❌ YouTube ping failed. Key present:", !!YT_KEY, "| Status:", status, "| Reason:", reason);
    res.status(status || 500).json({ ok: false, error: msg, reason, status, keyPresent: !!YT_KEY });
  }
});
