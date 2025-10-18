
import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API functionality will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateDescription = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        return Promise.resolve("AI functionality is disabled. Please set your API key.");
    }

    try {
        const fullPrompt = `Generate a compelling and concise event description based on the following idea: "${prompt}". The description should be exciting, informative, and around 2-3 sentences long.`;
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate description from AI.");
    }
};
