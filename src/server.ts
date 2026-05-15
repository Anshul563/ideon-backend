import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import ideaRoutes from "./routes/idea.routes";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import adminRoutes from "./modules/admin/admin.routes";
import supportRoutes from "./routes/support.routes";
import planRoutes from "./modules/plan/plan.routes";
import announcementRoutes from "./modules/announcement/announcement.routes";
import { apiLimiter } from "./middleware/rate-limit.middleware";
import "./modules/idea/idea.worker"; // Start the analysis worker

const app = express();

app.use(apiLimiter);
app.use(cors());
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./modules/upload/uploadthing";

app.use("/api/uploadthing", createRouteHandler({ router: uploadRouter }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/announcements", announcementRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});