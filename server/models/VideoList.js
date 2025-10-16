import { sequelize } from "./index.js";
import { DataTypes } from "sequelize";

export const VideoList = sequelize.define("VideoList", {
  title: { type: DataTypes.STRING, allowNull: false },
  videoId: { type: DataTypes.STRING, allowNull: false },
  thumbnail: { type: DataTypes.STRING, allowNull: false },
  status: {
    type: DataTypes.ENUM("belum", "selesai"),
    defaultValue: "belum",
  },
});
