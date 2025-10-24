import express from "express";
import { VideoList } from "../models/VideoList.js";

const router = express.Router();

// helper: ambil userId dari request (auth middleware atau fallback)
function getUserId(req) {
  return req.user?.id || req.body.userId || req.query.userId || null;
}

// === Get semua video untuk user ===
router.get("/list", async (req, res) => {
  try {
    console.log("📩 Body diterima dari frontend:", req.body);
    const { title, videoId, thumbnail, listName, userId } = req.body;

    if (!userId) {
      console.warn("⚠️ Tidak ada userId dikirim dari frontend");
      return res.status(400).json({ error: "userId diperlukan" });
    }

    const video = await VideoList.create({
      title,
      videoId,
      thumbnail,
      listName: listName || "Umum",
      status: "belum",
      userId, // <== ini yang benar-benar nyimpan userId
    });

    console.log("📩 Body diterima:", req.body);

    const list = await VideoList.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal ambil daftar" });
  }
});

// === Tambah video baru (terkait user) ===
router.post("/list", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ error: "userId required" });

    const { title, videoId, thumbnail, listName } = req.body;
    const video = await VideoList.create({
      title,
      videoId,
      thumbnail,
      listName: listName || "Umum",
      status: "belum",
      userId, // simpan pemilik
    });
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menambah video" });
  }
});

// === Update status (belum ↔ selesai) atau ubah list (cek kepemilikan) ===
router.put("/list/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ error: "userId required" });

    const { status, listName } = req.body;
    const video = await VideoList.findByPk(req.params.id);
    if (!video) return res.status(404).json({ error: "Video tidak ditemukan" });
    if (video.userId !== userId)
      return res.status(403).json({ error: "Akses ditolak" });

    if (status) video.status = status;
    if (listName) video.listName = listName;

    await video.save();
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal update video" });
  }
});

// === Hapus video (cek kepemilikan) ===
router.delete("/list/:id", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ error: "userId required" });

    const video = await VideoList.findByPk(req.params.id);
    if (!video) return res.status(404).json({ error: "Video tidak ditemukan" });
    if (video.userId !== userId)
      return res.status(403).json({ error: "Akses ditolak" });

    await VideoList.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal hapus video" });
  }
});

export default router;
