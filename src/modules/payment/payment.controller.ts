import { Request, Response } from "express";
import * as paymentService from "./payment.service";

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
    const status = await paymentService.getPaymentStatus(order_id);
    res.json(status);
  } catch (error: any) {
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

    if (orderId && status) {
      await paymentService.updatePaymentStatus(orderId, txnId, status);
    }

    res.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
