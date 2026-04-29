import { db } from "../src/config/db";
import { sql } from "drizzle-orm";

async function main() {
  try {
    console.log("Altering column...");
    // Cast jsonb text to vector
    await db.execute(sql`ALTER TABLE ideas ALTER COLUMN embedding TYPE vector(384) USING (embedding::text)::vector;`);
    console.log("Success! Column altered.");
  } catch (error: any) {
    console.error("Error altering column:", error.message);
    try {
      console.log("Attempting to drop column instead...");
      await db.execute(sql`ALTER TABLE ideas DROP COLUMN embedding;`);
      console.log("Success! Column dropped. Now you can run drizzle-kit push again.");
    } catch (e: any) {
      console.error("Failed to drop column:", e.message);
    }
  }
  process.exit(0);
}

main();
