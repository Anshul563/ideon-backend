import { Request, Response } from "express";
import * as paymentService from "./payment.service";
import { db } from "../../config/db";
import { payments, coupons } from "../../db/schema";
import { eq, desc, and } from "drizzle-orm";

export const createOrder = async (req: any, res: Response) => {
  const { amount, planId, couponCode } = req.body;
  const userId = String(req.user.id);

  try {
    const result = await paymentService.createPaymentOrder(userId, amount, planId, couponCode);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const validateCoupon = async (req: any, res: Response) => {
  const { code } = req.body;
  try {
    const [coupon] = await db.select().from(coupons).where(
      and(eq(coupons.code, code), eq(coupons.isActive, "true"))
    );

    if (!coupon) {
      return res.status(400).json({ message: "Invalid or inactive coupon code" });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if ((coupon.usageCount ?? 0) >= (coupon.usageLimit ?? 0)) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    res.json({
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    });
  } catch (err: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyPayment = async (req: any, res: Response) => {
  const { order_id } = req.body;

  try {
    const result = await paymentService.getPaymentStatus(order_id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const { order_id, txn_id, status } = req.body;
  
  try {
    await paymentService.updatePaymentStatus(order_id, txn_id, status);
    res.json({ status: "success" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getLatestPayment = async (req: any, res: Response) => {
  const userIdStr = String(req.user.id);

  try {
    const [latest] = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userIdStr))
      .orderBy(desc(payments.createdAt))
      .limit(1);

    if (!latest) {
      return res.status(404).json({ message: "No payment history found" });
    }

    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
