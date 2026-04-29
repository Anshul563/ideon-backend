import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data.email, data.password);

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