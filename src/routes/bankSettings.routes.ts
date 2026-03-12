import { Router } from "express";

import {
  getVoiceLanguage,
  updateVoiceLanguage,
} from "../controllers/bankSettings.controller";
import { authMiddleware } from "../middleware";

const router = Router();

router.get("/bank-settings/voice-language", authMiddleware, getVoiceLanguage);
router.patch(
  "/bank-settings/voice-language",
  authMiddleware,
  updateVoiceLanguage,
);

export const bankSettingsRoutes = router;
export default router;