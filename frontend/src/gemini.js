import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeComplaint = async (text) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash", // Using 1.5-flash as it's stable and fast
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
      As a government NLP assistant, analyze the following citizen complaint and return ONLY a valid JSON object.
      Do not include any greeting or explanation.

      Complaint: ${text}

      JSON Format:
      {
        "category": "String (e.g., Sanitation, Roads, Water, Electricity, Public Safety)",
        "priority": "String (Low, Medium, High, Urgent)",
        "sentiment": "String (Positive, Neutral, Negative)",
        "summary": "String (Max 25 words)",
        "recommended_department": "String (Matched with category)",
        "extracted_entities": {
          "location": "String or null",
          "time_reference": "String or null",
          "service": "String or null"
        }
      }

      Rules:
      1. Priority 'Urgent' if there is immediate danger or public health risk.
      2. If unsure about any field, return null.
      3. Keep the tone neutral.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text());
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return null;
    }
};
