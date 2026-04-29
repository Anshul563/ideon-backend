import { pgTable, serial, text, timestamp, jsonb, customType } from "drizzle-orm/pg-core";

// Define vector type
const vector = customType<{ data: number[] }>({
  dataType() {
    return "vector(384)";
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  idea: text("idea").notNull(),
  embedding: vector("embedding"),
  result: jsonb("result"),
  createdAt: timestamp("created_at").defaultNow(),
});
