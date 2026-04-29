import { db } from "../../config/db";
import { ideas } from "../../db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const getUserIdeas = async (
  userId: string,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  const data = await db
    .select()
    .from(ideas)
    .where(eq(ideas.userId, userId))
    .orderBy(desc(ideas.createdAt))
    .limit(limit)
    .offset(offset);

  return data;
};

export const getAnalytics = async (userId: string) => {
  // Total ideas
  const total = await db.execute(sql`
    SELECT COUNT(*) FROM ideas WHERE user_id = ${userId}
  `);

  // Avg score
  const avgScore = await db.execute(sql`
    SELECT AVG((result->'scores'->>'overall')::float)
    FROM ideas
    WHERE user_id = ${userId}
  `);

  // Verdict counts
  const verdicts = await db.execute(sql`
    SELECT 
      result->>'final_verdict' as verdict,
      COUNT(*) as count
    FROM ideas
    WHERE user_id = ${userId}
    GROUP BY verdict
  `);

  // Recent activity
  const recent = await db
    .select({
      idea: ideas.idea,
      createdAt: ideas.createdAt,
    })
    .from(ideas)
    .where(eq(ideas.userId, userId))
    .orderBy(desc(ideas.createdAt))
    .limit(5);

  return {
    total: total.rows[0]?.count || 0,
    avgScore: avgScore.rows[0]?.avg || 0,
    verdicts: verdicts.rows,
    recent,
  };
};