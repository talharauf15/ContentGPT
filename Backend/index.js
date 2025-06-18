import express from "express";
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// DB connection
connectDB();

// Start server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
