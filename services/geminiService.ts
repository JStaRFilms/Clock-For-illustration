import { GoogleGenAI, Type } from "@google/genai";
import { TimeState } from "../types";
import { GEMINI_MODEL } from "../constants";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseTimeFromNaturalLanguage = async (prompt: string): Promise<TimeState | null> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Convert this time description into a 24-hour format time object: "${prompt}". 
      If no specific time is mentioned, return null. 
      Example input: "quarter past ten" -> Output: { "hours": 10, "minutes": 15, "seconds": 0 }
      Example input: "midnight" -> Output: { "hours": 0, "minutes": 0, "seconds": 0 }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hours: { type: Type.INTEGER, description: "0-23" },
            minutes: { type: Type.INTEGER, description: "0-59" },
            seconds: { type: Type.INTEGER, description: "0-59" },
          },
          required: ["hours", "minutes", "seconds"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    
    const data = JSON.parse(text) as TimeState;
    return data;
  } catch (error) {
    console.error("Error parsing time with Gemini:", error);
    return null;
  }
};