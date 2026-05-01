import { pgTable, serial, text, timestamp, jsonb, customType, pgEnum } from "drizzle-orm/pg-core";

export const paymentStatusEnum = pgEnum("payment_status", ["Pending", "Success", "Failed", "Cancelled", "Timeout"]);

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
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  profilePic: text("profile_pic"),
  plan: text("plan").default("free"),
  subscriptionStatus: text("subscription_status").default("active"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ideas = pgTable("ideas", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  idea: text("idea").notNull(),
  embedding: vector("embedding"),
  result: jsonb("result"),
  mode: text("mode").default("full"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  orderId: text("order_id").notNull().unique(),
  txnId: text("txn_id"),
  amount: text("amount").notNull(),
  planId: text("plan_id"),
  status: paymentStatusEnum("status").default("Pending"),
  createdAt: timestamp("created_at").defaultNow(),
});
