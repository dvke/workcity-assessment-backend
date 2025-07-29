const request = require("supertest");
const { app, server } = require("../server"); // Import server to close it after tests
const mongoose = require("mongoose");
const User = require("../models/User");
const Client = require("../models/Client");

describe("Client Endpoints", () => {
  let token;
  let userId;

  // Setup: Create a user and get a token before tests run
  beforeAll(async () => {
    // Use a test database
    process.env.MONGO_URI = "mongodb://localhost:27017/workcityTestDB_Client";
    await mongoose.connect(process.env.MONGO_URI);

    const testUser = {
      name: "Test User",
      email: "testuser.client@example.com",
      password: "password123",
      role: "user", // Test with a 'user' role
    };
    const res = await request(app)
      .post("/api/auth/signup")
      .send(testUser);
    token = res.body.token;

    const user = await User.findOne({ email: "testuser.client@example.com" });
    userId = user._id;
  });

  // Teardown: Clean up database and close server connection after tests
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    server.close();
  });

  // Test for creating a client
  describe("POST /api/clients", () => {
    it("should create a new client when authenticated", async () => {
      const newClient = {
        name: "Test Client Inc.",
        email: "contact@testclient.com",
        phone: "1234567890",
        address: "123 Test Street",
      };

      const res = await request(app)
        .post("/api/clients")
        .set("Authorization", `Bearer ${token}`)
        .send(newClient);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data.name).toBe(newClient.name);
      expect(res.body.data.email).toBe(newClient.email);
    });

    it("should return 401 if not authenticated", async () => {
      const newClient = {
        name: "Unauthorized Client",
        email: "contact@unauthorized.com",
        phone: "1234567890",
        address: "123 Test Street",
      };

      const res = await request(app)
        .post("/api/clients")
        .send(newClient);

      expect(res.statusCode).toEqual(401);
    });

    it("should return 400 for invalid data", async () => {
      const invalidClient = {
        name: "", // Name is required
        email: "not-an-email",
        phone: "123",
        address: "",
      };

      const res = await request(app)
        .post("/api/clients")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidClient);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeInstanceOf(Array);
    });
  });
});
