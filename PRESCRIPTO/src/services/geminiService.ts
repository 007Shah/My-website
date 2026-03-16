import { GoogleGenAI } from "@google/genai";

export async function analyzeMedicalImage(imageBuffer: ArrayBuffer, mimeType: string, agentType: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  try {
    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(new Blob([imageBuffer]));
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: `You are a specialized medical AI agent for ${agentType}. 
              Analyze this MRI/Medical image and provide a detailed report.
              Include:
              1. Key Findings
              2. Probability Score (0-100)
              3. Recommended Next Steps
              4. A set of 5 data points for a trend graph (simulated progress or severity over time).
              Return the response in a structured format that can be parsed.`,
            },
          ],
        },
      ],
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}
