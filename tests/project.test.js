const request = require("supertest");
const { app, server } = require("../server");
const mongoose = require("mongoose");
const User = require("../models/User");
const Client = require("../models/Client");
const Project = require("../models/Project");

describe("Project Endpoints", () => {
  let adminToken;
  let testClient;
  let testProject;

  // Setup: Create an admin user, a client, and a project
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        "mongodb://localhost:27017/workcityTestDB_Project"
      );
    }

    const adminUser = {
      name: "Admin User",
      email: "admin.project@example.com",
      password: "password123",
      role: "admin",
    };
    const res = await request(app)
      .post("/api/auth/signup")
      .send(adminUser);
    adminToken = res.body.token;
    const admin = await User.findOne({ email: "admin.project@example.com" });

    // Create a client to associate with the project
    testClient = await Client.create({
      name: "Permanent Client",
      email: "permanent@client.com",
      phone: "5555555555",
      address: "456 Main St",
      createdBy: admin._id,
    });

    // Create a project to be updated
    testProject = await Project.create({
      name: "Initial Project Name",
      description: "Initial Description",
      status: "Not Started",
      clientId: testClient._id,
      createdBy: admin._id,
    });
  });

  // Teardown
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    server.close(); // Ensure server from this test file is closed
  });

  // Test for updating a project
  describe("PUT /api/projects/:id", () => {
    it("should update a project when authenticated as admin", async () => {
      const updatedData = {
        name: "Updated Project Name",
        description: "This description has been updated.",
        status: "In Progress",
        clientId: testClient._id, // Keep the same client
      };

      const res = await request(app)
        .put(`/api/projects/${testProject._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(updatedData.name);
      expect(res.body.data.status).toBe(updatedData.status);
    });

    it("should return 403 if a non-admin user tries to update", async () => {
      // Create a regular user
      const regularUser = {
        name: "Regular User",
        email: "regular.project@example.com",
        password: "password123",
        role: "user",
      };
      const userRes = await request(app)
        .post("/api/auth/signup")
        .send(regularUser);
      const userToken = userRes.body.token;

      const updatedData = { name: "Attempted Update" };

      const res = await request(app)
        .put(`/api/projects/${testProject._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(403);
    });

    it("should return 404 for a non-existent project ID", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updatedData = { name: "Wont Matter" };

      const res = await request(app)
        .put(`/api/projects/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(404);
    });
  });
});
