
export const generateCommunityDescription = async (communityName: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        console.error("VITE_GROQ_API_KEY environment variable not set.");
        return "Groq AI service is currently unavailable. Please check configuration.";
    }

    try {
        const prompt = `Generate a short, engaging, one-sentence description for an online community forum named "${communityName}". The description should be welcoming and clearly state the community's purpose. Do not use quotes in your response. The description should be concise and suitable for display on a community listing page.`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 100
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Failed to fetch from Groq API");
        }

        const data = await response.json();
        return data.choices[0].message.content.trim().replace(/^"|"$/g, '');
    } catch (error) {
        console.error("Error generating description with Groq API:", error);
        return "Failed to generate AI description. Please try again or write one manually.";
    }
};
