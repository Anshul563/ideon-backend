import { db } from "../../config/db";
import { plans } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getAllPlans = async () => {
  return await db.select().from(plans);
};

export const updatePlanAmount = async (id: string, amount: string) => {
  return await db
    .update(plans)
    .set({ amount, updatedAt: new Date() })
    .where(eq(plans.id, id))
    .returning();
};

export const getPlanById = async (id: string) => {
  const result = await db.select().from(plans).where(eq(plans.id, id));
  return result[0];
};
