import { Router } from "express";
import { register, login, getProfile } from "../modules/auth/auth.controller";
import { subscribe } from "../modules/auth/subscription.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getProfile);
router.post("/subscribe", authMiddleware, subscribe);

export default router;