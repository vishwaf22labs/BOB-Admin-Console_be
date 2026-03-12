import { Router } from "express";

import { intakeComplaint } from "../controllers/intake.controller";

const router = Router();

router.post("/intake/complaint", intakeComplaint);

export const intakeRoutes = router;
export default router;