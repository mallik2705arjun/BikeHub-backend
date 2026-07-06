require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const bikeRoutes = require("./routes/bikeRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const chatRoutes = require("./routes/chatRoutes");
const logger = require("./middleware/logger");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// API Routes
app.use("/api", bikeRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", chatRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("BikeHub AI API is running...");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server!", error: err.message });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle EADDRINUSE port collision gracefully
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Error: Port ${PORT} is already in use!`);
    console.error(`💡 Tip: Close any other terminal running the server, or wait a few seconds and try again.\n`);
    process.exit(1);
  } else {
    console.error("Server error:", err);
  }
});
