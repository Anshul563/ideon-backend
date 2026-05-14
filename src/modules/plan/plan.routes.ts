import { Router } from "express";
import * as planController from "./plan.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";

const router = Router();

router.get("/", planController.getPlans);
router.patch("/:id", authMiddleware, adminMiddleware, planController.updatePlan);

export default router;
