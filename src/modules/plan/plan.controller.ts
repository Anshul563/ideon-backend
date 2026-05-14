import { Request, Response } from "express";
import * as planService from "./plan.service";

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await planService.getAllPlans();
    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    if (typeof id !== 'string') {
      return res.status(400).json({ message: "Invalid Plan ID" });
    }

    const updatedPlan = await planService.updatePlanAmount(id, String(amount));
    if (!updatedPlan.length) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(updatedPlan[0]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
