import { db } from "./src/config/db";
import { users } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function promote(email: string) {
  try {
    console.log(`Promoting user with email: ${email} to admin...`);
    
    const result = await db.update(users)
      .set({ role: "admin" })
      .where(eq(users.email, email))
      .returning();

    if (result.length === 0) {
      console.error("User not found.");
      process.exit(1);
    }

    console.log(`Successfully promoted ${email} to admin!`);
    process.exit(0);
  } catch (error) {
    console.error("Error promoting user:", error);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.log("Usage: npx tsx promote-admin.ts <email>");
  process.exit(1);
}

promote(email);
