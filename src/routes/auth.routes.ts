import { Router } from "express";

import { login, me, logout } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware";

const router = Router();

router.post("/auth/login", login);
router.get("/auth/me", authMiddleware, me);

router.post("/auth/logout", logout);

export const authRoutes = router;
export default router;