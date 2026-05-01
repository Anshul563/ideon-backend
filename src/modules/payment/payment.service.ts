import axios from "axios";
import { db } from "../../config/db";
import { payments, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const createPaymentOrder = async (userId: string, amount: string, planId: string) => {
  const ZAP_KEY = process.env.ZAP_KEY;
  const ZAP_URL = "https://pay.zapupi.com/api";

  const orderId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  console.log("Initializing payment order:", { userId, amount, orderId, planId });

  if (!ZAP_KEY) {
    throw new Error("ZAP_KEY is not defined in environment variables");
  }

  const payload = {
    zap_key: ZAP_KEY,
    order_id: orderId,
    amount: amount,
    remark: `Plan Upgrade | User: ${userId}`,
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
        amount,
        planId,
        status: "Pending",
      });

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

  const payload = {
    zap_key: ZAP_KEY,
    order_id: orderId,
  };

  const response = await axios.post(`${ZAP_URL}/order-status`, payload);
  return response.data;
};

export const updatePaymentStatus = async (orderId: string, txnId: string, status: string) => {
  const normalizedStatus = status.toUpperCase();
  
  const [payment] = await db
    .update(payments)
    .set({ txnId, status: status }) // Keep original status for records
    .where(eq(payments.orderId, orderId))
    .returning();

  if (payment && (normalizedStatus === "SUCCESS" || normalizedStatus === "COMPLETED")) {
    // Upgrade User Plan
    await db
      .update(users)
      .set({ plan: payment.planId })
      .where(eq(users.id, parseInt(payment.userId)));
    
    console.log(`User ${payment.userId} upgraded to plan ${payment.planId} (Order: ${orderId})`);
  }
};
