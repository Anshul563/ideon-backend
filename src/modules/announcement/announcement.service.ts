import { db } from "../../config/db";
import { announcements } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export const getActiveAnnouncement = async () => {
  const result = await db
    .select()
    .from(announcements)
    .where(eq(announcements.isActive, "true"))
    .orderBy(desc(announcements.createdAt))
    .limit(1);
  return result[0] || null;
};

export const getAllAnnouncements = async () => {
  return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
};

export const createAnnouncement = async (data: any) => {
  return await db.insert(announcements).values(data).returning();
};

export const updateAnnouncement = async (id: number, data: any) => {
  return await db
    .update(announcements)
    .set(data)
    .where(eq(announcements.id, id))
    .returning();
};

export const deleteAnnouncement = async (id: number) => {
  return await db.delete(announcements).where(eq(announcements.id, id)).returning();
};
