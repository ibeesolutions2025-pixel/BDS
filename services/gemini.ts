import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MathProblem, Difficulty } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
// NOTE: We recreate the client in the function to ensure we capture the key if it changes (though usually env is static)
// but following best practices for the prompt context.

const problemSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "Câu hỏi toán học bằng tiếng Việt. Rõ ràng, ngắn gọn.",
    },
    answer: {
      type: Type.NUMBER,
      description: "Đáp án chính xác là một con số.",
    },
    explanation: {
      type: Type.STRING,
      description: "Giải thích ngắn gọn cách làm bài toán này bằng tiếng Việt.",
    },
    hint: {
      type: Type.STRING,
      description: "Một gợi ý nhỏ để giúp người giải nếu họ gặp khó khăn.",
    }
  },
  required: ["question", "answer", "explanation", "hint"],
};

export const generateMathProblem = async (difficulty: Difficulty): Promise<MathProblem> => {
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Choose model based on task complexity, though 'flash' is sufficient for math generation usually.
  // Using gemini-3-flash-preview as recommended for basic text tasks.
  const modelId = "gemini-3-flash-preview"; 

  const prompt = `Tạo một bài toán đố hoặc phép tính thú vị với độ khó: ${difficulty}. 
  Hãy đảm bảo câu trả lời là một con số cụ thể. 
  Output JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: problemSchema,
        systemInstruction: "Bạn là một giáo viên toán học thân thiện, vui tính. Hãy tạo ra các bài toán bằng Tiếng Việt phù hợp với lứa tuổi học sinh.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Không nhận được phản hồi từ Gemini.");

    const data = JSON.parse(text) as MathProblem;
    return data;
  } catch (error) {
    console.error("Lỗi khi tạo bài toán:", error);
    throw error;
  }
};
