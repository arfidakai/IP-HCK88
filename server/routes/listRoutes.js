import express from "express";
import { VideoList } from "../models/VideoList.js";

const router = express.Router();

// === Get semua video ===
router.get("/list", async (req, res) => {
  try {
    const list = await VideoList.findAll({ order: [["createdAt", "DESC"]] });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal ambil daftar" });
  }
});

// === Tambah video baru ===
router.post("/list", async (req, res) => {
  try {
    const { title, videoId, thumbnail, listName } = req.body;
    const video = await VideoList.create({
      title,
      videoId,
      thumbnail,
      listName: listName || "Umum",
      status: "belum",
    });
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menambah video" });
  }
});

// === Update status (belum ↔ selesai) atau ubah list ===
router.put("/list/:id", async (req, res) => {
  try {
    const { status, listName } = req.body;
    const video = await VideoList.findByPk(req.params.id);
    if (!video) return res.status(404).json({ error: "Video tidak ditemukan" });

    if (status) video.status = status;
    if (listName) video.listName = listName;

    await video.save();
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal update video" });
  }
});

// === Hapus video ===
router.delete("/list/:id", async (req, res) => {
  try {
    await VideoList.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal hapus video" });
  }
});

export default router;
