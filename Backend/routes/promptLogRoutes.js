import express from "express";
import { createPromptLog } from "../controllers/promptLogController.js";

const router = express.Router();

router.post("/", createPromptLog);

export default router;
