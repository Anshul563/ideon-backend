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
      console.log("Uploadthing middleware reached. Token present:", !!token);
      
      if (!token) throw new Error("Unauthorized: No token provided");

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        console.log("Token verified. User ID:", decoded.id);
        return { userId: decoded.id };
      } catch (err) {
        console.error("Token verification failed:", err);
        throw new Error("Invalid token");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("!!! onUploadComplete STARTED !!!");
      console.log("Metadata received:", metadata);
      console.log("File URL:", file.url);
      
      const userId = Number(metadata.userId);
      if (isNaN(userId)) {
        console.error("Invalid userId in metadata:", metadata.userId);
        return { error: "Invalid userId" };
      }

      try {
        await db.update(users)
          .set({ profilePic: file.url })
          .where(eq(users.id, userId));
        console.log("Database updated successfully for userId:", userId);
      } catch (dbErr) {
        console.error("Database update failed in onUploadComplete:", dbErr);
      }
        
      return { uploadedBy: userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
