import { HfInference } from "@huggingface/inference";

export const MODELS = {
  QWEN: "Qwen/Qwen2.5-72B-Instruct",
  LLAMA: "meta-llama/Llama-3.1-8B-Instruct",
  PHI: "microsoft/Phi-3-mini-4k-instruct",
};

export const analyzeIdea = async (prompt: string, model: string = MODELS.QWEN) => {
  const hf = new HfInference(process.env.HF_TOKEN);
  
  const res = await hf.chatCompletion({
    model: model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
    temperature: 0.5,
  });

  return res.choices[0].message.content;
};