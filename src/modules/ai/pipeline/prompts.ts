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
Design a professional, high-fidelity system architecture for this SaaS idea:
"${idea}"
${contextStr}

Instruction: This is a PRO FEATURE. Design a multi-layered, enterprise-grade technical blueprint using React Flow schema.

VALID CATEGORIES (Use these for data.category):
- "frontend": Web/Mobile apps
- "backend": API, Microservices, Logic
- "database": SQL, NoSQL, Cache
- "infrastructure": CDN, Load Balancers, Cloud Services
- "security": WAF, Auth, Encryption
- "observability": Logging, Metrics
- "messaging": Queues, PubSub
- "devops": CI/CD, Registry
- "external": Third-party APIs

RETURN JSON ONLY:
{
  "tech_stack": ["React", "Node.js", "etc"],
  "architecture": {
    "nodes": [
      {
        "id": "1",
        "type": "custom",
        "data": { "label": "Web Portal", "category": "frontend" },
        "position": { "x": 250, "y": 0 }
      },
      {
        "id": "2",
        "type": "custom",
        "data": { "label": "API Gateway", "category": "backend" },
        "position": { "x": 250, "y": 150 }
      }
    ],
    "edges": [
      { "id": "e1-2", "source": "1", "target": "2", "animated": true, "label": "HTTPS/REST" }
    ]
  },
  "estimated_monthly_cost": "$200 - $500",
  "security_score": 95,
  "scalability_strategy": "Auto-scaling groups with multi-region replication.",
  "security_recommendations": ["Implement zero-trust", "RBAC"],
  "database_schema": [
    {
      "table": "users",
      "columns": [
        { "name": "id", "type": "uuid", "key": "primary" },
        { "name": "email", "type": "varchar", "key": "unique" },
        { "name": "password_hash", "type": "text" },
        { "name": "created_at", "type": "timestamp" }
      ]
    },
    {
      "table": "projects",
      "columns": [
        { "name": "id", "type": "uuid", "key": "primary" },
        { "name": "user_id", "type": "uuid", "key": "foreign", "references": { "table": "users", "column": "id" } },
        { "name": "title", "type": "varchar" },
        { "name": "description", "type": "text" }
      ]
    }
  ]
}

LAYOUT TIPS:
- Level 0 (y: 0): Clients
- Level 1 (y: 150): Entry/CDN
- Level 2 (y: 300): API/Backend
- Level 3 (y: 450): Databases/Cache
- Level 4 (y: 600+): DevOps/Monitoring
- Spread x-coordinates (100, 400, 700) to avoid overlap.
`;
};