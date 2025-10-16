import { VideoList } from "./models/VideoList.js";
import { connectDB, sequelize } from "./models/index.js";

await connectDB();
await sequelize.sync({ alter: true });

await VideoList.bulkCreate([
  {
    title: "Learn JavaScript Basics",
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
  },
  {
    title: "Intro to React",
    videoId: "Ke90Tje7VS0",
    thumbnail: "https://img.youtube.com/vi/Ke90Tje7VS0/mqdefault.jpg",
  },
  {
    title: "Learn JavaScript Basics",
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
  },
  {
    title: "Intro to React",
    videoId: "Ke90Tje7VS0",
    thumbnail: "https://img.youtube.com/vi/Ke90Tje7VS0/mqdefault.jpg",
  },
]);

console.log("🌱 Seeded initial data!");
process.exit();
