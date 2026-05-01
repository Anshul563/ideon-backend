import { Request, Response } from "express";
import * as paymentService from "./payment.service";
import { db } from "../../config/db";
import { payments } from "../../db/schema";
import { eq } from "drizzle-orm";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, planId } = req.body;
    const userId = (req as any).user.id; // Assuming user is attached by auth middleware

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const order = await paymentService.createPaymentOrder(userId.toString(), amount, planId);
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { order_id } = req.body;
    const userId = (req as any).user?.id;

    if (!order_id) {
      return res.status(400).json({ message: "order_id is required" });
    }

    console.log(`Verifying payment for order ${order_id}, user ${userId}`);
    
    const zapStatus = await paymentService.getPaymentStatus(order_id);
    
    // Fetch the updated payment record from DB
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, order_id))
      .limit(1);

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    console.log(`Payment status updated to: ${payment.status} for user ${payment.userId}`);
    
    res.json({
      zapStatus: zapStatus.status,
      dbStatus: payment.status,
      orderId: payment.orderId,
      planId: payment.planId,
      verified: payment.status === "Success",
    });
  } catch (error: any) {
    console.error("Payment verification error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    console.log("Full Webhook Payload received:", JSON.stringify(payload, null, 2));

    const orderId = payload.order_id || payload.orderId;
    const txnId = payload.txn_id || payload.txnId || payload.utr;
    const status = payload.status || payload.txnStatus;

    if (!orderId) {
      console.warn("Webhook received without order_id");
      return res.json({ status: "ok" });
    }

    if (status) {
      console.log(`Processing webhook for order ${orderId} with status ${status}`);
      await paymentService.updatePaymentStatus(orderId, txnId, status);
      console.log(`Successfully updated payment for order ${orderId}`);
    } else {
      console.warn(`Webhook received for order ${orderId} without valid status`);
    }

    res.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    // Still return 200 to acknowledge webhook received
    res.status(200).json({ status: "error received", message: error.message });
  }
};
