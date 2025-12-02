import express from "express";
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import brandStrategyAgentRoutes from "./routes/brandStrategyAgentRoutes.js";
import promptLogRoutes from "./routes/promptLogRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import landingPageAgentRoutes from "./routes/landingPageAgentRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use('/api/landing-page', landingPageAgentRoutes);
app.use('/api/brand-strategy', brandStrategyAgentRoutes);
app.use("/api/prompt-logs", promptLogRoutes);
app.use("/api/users", userRoutes);
app.use("/api", pdfRoutes);
// DB connection
connectDB();

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});