import express from "express";
import { createPrompt, getAllPrompts } from "../controllers/promptController.js";
import { validatePrompt } from "../middleware/promptMiddleware.js";
import { generateBrandStrategy } from "../controllers/promptController.js";

const router = express.Router();

router.post("/", validatePrompt, createPrompt);
router.get("/", getAllPrompts);
router.post("/generate-strategy", generateBrandStrategy);

export default router;