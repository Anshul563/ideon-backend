import axios from "axios";
import { db } from "../../config/db";
import { payments, users, coupons, plans } from "../../db/schema";
import { eq, and, gt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const createPaymentOrder = async (userId: string, amount: string, planId: string, couponCode?: string) => {
  const ZAP_KEY = process.env.ZAP_KEY;
  const ZAP_URL = "https://pay.zapupi.com/api";

  const orderId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  console.log("Initializing payment order:", { userId, amount, orderId, planId, couponCode });

  if (!ZAP_KEY) {
    throw new Error("ZAP_KEY is not defined in environment variables");
  }

  // Fetch plan amount from DB to prevent tampering
  const [plan] = await db.select().from(plans).where(eq(plans.id, planId));
  if (!plan) {
    throw new Error("Invalid plan selected");
  }

  let finalAmount = parseFloat(plan.amount);
  let discountAmount = 0;
  let validatedCoupon = null;

  if (couponCode) {
    const existingCoupons = await db.select().from(coupons).where(and(eq(coupons.code, couponCode), eq(coupons.isActive, "true")));
    if (existingCoupons.length > 0) {
      const coupon = existingCoupons[0];
      
      // Check expiry
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        throw new Error("Coupon has expired");
      }

      // Check usage limit
      if ((coupon.usageCount ?? 0) >= (coupon.usageLimit ?? 0)) {
        throw new Error("Coupon usage limit reached");
      }

      if (coupon.discountType === "percentage") {
        discountAmount = (finalAmount * (coupon.discountValue ?? 0)) / 100;
      } else {
        discountAmount = (coupon.discountValue ?? 0);
      }

      finalAmount = Math.max(0, finalAmount - discountAmount);
      validatedCoupon = coupon;
    } else {
      throw new Error("Invalid or inactive coupon code");
    }
  }

  const payload = {
    zap_key: ZAP_KEY,
    order_id: orderId,
    amount: finalAmount.toFixed(2),
    remark: `Plan Upgrade | User: ${userId}${couponCode ? ` | Coupon: ${couponCode}` : ""}`,
    success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success&order_id=${orderId}`,
    failed_url: `${process.env.FRONTEND_URL}/dashboard?payment=failed&order_id=${orderId}`,
    timeout_url: `${process.env.FRONTEND_URL}/dashboard?payment=timeout&order_id=${orderId}`,
  };

  console.log("ZapUPI Payload:", payload);

  try {
    const response = await axios.post(`${ZAP_URL}/create-order`, payload);
    console.log("ZapUPI Response:", response.data);

    if (response.data.status === "success") {
      // Save to DB
      await db.insert(payments).values({
        userId,
        orderId,
        amount: finalAmount.toFixed(2),
        planId,
        couponCode: couponCode || null,
        discountAmount: discountAmount.toFixed(2),
        status: "Pending",
      });

      // Increment coupon usage count
      if (validatedCoupon) {
        await db.update(coupons).set({ usageCount: (validatedCoupon.usageCount ?? 0) + 1 }).where(eq(coupons.id, validatedCoupon.id));
      }

      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to create order");
    }
  } catch (error: any) {
    console.error("ZapUPI Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getPaymentStatus = async (orderId: string) => {
  const ZAP_KEY = process.env.ZAP_KEY;
  const ZAP_URL = "https://pay.zapupi.com/api";

  if (!ZAP_KEY) {
    throw new Error("ZAP_KEY is not defined in environment variables");
  }

  const payload = {
    zap_key: ZAP_KEY,
    order_id: orderId,
  };

  try {
    const response = await axios.post(`${ZAP_URL}/order-status`, payload);
    
    const zapStatus = response.data.status;
    const txnId = response.data.txn_id || response.data.txnId || response.data.utr;
    
    console.log(`Payment Status for ${orderId}: ${zapStatus}, TxnId: ${txnId}`);
    
    if (zapStatus) {
      // Update our DB with the status from ZapUPI
      await updatePaymentStatus(orderId, txnId, zapStatus);
    }

    return response.data;
  } catch (error: any) {
    console.error("Failed to get payment status from ZapUPI:", error.response?.data || error.message);
    throw new Error(`Failed to verify payment: ${error.response?.data?.message || error.message}`);
  }
};

export const updatePaymentStatus = async (orderId: string, txnId: string, status: string) => {
  const normalizedStatus = status.toUpperCase();
  
  let finalStatus: "Pending" | "Success" | "Failed" | "Cancelled" | "Timeout" = "Failed";

  if (normalizedStatus === "SUCCESS" || normalizedStatus === "COMPLETED") {
    finalStatus = "Success";
  } else if (normalizedStatus === "CANCELLED" || normalizedStatus === "CANCELED") {
    finalStatus = "Cancelled";
  } else if (normalizedStatus === "TIMEOUT" || normalizedStatus === "EXPIRED") {
    finalStatus = "Timeout";
  } else if (normalizedStatus === "PENDING") {
    finalStatus = "Pending";
  }

  const [payment] = await db
    .update(payments)
    .set({ 
      txnId: txnId || undefined, 
      status: finalStatus 
    })
    .where(eq(payments.orderId, orderId))
    .returning();

  if (payment && finalStatus === "Success" && payment.planId) {
    let endsAt: Date | null = null;
    const now = new Date();
    
    if (payment.planId === "monthly") {
      endsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (payment.planId === "yearly") {
      endsAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    }

    // Upgrade User Plan
    await db
      .update(users)
      .set({ 
        plan: payment.planId,
        subscriptionStatus: "active",
        subscriptionStartedAt: now,
        subscriptionEndsAt: endsAt
      })
      .where(eq(users.id, parseInt(payment.userId)));
    
    console.log(`User ${payment.userId} upgraded to plan ${payment.planId} (active) (Order: ${orderId})`);
  }

  return payment;
};
