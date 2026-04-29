import { HfInference } from "@huggingface/inference";
import { db } from "../../config/db";
import { ideas } from "../../db/schema";
import { cosineSimilarity } from "./similarity";
import { sql } from "drizzle-orm";

const hf = new HfInference(process.env.HF_TOKEN!);

export const findSimilarIdeas = async (embedding: number[]) => {
  const result = await db.execute(sql`
    SELECT id, idea, embedding <-> ${embedding} AS distance
    FROM ideas
    ORDER BY embedding <-> ${embedding}
    LIMIT 5;
  `);

  return result.rows;
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error("Input text is empty");
    }

    const response = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    // Ensure response is valid array
    if (!Array.isArray(response)) {
      throw new Error("Invalid embedding response");
    }

    // Some models return nested arrays → flatten if needed
    const embedding = Array.isArray(response[0])
      ? (response as number[][])[0]
      : (response as number[]);

    return embedding;
  } catch (error: any) {
    console.error("Embedding Error:", error.message);

    // Fallback (VERY IMPORTANT for production)
    return Array(384).fill(0); // MiniLM dimension = 384
  }
};
