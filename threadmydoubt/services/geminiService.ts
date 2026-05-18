
import { GoogleGenAI } from "@google/genai";

const getAiInstance = () => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateCommunityDescription = async (communityName: string): Promise<string> => {
    const ai = getAiInstance();
    if (!ai) {
        return "AI service is currently unavailable. Please write a description manually.";
    }

    try {
        const prompt = `Generate a short, engaging, one-sentence description for an online community forum named "${communityName}". The description should be welcoming and clearly state the community's purpose.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating description with Gemini API:", error);
        return "Failed to generate AI description. Please try again or write one manually.";
    }
};


