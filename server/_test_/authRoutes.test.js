import { jest } from "@jest/globals";

const mockSequelize = jest.fn();
jest.unstable_mockModule("sequelize", () => ({
  Sequelize: mockSequelize,
}));

describe("🧩 Database Index Config", () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.DATABASE_URL;
    delete process.env.NODE_ENV;
  });

  test("should use SQLite when NODE_ENV=test", async () => {
    process.env.NODE_ENV = "test";
    await import("../models/index.js");

    expect(mockSequelize).toHaveBeenCalledWith({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
  });

  test("should use PostgreSQL when DATABASE_URL exists", async () => {
    process.env.DATABASE_URL = "postgres://fake:123@host/db";
    process.env.NODE_ENV = "production";
    await import("../models/index.js");

    expect(mockSequelize).toHaveBeenCalledWith(
      "postgres://fake:123@host/db",
      expect.objectContaining({
        dialect: "postgres",
        protocol: "postgres",
      })
    );
  });

  test("should throw error when DATABASE_URL missing", async () => {
    process.env.NODE_ENV = "development";
    await expect(import("../models/index.js")).rejects.toThrow(
      "DATABASE_URL tidak ditemukan di .env"
    );
  });
});
