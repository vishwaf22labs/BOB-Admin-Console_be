import { Router } from "express";

import { createCustomer } from "../controllers/customer.controller";

const router = Router();

router.post("/customers", createCustomer);

export const customerRoutes = router;
export default router;