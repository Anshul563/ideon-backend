import { spawn } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const MODELS = {
  QWEN: "Qwen/Qwen2.5-72B-Instruct",
  LLAMA: "meta-llama/Llama-3.1-8B-Instruct",
  PHI: "microsoft/Phi-3-mini-4k-instruct",
};

export const analyzeIdea = (prompt: string, model: string = MODELS.QWEN): Promise<string> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "ai_runner.py");
    const pythonProcess = spawn("python", [scriptPath], {
      env: { ...process.env }
    });

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${errorOutput}`));
      } else {
        try {
          const result = JSON.parse(output);
          if (result.success) {
            resolve(result.result);
          } else {
            reject(new Error(result.error));
          }
        } catch (e) {
          reject(new Error(`Failed to parse python output: ${output}`));
        }
      }
    });

    pythonProcess.stdin.write(JSON.stringify({ prompt, model }));
    pythonProcess.stdin.end();
  });
};