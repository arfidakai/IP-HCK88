import express from "express";
import { VideoList } from "../models/VideoList.js";

const router = express.Router();

router.get("/list", async (_, res) => {
  const list = await VideoList.findAll({ order: [["createdAt", "DESC"]] });
  res.json(list);
});

router.post("/list", async (req, res) => {
  const { title, videoId, thumbnail } = req.body;
  const video = await VideoList.create({ title, videoId, thumbnail });
  res.json(video);
});

router.delete("/list/:id", async (req, res) => {
  await VideoList.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
