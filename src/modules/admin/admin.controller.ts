import { db } from "../../config/db";
import { users, payments, coupons } from "../../db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { getCache, setCache } from "../../utils/cache";

// Stats
export const getStats = async (req: any, res: any) => {
  try {
    const totalUsers = await db.select({ count: sql`count(*)` }).from(users);
    const totalPayments = await db.select({ 
      revenue: sql`sum(cast(amount as decimal))`,
      count: sql`count(*)` 
    }).from(payments).where(eq(payments.status, "Success"));

    const stats = {
      totalUsers: Number(totalUsers[0].count),
      totalRevenue: Number(totalPayments[0].revenue || 0),
      totalTransactions: Number(totalPayments[0].count),
    };

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Users
export const getUsers = async (req: any, res: any) => {
  try {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      plan: users.plan,
      role: users.role,
      subscriptionStatus: users.subscriptionStatus,
      createdAt: users.createdAt
    }).from(users).orderBy(desc(users.createdAt));
    
    res.json(allUsers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Payments
export const getPayments = async (req: any, res: any) => {
  try {
    const allPayments = await db.select()
      .from(payments)
      .orderBy(desc(payments.createdAt));
    
    res.json(allPayments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Coupons
export const createCoupon = async (req: any, res: any) => {
  try {
    const { code, discountType, discountValue, expiresAt, usageLimit } = req.body;
    
    const [coupon] = await db.insert(coupons).values({
      code,
      discountType,
      discountValue,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      usageLimit: usageLimit || 100,
    }).returning();
    
    res.status(201).json(coupon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCoupons = async (req: any, res: any) => {
  try {
    const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    res.json(allCoupons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await db.delete(coupons).where(eq(coupons.id, Number(id)));
    res.json({ message: "Coupon deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
