import { Router } from "express";
import { register, login, getProfile, updateProfilePic } from "../modules/auth/auth.controller";
import { subscribe } from "../modules/auth/subscription.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rate-limit.middleware";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", authMiddleware, getProfile);
router.post("/subscribe", authMiddleware, subscribe);
router.post("/update-profile-pic", authMiddleware, updateProfilePic);

export default router;