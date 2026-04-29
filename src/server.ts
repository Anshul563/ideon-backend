import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ideaRoutes from "./routes/idea.routes";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});