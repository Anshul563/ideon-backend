import { Router } from "express";
import * as adminController from "./admin.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";

const router = Router();

// All routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getUsers);
router.get("/payments", adminController.getPayments);

router.get("/coupons", adminController.getCoupons);
router.post("/coupons", adminController.createCoupon);
router.delete("/coupons/:id", adminController.deleteCoupon);

export default router;
