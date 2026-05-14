import { Router } from "express";
import * as paymentController from "./payment.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/create-order", authMiddleware, paymentController.createOrder);
router.post("/validate-coupon", authMiddleware, paymentController.validateCoupon);
router.post("/verify", authMiddleware, paymentController.verifyPayment);
router.post("/webhook", paymentController.handleWebhook);
router.get("/latest", authMiddleware, paymentController.getLatestPayment);

export default router;
