export const expandPrompt = (idea: string) => `
Expand and clarify this SaaS idea in detail:
"${idea}"

Return JSON:
{
  "expanded_idea": "",
  "target_users": "",
  "core_problem": ""
}
`;

export const marketPrompt = (idea: string) => `
Analyze market demand for:
"${idea}"

Return JSON:
{
  "demand_level": "",
  "reason": ""
}
`;

export const competitorPrompt = (idea: string) => `
List 3 REAL, EXISTING companies that are competitors to this SaaS idea:
"${idea}"

Do NOT use placeholders like "Company A" or "Competitor B". Use the names of actual real-world businesses.

Return JSON:
{
  "competitors": [
    { "name": "Actual Company Name", "description": "What they do", "weakness": "A specific weakness" }
  ]
}
`;

export const improvementPrompt = (idea: string) => `
Improve this SaaS idea:
"${idea}"

Return JSON:
{
  "improvements": [],
  "better_versions": []
}
`;

export const scoringPrompt = (idea: string) => `
Score this SaaS idea:
"${idea}"

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