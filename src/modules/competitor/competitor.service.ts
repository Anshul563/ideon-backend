import { scrapeProductHunt } from "./phScraper";
import { runAI } from "../ai/pipeline/aiRunner";

export const getCompetitors = async (idea: string) => {
  // Step 1: Generate keywords using AI
  const keywordPrompt = `
  Generate 3 search keywords for this SaaS idea:
  "${idea}"

  Return JSON:
  { "keywords": ["", "", ""] }
  `;

  const keywordRes = await runAI(keywordPrompt);

  const keywords = keywordRes?.keywords || [idea];

  // Step 2: Scrape Product Hunt
  let competitors: any[] = [];

  for (const keyword of keywords) {
    const results = await scrapeProductHunt(keyword);
    competitors = [...competitors, ...results];
  }

  // Remove duplicates
  const unique = Array.from(
    new Map(competitors.map((item) => [item.name, item])).values()
  );

  // Step 3: Enhance with AI (add weaknesses or find real competitors if empty)
  const enhancePrompt = unique.length > 0 
    ? `
      Analyze these real-world competitors and add a "weakness" field for each:
      ${JSON.stringify(unique)}

      Return JSON:
      {
        "competitors": [
          { "name": "", "description": "", "weakness": "" }
        ]
      }
      `
    : `
      List 3 REAL, EXISTING companies that are competitors to this SaaS idea:
      "${idea}"

      Do NOT use placeholders like "Company A". Use actual names of real companies.
      
      Return JSON:
      {
        "competitors": [
          { "name": "Real Company Name", "description": "Actual description", "weakness": "Real business weakness" }
        ]
      }
      `;

  const enhanced = await runAI(enhancePrompt);

  return enhanced?.competitors || unique;
};