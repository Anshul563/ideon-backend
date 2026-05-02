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

export const runFullPipeline = async (idea: string, context?: any) => {
  // Run all independent steps in parallel for maximum speed
  const [expanded, market, competitors, improvements, scoring] = await Promise.all([
    runAI(expandPrompt(idea, context)),
    runAI(marketPrompt(idea, context)),
    getCompetitors(idea, context),
    runAI(improvementPrompt(idea, context)),
    runAI(scoringPrompt(idea, context)),
  ]);

  // Merge everything
  return {
    idea,
    context,
    expanded,
    market,
    competitors,
    improvements,
    scoring,
  };
};

export const runStressTest = async (idea: string, context?: any) => {
  const result = await runAI(stressTestPrompt(idea, context));
  return {
    idea,
    context,
    ...result,
  };
};

export const runRoast = async (idea: string, context?: any) => {
  const result = await runAI(roastPrompt(idea, context));
  return {
    idea,
    context,
    ...result,
  };
};