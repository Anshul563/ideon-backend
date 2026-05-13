import { pgTable, serial, text, timestamp, jsonb, customType, pgEnum, integer } from "drizzle-orm/pg-core";

export const paymentStatusEnum = pgEnum("payment_status", ["Pending", "Success", "Failed", "Cancelled", "Timeout"]);
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

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
  role: userRoleEnum("role").default("user"),
  subscriptionStatus: text("subscription_status").default("active"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(), // 'percentage' or 'fixed'
  discountValue: integer("discount_value").notNull(),
  expiresAt: timestamp("expires_at"),
  usageLimit: integer("usage_limit").default(100),
  usageCount: integer("usage_count").default(0),
  isActive: text("is_active").default("true"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ideas = pgTable("ideas", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  idea: text("idea").notNull(),
  targetAudience: text("target_audience"),
  geographicScope: text("geographic_scope"),
  businessModel: text("business_model"),
  budget: text("budget"),
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
  couponCode: text("coupon_code"),
  discountAmount: text("discount_amount").default("0"),
  status: paymentStatusEnum("status").default("Pending"),
  createdAt: timestamp("created_at").defaultNow(),
});
