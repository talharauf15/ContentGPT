import express from "express";
import { createPromptLog, getAllPromptLogs } from "../controllers/promptLogController.js";

const router = express.Router();

router.post("/", createPromptLog);
router.get("/", getAllPromptLogs);

export default router;
