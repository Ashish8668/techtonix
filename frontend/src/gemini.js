import { GoogleGenAI } from "@google/genai";

// Initialize the new GenAI SDK
// It will attempt to find the API key in the environment
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (apiKey) {
  console.log(`📡 New GenAI SDK: Key detected (${apiKey.substring(0, 4)}...)`);
}

const ai = new GoogleGenAI({
  apiKey: apiKey
});

const HACKATHON_CATEGORIES = ["Sanitation", "Parivahan", "Ladki Bahin", "Niradhar", "PM Kisan"];

export const analyzeComplaint = async (text) => {
  console.log("🤖 Gemini AI (vNext): Starting analysis...");

  const prompt = `
        As a government AI assistant, analyze the citizen complaint and return ONLY a valid JSON object.

        Complaint: ${text}

        JSON Schema:
        {
          "category": "Must be EXACTLY one of: ${HACKATHON_CATEGORIES.join(", ")}",
          "priority": "Low, Medium, High, or Urgent",
          "summary": "Short summary (max 15 words)",
          "location": "Extracted location (city) or 'Unknown'",
          "key_problem": "The main issue described"
        }

        Rules:
        1. ONLY return the JSON. No markdown, no pre-amble.
        2. If the complaint doesn't fit a category perfectly, pick the closest one.
        3. Priority 'Urgent' for safety or critical welfare issues.
    `;

  try {
    // Attempt using the requested v2.5-flash model
    console.log("🚀 Attempting with model: gemini-2.5-flash");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        response_mime_type: "application/json",
        temperature: 0.1
      }
    });

    const data = JSON.parse(response.text);
    console.log("✅ Analysis Complete (2.5-flash):", data);
    return data;

  } catch (err) {
    console.warn("⚠️ Model 2.5 failed, attempting fallback to gemini-3-flash-preview...");
    try {
      // Fallback to gemini-3-flash-preview as requested
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          response_mime_type: "application/json",
          temperature: 0.1
        }
      });

      const data = JSON.parse(fallbackResponse.text);
      console.log("✅ Analysis Complete (3-flash-preview):", data);
      return data;
    } catch (fallbackErr) {
      console.error("❌ All models failed:", fallbackErr.message);

      // Final safety fallback to a known stable model if both experimental ones fail
      try {
        console.log("🛡️ Safety Fallback: gemini-2.0-flash");
        const safetyResponse = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            response_mime_type: "application/json"
          }
        });
        return JSON.parse(safetyResponse.text);
      } catch (safetyErr) {
        console.error("🛑 CRITICAL: Safety model also failed.");
        return null;
      }
    }
  }
};
