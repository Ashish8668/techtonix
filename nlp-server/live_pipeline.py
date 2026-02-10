"""
FILE: live_pipeline.py
PURPOSE: Implements a real-time AI classification system using the 
Google Gemini 2.5 Flash model (mapped to 1.5-flash for stability). 
This demonstrates the transition from traditional NLP to zero-shot 
LLM-based classification.
"""

import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load API Configuration
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def process_report_live(report_text):
    """
    Processes a raw report using Google Gemini Generative AI to 
    extract structured information without pre-defined keyword lists.
    """
    if not GEMINI_API_KEY:
        return {"error": "API Key missing. Please set GEMINI_API_KEY in .env"}

    # Initialize Gemini Configuration
    genai.configure(api_key=GEMINI_API_KEY)
    
    # Model: Using the target architecture for Gemini 2.5 Flash capabilities
    # Note: 1.5-flash is used here as the stable implementation endpoint
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.1,  # Low temperature for precise classification
        }
    )

    # SECURE PROMPT: Enforces strict JSON structure and schema adherence
    prompt = f"""
    You are an intelligent report classification AI.
    Given the following report text, extract and return ONLY valid JSON with:
    {{
      "category": "High-level department or issue type",
      "summary": "Brief explanation of the core issue",
      "key_problem": "The specific root cause or main complain point",
      "location": "A specific location mentioned, or 'Unknown'"
    }}
    Rules:
    - Output JSON only
    - No markdown
    - No explanations
    - Keep summary concise (max 3 lines)

    Report Text: {report_text}
    """

    try:
        # Perform Inference
        response = model.generate_content(prompt)
        
        if not response.text:
            raise ValueError("Zero-length response from AI model.")

        # Parsing result
        raw_output = response.text.strip()
        analysis_result = json.loads(raw_output)
        
        return analysis_result

    except json.JSONDecodeError:
        return {"error": "AI response was not valid JSON."}
    except Exception as e:
        return {"error": f"Live Pipeline Failure: {str(e)}"}

# Demo Entry Point
if __name__ == "__main__":
    report_sample = "Heavy garbage dumping seen near the bus stand. The smell is unbearable since Monday."
    print("Executing Live AI Pipeline...")
    output = process_report_live(report_sample)
    print(json.dumps(output, indent=2))
