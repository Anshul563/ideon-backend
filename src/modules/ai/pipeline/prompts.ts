export const expandPrompt = (idea: string, context?: any) => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  return `
Expand and clarify this SaaS idea in detail:
"${idea}"
${contextStr}

Return JSON:
{
  "expanded_idea": "",
  "target_users": "",
  "core_problem": ""
}
`;
};

export const marketPrompt = (idea: string, context?: any) => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  return `
Analyze market demand for:
"${idea}"
${contextStr}

Return JSON:
{
  "demand_level": "",
  "reason": ""
}
`;
};

export const competitorPrompt = (idea: string, context?: any) => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  return `
List 3 REAL, EXISTING companies that are competitors to this SaaS idea:
"${idea}"
${contextStr}

Do NOT use placeholders like "Company A" or "Competitor B". Use the names of actual real-world businesses.

Return JSON:
{
  "competitors": [
    { "name": "Actual Company Name", "website": "company.com", "description": "What they do", "weakness": "A specific weakness" }
  ]
}
`;
};

export const improvementPrompt = (idea: string, context?: any) => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  return `
Improve this SaaS idea:
"${idea}"
${contextStr}

Return JSON:
{
  "improvements": [],
  "better_versions": []
}
`;
};

export const scoringPrompt = (idea: string, context?: any) => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  return `
Score this SaaS idea:
"${idea}"
${contextStr}

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

export const stressTestPrompt = (idea: string, context?: any) => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}\nEst. Budget: ${context.budget}` : "";
  return `
BRUTALLY HONEST STRESS TEST:
"${idea}"
${contextStr}

Analyze why this idea will likely fail. Be extremely critical. 
Focus on:
1. Why it will fail (The hard truth)
2. Market risks (What you are ignoring)
3. Execution challenges (Why it's harder than you think)

Return JSON:
{
  "failure_reasons": [
    { "title": "Too crowded market", "description": "Short explanation" },
    { "title": "Hard to monetize", "description": "Short explanation" }
  ],
  "market_risks": [
    { "title": "Low switching cost", "description": "Short explanation" }
  ],
  "execution_challenges": [
    { "title": "Requires strong network effect", "description": "Short explanation" }
  ],
  "brutal_verdict": "A one-sentence harsh reality check"
}
`;
};

export const roastPrompt = (idea: string, context?: any) => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}` : "";
  return `
ROAST THIS SAAS IDEA:
"${idea}"
${contextStr}

Be extremely sarcastic, mean, and funny. Point out why it's a "clown" idea. 
Format your output as a series of "roast points" and a final "burn".

Return JSON:
{
  "roasts": [
    { "point": "The 'Unique' Value Prop", "comment": "Sarcastic comment about why it's not unique" },
    { "point": "The Monetization 'Plan'", "comment": "Sarcastic comment about the lack of revenue" }
  ],
  "the_burn": "One final extremely mean sentence"
}
`;
};