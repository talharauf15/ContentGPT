// routes/landingPageRoutes.js
import express from 'express';
import { createLandingPage } from '../controllers/landingPageAgentController.js';

const router = express.Router();

router.post('/generate-landing', createLandingPage);

export default router;
