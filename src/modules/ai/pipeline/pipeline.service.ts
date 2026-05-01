import {
  expandPrompt,
  marketPrompt,
  competitorPrompt,
  improvementPrompt,
  scoringPrompt,
  stressTestPrompt,
  roastPrompt,
} from "./prompts";

import { runAI } from "./aiRunner";
import { getCompetitors } from "../../competitor/competitor.service";

export const runFullPipeline = async (idea: string) => {
  // Step 1: Expand
  const expanded = await runAI(expandPrompt(idea));

  // Step 2: Market
  const market = await runAI(marketPrompt(idea));

  // Step 3: Competitors
  const competitors = await getCompetitors(idea);

  // Step 4: Improvements
  const improvements = await runAI(improvementPrompt(idea));

  // Step 5: Scoring
  const scoring = await runAI(scoringPrompt(idea));

  // Merge everything
  return {
    idea,
    expanded,
    market,
    competitors,
    improvements,
    scoring,
  };
};

export const runStressTest = async (idea: string) => {
  const result = await runAI(stressTestPrompt(idea));
  return {
    idea,
    ...result,
  };
};

export const runRoast = async (idea: string) => {
  const result = await runAI(roastPrompt(idea));
  return {
    idea,
    ...result,
  };
};