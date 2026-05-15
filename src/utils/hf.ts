import { HfInference } from "@huggingface/inference";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN);

export const MODELS = {
  GROQ_LLAMA: "llama-3.3-70b-versatile",
  GROQ_LLAMA_70B: "llama-3.3-70b-versatile",
  GROQ_LLAMA_8B: "llama-3.1-8b-instant",
  GROQ_MIXTRAL: "mixtral-8x7b-32768",
  GROQ_GEMMA: "gemma2-9b-it",
  QWEN: "Qwen/Qwen2.5-7B-Instruct",
  LLAMA: "meta-llama/Llama-3.2-3B-Instruct",
  PHI: "microsoft/Phi-3-mini-4k-instruct",
  MISTRAL: "mistralai/Mistral-7B-Instruct-v0.3",
  GEMMA: "google/gemma-2-9b-it",
  QWEN_MAX: "Qwen/Qwen2.5-72B-Instruct",
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 3, initialDelay = 2000): Promise<T> => {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error.response?.status === 429 || error.message?.includes("429") || error.message?.includes("rate limit");
      const isOverloaded = error.message?.includes("overloaded") || error.message?.includes("loading");
      
      if ((isRateLimit || isOverloaded) && i < retries) {
        const wait = initialDelay * Math.pow(2, i) + Math.random() * 1000;
        console.warn(`AI Provider busy/limited. Retrying in ${wait.toFixed(0)}ms... (Attempt ${i + 1}/${retries + 1})`);
        await new Promise(res => setTimeout(res, wait));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

const groqAnalyze = async (prompt: string, model: string): Promise<string> => {
  return await withRetry(async () => {
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
  });
};

const getFallbackModel = (currentModel: string): string | null => {
  const chain = [
    MODELS.GROQ_LLAMA_70B,
    MODELS.GROQ_MIXTRAL,
    MODELS.GROQ_LLAMA_8B,
    MODELS.GROQ_GEMMA,
    MODELS.QWEN,
    MODELS.LLAMA,
    MODELS.MISTRAL,
    MODELS.GEMMA,
    MODELS.PHI
  ];
  
  const currentIndex = chain.indexOf(currentModel);
  if (currentIndex !== -1 && currentIndex < chain.length - 1) {
    return chain[currentIndex + 1];
  }
  return null;
};

export const analyzeIdea = async (prompt: string, model: string = MODELS.GROQ_LLAMA): Promise<string> => {
  try {
    // If it's a GROQ model, use the Groq API
    const isGroq = model.startsWith("llama-") || model.includes("mixtral") || model.includes("gemma2") || model === MODELS.GROQ_LLAMA;
    
    if (isGroq) {
      return await groqAnalyze(prompt, model);
    }

    // Otherwise use HuggingFace
    return await withRetry(async () => {
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
    });

  } catch (error: any) {
    console.error(`AI Inference Error [${model}]:`, error.message);
    
    const nextModel = getFallbackModel(model);
    if (nextModel) {
      console.log(`Fallback: Trying ${nextModel}...`);
      return analyzeIdea(prompt, nextModel);
    }
    
    throw error;
  }
};