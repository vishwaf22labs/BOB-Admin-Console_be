import { Router } from "express";

import {
  listComplaints,
  getComplaintById,
  resolveComplaint,
} from "../controllers/complaints.controller";
import { authMiddleware } from "../middleware";

const router = Router();

router.get("/complaints", authMiddleware, listComplaints);
router.get("/complaints/:id", authMiddleware, getComplaintById);
router.patch("/complaints/:id/resolve", authMiddleware, resolveComplaint);

export const complaintsRoutes = router;
export default router;