import express from "express";
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import promptRoutes from "./routes/promptRoutes.js";
import promptLogRoutes from "./routes/promptLogRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/prompts", promptRoutes);
app.use("/api/prompt-logs", promptLogRoutes);

// DB connection
connectDB();

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
