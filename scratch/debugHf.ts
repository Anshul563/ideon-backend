import dotenv from "dotenv";
dotenv.config();
import { HfInference } from "@huggingface/inference";

async function test() {
  console.log("Token exists:", !!process.env.HF_TOKEN);
  const hf = new HfInference(process.env.HF_TOKEN);
  
  try {
    const res = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [{ role: "user", content: "Hi" }],
      max_tokens: 10,
    });
    console.log("Response:", res.choices[0].message.content);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

test();
