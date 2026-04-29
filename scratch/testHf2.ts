import dotenv from "dotenv";
dotenv.config();
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

async function run() {
  const prompt = `Expand and clarify this SaaS idea in detail:\n"i want to create app like excel draw"\n\nReturn ONLY JSON:\n{\n  "expanded_idea": "",\n  "target_users": "",\n  "core_problem": ""\n}`;
  console.log("Running HF query...");
  const res = await hf.chatCompletion({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
    temperature: 0.5,
  });
  console.log("Raw output:");
  console.log(res.choices[0].message.content);
}

run();
