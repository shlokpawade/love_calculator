import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mongoose Schema & Model
const loveSchema = new mongoose.Schema({
  name1: String,
  name2: String,
  percentage: Number,
});

const LoveResult = mongoose.model("LoveResult", loveSchema);

// API Route
app.post("/api/save", async (req, res) => {
  try {
    const { name1, name2, percentage } = req.body;
    const newResult = new LoveResult({ name1, name2, percentage });
    await newResult.save();
    res.status(201).json({ message: "Result saved successfully!" });
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Frontend setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// For any other route, serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

