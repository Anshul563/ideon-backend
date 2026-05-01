import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { users } from "../../db/schema";
import { registerUser, loginUser } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    res.json({
      message: "User registered successfully",
      user,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data.email, data.password);

    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getProfile = async (req: any, res: Response) => {
  const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Remove password from response
  const { password, ...safeUser } = user;
  res.json(safeUser);
};