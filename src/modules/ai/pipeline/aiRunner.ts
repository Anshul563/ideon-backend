import { analyzeIdea } from "../../../utils/hf";

export const runAI = async (prompt: string, retries = 2): Promise<any> => {
  try {
    const raw = await analyzeIdea(prompt);
    
    if (!raw) throw new Error("No output from AI");
    
    const cleaned = raw.match(/\{[\s\S]*\}/);

    if (!cleaned) throw new Error("No JSON");

    return JSON.parse(cleaned[0]);
  } catch (err: any) {
    if (retries > 0) {
      return runAI(prompt + "\nReturn ONLY JSON.", retries - 1);
    }
    return { error: "Failed after retries" };
  }
};