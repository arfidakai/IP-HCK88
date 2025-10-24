import express from "express";
import { VideoList } from "../models/VideoList.js";

const router = express.Router();

// Ambil userId dari header/query/body (paling simpel)
function pickUserId(req) {
  return req.user?.id || req.query.userId || req.body.userId || null;
}

/**
 * GET /api/list
 * Ambil SEMUA video milik user yang diminta
 * Kirimkan userId via query (?userId=123)
 */
router.get("/list", async (req, res) => {
  try {
    const userId = pickUserId(req);
    if (!userId) return res.status(400).json({ error: "userId required" });

    const list = await VideoList.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    return res.json(list);
  } catch (err) {
    console.error("GET /list error:", err);
    return res.status(500).json({ error: "Gagal ambil daftar" });
  }
});

/**
 * POST /api/list
 * Tambah video milik user
 */
router.post("/list", async (req, res) => {
  try {
    const userId = pickUserId(req);
    if (!userId) return res.status(400).json({ error: "userId required" });

    const { title, videoId, thumbnail, listName } = req.body;
    const video = await VideoList.create({
      title,
      videoId,
      thumbnail,
      listName: listName || "Umum",
      status: "belum",
      userId,
    });
    return res.json(video);
  } catch (err) {
    console.error("POST /list error:", err);
    return res.status(500).json({ error: "Gagal menambah video" });
  }
});

/**
 * PUT /api/list/:id
 * Update status/listName, cek kepemilikan
 */
router.put("/list/:id", async (req, res) => {
  try {
    const userId = pickUserId(req);
    if (!userId) return res.status(400).json({ error: "userId required" });

    const { status, listName } = req.body;
    const video = await VideoList.findByPk(req.params.id);
    if (!video) return res.status(404).json({ error: "Video tidak ditemukan" });
    if (video.userId !== Number(userId))
      return res.status(403).json({ error: "Akses ditolak" });

    if (status) video.status = status;
    if (listName) video.listName = listName;

    await video.save();
    return res.json(video);
  } catch (err) {
    console.error("PUT /list/:id error:", err);
    return res.status(500).json({ error: "Gagal update video" });
  }
});

/**
 * DELETE /api/list/:id
 * Hapus, cek kepemilikan
 */
router.delete("/list/:id", async (req, res) => {
  try {
    const userId = pickUserId(req);
    if (!userId) return res.status(400).json({ error: "userId required" });

    const video = await VideoList.findByPk(req.params.id);
    if (!video) return res.status(404).json({ error: "Video tidak ditemukan" });
    if (video.userId !== Number(userId))
      return res.status(403).json({ error: "Akses ditolak" });

    await VideoList.destroy({ where: { id: req.params.id } });
    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE /list/:id error:", err);
    return res.status(500).json({ error: "Gagal hapus video" });
  }
});

export default router;
