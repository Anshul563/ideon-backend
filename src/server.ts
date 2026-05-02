import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import ideaRoutes from "./routes/idea.routes";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import paymentRoutes from "./modules/payment/payment.routes";

const app = express();

app.use(cors());
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./modules/upload/uploadthing";

app.use("/api/uploadthing", createRouteHandler({ router: uploadRouter }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});