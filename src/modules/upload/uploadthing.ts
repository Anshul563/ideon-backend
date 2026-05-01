import { createUploadthing, type FileRouter } from "uploadthing/express";
import { db } from "../../config/db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const f = createUploadthing();

export const uploadRouter = {
  profilePicture: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new Error("Unauthorized");

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        return { userId: decoded.id };
      } catch {
        throw new Error("Invalid token");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL", file.url);
      
      await db.update(users)
        .set({ profilePic: file.url })
        .where(eq(users.id, metadata.userId));
        
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
