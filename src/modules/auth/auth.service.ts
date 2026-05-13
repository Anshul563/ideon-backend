import { db } from "../../config/db";
import { users } from "../../db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export const registerUser = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  profilePic?: string;
}) => {
  const { email, password, firstName, lastName, profilePic } = data;
  const existing = await db.select().from(users).where(eq(users.email, email));

  if (existing.length > 0) {
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(password, 10);

  const [user] = await db.insert(users).values({
    email,
    password: hashed,
    firstName,
    lastName,
    profilePic,
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
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return { user, token };
};