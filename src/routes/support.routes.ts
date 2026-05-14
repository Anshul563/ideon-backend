import { Router } from "express";
import { submitTicket, getTickets } from "../modules/support/support.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/submit", (req, res, next) => {
  // Optional auth: try to get user but don't fail if not logged in
  authMiddleware(req, res, () => {
    next();
  });
}, submitTicket);

router.get("/admin/tickets", authMiddleware, getTickets);

export default router;
