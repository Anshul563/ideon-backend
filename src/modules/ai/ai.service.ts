import { analyzeIdea } from "../../utils/hf";

export const runIdeaAnalysis = async (idea: string) => {
  const prompt = `
  Analyze this SaaS idea and return JSON only:
  ${idea}
  `;

  const raw = await analyzeIdea(prompt);

  try {
    const json = JSON.parse(raw);
    return json;
  } catch {
    return { error: "Invalid AI response", raw };
  }
};