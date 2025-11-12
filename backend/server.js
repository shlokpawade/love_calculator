import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Schema
const loveSchema = new mongoose.Schema({
  maleName: String,
  femaleName: String,
  lovePercent: Number,
  date: { type: Date, default: Date.now }
});

const LoveResult = mongoose.model("LoveResult", loveSchema);

// Routes
app.get("/", (req, res) => {
  res.send("💘 Love Calculator API is running!");
});

app.post("/api/save", async (req, res) => {
  try {
    const { maleName, femaleName, lovePercent } = req.body;
    const entry = new LoveResult({ maleName, femaleName, lovePercent });
    await entry.save();
    res.status(200).json({ message: "Saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving data" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
