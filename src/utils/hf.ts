import { HfInference } from "@huggingface/inference";

export const analyzeIdea = async (prompt: string) => {
  const hf = new HfInference(process.env.HF_TOKEN);
  
  const res = await hf.chatCompletion({
    model: "Qwen/Qwen2.5-72B-Instruct",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 800,
    temperature: 0.5,
  });

  return res.choices[0].message.content;
};