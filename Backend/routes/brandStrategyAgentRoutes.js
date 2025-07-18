import express from "express";
import { createPrompt, getAllPrompts } from "../controllers/brandStrategyAgentController.js";
import { validatePrompt } from "../middleware/brandStrategyAgentMiddleware.js";
import { generateBrandStrategy } from "../controllers/brandStrategyAgentController.js";

const router = express.Router();

router.post("/", validatePrompt, createPrompt);
router.get("/", getAllPrompts);
router.post("/generate-strategy", generateBrandStrategy);

export default router;