import { Router } from "express";

import { login, me } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware";

const router = Router();

router.post("/auth/login", login);
router.get("/auth/me", authMiddleware, me);

router.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
});

export const authRoutes = router;
export default router;