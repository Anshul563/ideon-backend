import dotenv from "dotenv";
dotenv.config();
import { runAI } from "../src/modules/ai/pipeline/aiRunner";

async function test() {
  const idea = "excel draw tool";
  const prompt = `
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
  
  console.log("Testing AI competitor generation...");
  const res = await runAI(prompt);
  console.log("Result:");
  console.log(JSON.stringify(res, null, 2));
}

test();
