import { HfInference } from "@huggingface/inference";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN);

export const MODELS = {
  GROQ_LLAMA: "llama-3.3-70b-versatile",
  QWEN: "Qwen/Qwen2.5-7B-Instruct",
  LLAMA: "meta-llama/Llama-3.2-3B-Instruct",
  PHI: "microsoft/Phi-3-mini-4k-instruct",
  MISTRAL: "mistralai/Mistral-7B-Instruct-v0.3",
  GEMMA: "google/gemma-2-9b-it",
  QWEN_MAX: "Qwen/Qwen2.5-72B-Instruct",
};

const groqAnalyze = async (prompt: string, model: string): Promise<string> => {
  const { data } = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: model,
      messages: [
        { role: "system", content: "You are a strategic business analyst. Always return valid JSON when requested." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 2000,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data.choices[0]?.message?.content || "";
};

export const analyzeIdea = async (prompt: string, model: string = MODELS.GROQ_LLAMA): Promise<string> => {
  try {
    // If it's a GROQ model, use the Groq API
    if (model.startsWith("llama-") || model.includes("mixtral") || model === MODELS.GROQ_LLAMA) {
      return await groqAnalyze(prompt, model);
    }

    // Otherwise use HuggingFace
    const response = await hf.chatCompletion({
      model: model,
      messages: [
        { role: "system", content: "You are a strategic business analyst. Always return valid JSON when requested." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.2,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) throw new Error("No response content from HuggingFace");
    return result;

  } catch (error: any) {
    console.error(`AI Inference Error [${model}]:`, error.message);
    
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    await delay(500);

    // Dynamic Fallback Chain
    if (model === MODELS.GROQ_LLAMA) {
      console.log(`Groq failed, falling back to HF QWEN...`);
      return analyzeIdea(prompt, MODELS.QWEN);
    } else if (model === MODELS.QWEN) {
      console.log(`Fallback: Trying ${MODELS.LLAMA}...`);
      return analyzeIdea(prompt, MODELS.LLAMA);
    } else if (model === MODELS.LLAMA) {
      console.log(`Fallback: Trying ${MODELS.MISTRAL}...`);
      return analyzeIdea(prompt, MODELS.MISTRAL);
    } else if (model === MODELS.MISTRAL) {
      console.log(`Fallback: Trying ${MODELS.GEMMA}...`);
      return analyzeIdea(prompt, MODELS.GEMMA);
    } else if (model === MODELS.GEMMA) {
      console.log(`Fallback: Trying ${MODELS.PHI}...`);
      return analyzeIdea(prompt, MODELS.PHI);
    }
    
    throw error;
  }
};