import { Router } from "express";
import * as announcementController from "./announcement.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";

const router = Router();

// Public
router.get("/active", announcementController.getActive);

// Admin only
router.get("/", authMiddleware, adminMiddleware, announcementController.getAll);
router.post("/", authMiddleware, adminMiddleware, announcementController.create);
router.patch("/:id", authMiddleware, adminMiddleware, announcementController.update);
router.delete("/:id", authMiddleware, adminMiddleware, announcementController.remove);

export default router;
