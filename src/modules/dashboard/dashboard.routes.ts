import { Router } from "express";
import {
  getHistory,
  getDashboardAnalytics,
} from "./dashboard.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/history", authMiddleware, getHistory);
router.get("/analytics", authMiddleware, getDashboardAnalytics);

export default router;