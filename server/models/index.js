import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

let sequelize;

if (process.env.NODE_ENV === "test") {
  console.log("🧪 Running tests with SQLite (in-memory) database...");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
} else if (process.env.DATABASE_URL) {
  console.log("🚀 Connecting to Supabase PostgreSQL...");
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  });
} else {
  throw new Error("❌ DATABASE_URL tidak ditemukan di .env");
}

export { sequelize };
