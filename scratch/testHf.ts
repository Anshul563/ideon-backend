import dotenv from "dotenv";
dotenv.config();
import { analyzeIdea } from "../src/utils/hf";

async function run() {
  const prompt = `Expand and clarify this SaaS idea in detail:\n"i want to create app like excel draw"\n\nReturn JSON:\n{\n  "expanded_idea": "",\n  "target_users": "",\n  "core_problem": ""\n}`;
  console.log("Running HF query...");
  const res = await analyzeIdea(prompt);
  console.log("Raw output:");
  console.log(res);
}

run();
