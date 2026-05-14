import {
  expandPrompt,
  marketPrompt,
  competitorPrompt,
  improvementPrompt,
  scoringPrompt,
  stressTestPrompt,
  roastPrompt,
  architecturePrompt,
} from "./prompts";

import { runAI } from "./aiRunner";
import { getCompetitors } from "../../competitor/competitor.service";

export const runFullPipeline = async (idea: string, context?: any, plan: string = "free") => {
  const isPaid = plan !== "free";

  // Run independent steps in parallel
  const tasks: any[] = [
    runAI(expandPrompt(idea, context, plan)),
    runAI(marketPrompt(idea, context, plan)),
    getCompetitors(idea, context),
    runAI(improvementPrompt(idea, context, plan)),
    runAI(scoringPrompt(idea, context, plan)),
  ];

  // Only run architecture if paid
  if (isPaid) {
    tasks.push(runAI(architecturePrompt(idea, context)));
  }

  const results = await Promise.all(tasks);

  const [expanded, market, competitors, improvements, scoring, architecture] = results;

  // Merge everything
  return {
    idea,
    context,
    expanded,
    market,
    competitors,
    improvements,
    scoring,
    architecture: isPaid ? architecture : { 
      tech_stack: ["RESTRICTED"], 
      architecture: { nodes: [], edges: [] }, 
      message: "Upgrade to Pro to view the Architecture Blueprint." 
    },
  };
};

export const runStressTest = async (idea: string, context?: any, plan: string = "free") => {
  const result = await runAI(stressTestPrompt(idea, context, plan));
  return {
    idea,
    context,
    ...result,
  };
};

export const runRoast = async (idea: string, context?: any, plan: string = "free") => {
  const result = await runAI(roastPrompt(idea, context, plan));
  return {
    idea,
    context,
    ...result,
  };
};