export const expandPrompt = (idea: string, context?: any, plan: string = "free") => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  const depthInstruction = plan === "free" 
    ? "Provide a brief, low-level overview (1-2 sentences per field)." 
    : "Provide a comprehensive, high-level deep dive with detailed explanations and strategic insights.";

  return `
Expand and clarify this SaaS idea:
"${idea}"
${contextStr}

Instruction: ${depthInstruction}

Return JSON:
{
  "expanded_idea": "",
  "target_users": "",
  "core_problem": ""
}
`;
};

export const marketPrompt = (idea: string, context?: any, plan: string = "free") => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  const depthInstruction = plan === "free"
    ? "Provide a basic market demand level and a short reason."
    : "Provide an in-depth market analysis including growth potential and specific market drivers.";

  return `
Analyze market demand for:
"${idea}"
${contextStr}

Instruction: ${depthInstruction}

Return JSON:
{
  "demand_level": "",
  "reason": ""
}
`;
};

export const competitorPrompt = (idea: string, context?: any, plan: string = "free") => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  const depthInstruction = plan === "free"
    ? "List 3 real competitors with basic descriptions."
    : "List 5 real competitors with detailed analysis of their strategy, weaknesses, and your competitive advantage.";

  return `
List REAL, EXISTING companies that are competitors to this SaaS idea:
"${idea}"
${contextStr}

Instruction: ${depthInstruction}
Do NOT use placeholders like "Company A". Use actual real-world businesses.

Return JSON:
{
  "competitors": [
    { "name": "Actual Company Name", "website": "company.com", "description": "What they do", "weakness": "A specific weakness" }
  ]
}
`;
};

export const improvementPrompt = (idea: string, context?: any, plan: string = "free") => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  const depthInstruction = plan === "free"
    ? "Suggest 2-3 simple improvements."
    : "Suggest 5-7 advanced strategic improvements and pivot options.";

  return `
Improve this SaaS idea:
"${idea}"
${contextStr}

Instruction: ${depthInstruction}

Return JSON:
{
  "improvements": [],
  "better_versions": []
}
`;
};

export const scoringPrompt = (idea: string, context?: any, plan: string = "free") => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  const depthInstruction = plan === "free"
    ? "Provide a basic score and a short verdict."
    : "Provide a rigorous multi-factor score with a detailed justification for each category.";

  return `
Score this SaaS idea:
"${idea}"
${contextStr}

Instruction: ${depthInstruction}

Return JSON:
{
  "scores": {
    "demand": 0,
    "competition": 0,
    "monetization": 0,
    "execution": 0,
    "uniqueness": 0,
    "overall": 0
  },
  "verdict": "",
  "reason": ""
}
`;
};

export const stressTestPrompt = (idea: string, context?: any, plan: string = "free") => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  const depthInstruction = plan === "free"
    ? "Identify 2-3 basic risks."
    : "Perform a brutal, multi-layered stress test uncovering deep structural risks and hidden failure modes.";

  return `
BRUTALLY HONEST STRESS TEST:
"${idea}"
${contextStr}

Instruction: ${depthInstruction}

Return JSON:
{
  "failure_reasons": [
    { "title": "Reason", "description": "Explanation" }
  ],
  "market_risks": [
    { "title": "Risk", "description": "Explanation" }
  ],
  "execution_challenges": [
    { "title": "Challenge", "description": "Explanation" }
  ],
  "brutal_verdict": ""
}
`;
};

export const roastPrompt = (idea: string, context?: any, plan: string = "free") => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}` : "";
  const depthInstruction = plan === "free"
    ? "Give a light, funny roast."
    : "Give a devastating, hyper-detailed roast that leaves no stone unturned. Be brutal.";

  return `
ROAST THIS SAAS IDEA:
"${idea}"
${contextStr}

Instruction: ${depthInstruction}
Be extremely sarcastic, mean, and funny.

Return JSON:
{
  "roasts": [
    { "point": "Point", "comment": "Comment" }
  ],
  "the_burn": ""
}
`;
};

export const architecturePrompt = (idea: string, context?: any) => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}` : "";
  return `
Design an ULTRA-ADVANCED, HYPER-SCALABLE system architecture for this SaaS idea:
"${idea}"
${contextStr}

Instruction: This is a PRO FEATURE. Design a multi-region, enterprise-grade technical blueprint.

Return JSON ONLY:
{
  "tech_stack": [],
  "architecture": { "nodes": [], "edges": [] },
  "estimated_monthly_cost": "",
  "security_score": 0,
  "scalability_strategy": "",
  "security_recommendations": []
}
`;
};