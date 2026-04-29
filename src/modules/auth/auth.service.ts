import { db } from "../../config/db";
import { users } from "../../db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export const registerUser = async (email: string, password: string) => {
  const existing = await db.select().from(users).where(eq(users.email, email));

  if (existing.length > 0) {
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(password, 10);

  const [user] = await db.insert(users).values({
    email,
    password: hashed,
  }).returning();

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const existing = await db.select().from(users).where(eq(users.email, email));

  if (existing.length === 0) {
    throw new Error("User not found");
  }

  const user = existing[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { user, token };
};