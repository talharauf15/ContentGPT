// routes/promptRoutes.js
import express from "express";
import { createPrompt, getAllPrompts } from "../controllers/promptController.js";
import { validatePrompt } from "../middleware/promptMiddleware.js";

const router = express.Router();

router.post("/", validatePrompt, createPrompt);
router.get("/", getAllPrompts);

export default router;
