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

export const architecturePrompt = (idea: string, context?: any) => {
  const contextStr = context ? `\nContext:\nTarget Audience: ${context.targetAudience}\nGeographic Scope: ${context.geographicScope}\nBusiness Model: ${context.businessModel}` : "";
  return `
Design an ULTRA-ADVANCED, HYPER-SCALABLE system architecture for this SaaS idea:
"${idea}"
${contextStr}

Your goal is to provide a technical blueprint that represents a multi-region, enterprise-grade infrastructure. 
Do NOT simplify. Include complex orchestration and high-availability patterns.

Mandatory Components to include:
- Edge Layer: Route 53, CloudFront CDN, WAF, Global Accelerator.
- Access Layer: NGINX Ingress / Kong / AWS ALB, Cognito / Auth0 / Clerk.
- Messaging: Kafka / RabbitMQ for event-driven flows, Redis for Pub/Sub.
- Specialized Logic: Websocket Gateway (if real-time), Job Orchestrators (BullMQ, Temporal).
- AI/Data: Vector DBs (Pinecone, Weaviate) if AI-related, Snowflake/BigQuery for analytics.
- Persistent Tier: Multi-AZ PostgreSQL (RDS), ElastiCache (Redis/Memcached).
- DevOps/Observability: CI/CD Pipeline (GitHub Actions), Prometheus/Grafana, ELK Stack (Logging).
- Security: HashiCorp Vault, VPC Peering, mTLS, Bastion Host.

Return a JSON object with:
1. "tech_stack": [ "Next.js", "Go", "Kubernetes", "Kafka", "PostgreSQL", "Terraform", "GitHub Actions", "Prometheus" ]
2. "architecture": {
     "nodes": [
       { "id": "1", "type": "custom", "data": { "label": "CloudFront CDN", "category": "infrastructure" }, "position": { "x": 0, "y": 100 } }
     ],
     "edges": [
       { "id": "e1-2", "source": "1", "target": "2", "label": "HTTPS (TLS 1.3)" }
     ]
   }
3. "estimated_monthly_cost": "$500 - $2,500+",
4. "security_score": 98,
5. "scalability_strategy": "K8s Horizontal Pod Autoscaling with Multi-Region Data Replication",
6. "security_recommendations": [ "Zero-trust network architecture", "Automated secret rotation with Vault", "AI-driven anomaly detection in logs" ]

LAYOUT RULES for "position":
- Level 0 (y: 0): User Clients (Web/Mobile)
- Level 1 (y: 100): Global Edge / DNS / CDN
- Level 2 (y: 200): Load Balancer / API Gateway / Auth
- Level 3 (y: 350-500): Core Microservices (spread horizontally)
- Level 4 (y: 650): Message Queues / Caching Layers / Specialized Workers
- Level 5 (y: 800): Persistent Databases (Primary/Standby)
- Level 6 (y: 950): Infrastructure / Observability / DevOps

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