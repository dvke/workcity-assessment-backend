const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON format

// // Define API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
// app.use("/api/projects", require("./routes/projectRoutes"));

// Simple route for testing
app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

// Centralized Error Handling (To be implemented later if needed)

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app and server for testing purposes
module.exports = { app, server };
