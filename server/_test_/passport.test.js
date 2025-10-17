import { jest } from "@jest/globals";

jest.unstable_mockModule("../models/User.js", () => ({
  User: {
    findOrCreate: jest.fn(),
    findByPk: jest.fn(),
  },
}));
const mockUse = jest.fn();
const mockSerialize = jest.fn();
const mockDeserialize = jest.fn();
jest.unstable_mockModule("passport", () => ({
  default: {
    use: mockUse,
    serializeUser: mockSerialize,
    deserializeUser: mockDeserialize,
  },
}));

const mockStrategy = jest.fn();
jest.unstable_mockModule("passport-google-oauth20", () => ({
  Strategy: mockStrategy,
}));

const { default: passport } = await import("passport");
const { Strategy: GoogleStrategy } = await import("passport-google-oauth20");
const { User } = await import("../models/User.js");
await import("../config/passport.js");

describe("🧩 Passport Google Strategy", () => {
  test("should register GoogleStrategy", () => {
    expect(mockUse).toHaveBeenCalled();
    expect(GoogleStrategy).toBeDefined();
  });

  test("should call findOrCreate when user logs in", async () => {
    const verifyCallback = mockStrategy.mock.calls[0][1];
    User.findOrCreate.mockResolvedValue([{ id: 1, email: "user@mail.com" }]);

    const done = jest.fn();
    const fakeProfile = {
      id: "g123",
      displayName: "Test User",
      emails: [{ value: "test@mail.com" }],
    };

    await verifyCallback("access", "refresh", fakeProfile, done);
    expect(User.findOrCreate).toHaveBeenCalledWith({
      where: { googleId: "g123" },
      defaults: { name: "Test User", email: "test@mail.com" },
    });
    expect(done).toHaveBeenCalledWith(null, { id: 1, email: "user@mail.com" });
  });

  test("should handle error in verify callback", async () => {
    const verifyCallback = mockStrategy.mock.calls[0][1];
    User.findOrCreate.mockRejectedValue(new Error("DB fail"));

    const done = jest.fn();
    await verifyCallback("a", "b", {}, done);
    expect(done).toHaveBeenCalledWith(expect.any(Error), null);
  });

  test("should serialize and deserialize user", async () => {
    const user = { id: 42 };
    const done = jest.fn();

    await passport.serializeUser.mock.calls[0][0](user, done);
    expect(done).toHaveBeenCalledWith(null, 42);

    User.findByPk.mockResolvedValue({ id: 42, name: "Test" });
    await passport.deserializeUser.mock.calls[0][0](42, done);
    expect(done).toHaveBeenCalledWith(null, { id: 42, name: "Test" });
  });
});
