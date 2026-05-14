import { analyzeIdea, MODELS } from "../../../utils/hf";

const extractJSON = (text: string | undefined | null) => {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

export const runAI = async (prompt: string, retries = 1): Promise<any> => {
  try {
    // Run two different models (Groq Llama and HF Qwen) for accuracy
    const results = await Promise.allSettled([
      analyzeIdea(prompt, MODELS.GROQ_LLAMA),
      analyzeIdea(prompt, MODELS.QWEN),
    ]);

    const resA = results[0].status === "fulfilled" ? results[0].value : null;
    const resB = results[1].status === "fulfilled" ? results[1].value : null;

    if (!resA && !resB) throw new Error("Both AI models failed");

    // If only one succeeded, just use that one
    if (!resA || !resB) {
      const successfulRes = resA || resB;
      return extractJSON(successfulRes) || { error: "JSON Parsing Failed" };
    }

    // Judge/Reconcile Step if both succeeded
    const reconciliationPrompt = `
      You are a Strategic Data Auditor. I have two AI-generated reports for the same query. 
      Your task is to compare them and produce a single, most accurate JSON response.
      
      Original Query: ${prompt}
      
      Report A: ${resA}
      
      Report B: ${resB}
      
      RULES:
      1. If the reports disagree on facts, use the more detailed or logical one.
      2. Merge unique insights from both.
      3. Return ONLY the final reconciled JSON. NO EXPLANATION.
    `;

    try {
      const reconciledRaw = await analyzeIdea(reconciliationPrompt, MODELS.GROQ_LLAMA);
      const finalJSON = extractJSON(reconciledRaw);
      if (finalJSON) return finalJSON;
    } catch (judgeErr) {
      console.error("Judge reconciliation failed, falling back to Model A");
    }

    // Fallback to resA if reconciliation fails
    return extractJSON(resA) || extractJSON(resB) || { error: "JSON Parsing Failed" };
  } catch (err: any) {
    console.error("AI dual-run failed:", err);
    if (retries > 0) {
      return runAI(prompt + "\nReturn ONLY JSON.", retries - 1);
    }
    return { error: "Failed after multi-model attempt" };
  }
};