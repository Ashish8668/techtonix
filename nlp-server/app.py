import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-1.5-flash" 

# SPECIFIC CATEGORIES FOR HACKATHON
HACKATHON_CATEGORIES = ["Sanitation", "Parivahan", "Ladki Bahin", "Niradhar", "PM Kisan"]

PROMPT_TEMPLATE = """
As a government AI assistant, analyze the citizen complaint and return ONLY a valid JSON object.

Complaint: {text}

JSON Schema:
{{
  "category": "Must be EXACTLY one of: {categories}",
  "priority": "Low, Medium, High, or Urgent",
  "summary": "Short summary (max 15 words)",
  "location": "Extracted location or 'Unknown'",
  "key_problem": "The main issue described"
}}

Rules:
1. ONLY return the JSON. No markdown, no pre-amble.
2. If the complaint doesn't fit a category perfectly, pick the closest one.
3. Priority 'Urgent' for safety or critical welfare issues.
"""

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    complaint_text = data.get('text', '')

    if not complaint_text:
        return jsonify({"error": "No text provided"}), 400

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = PROMPT_TEMPLATE.format(
            text=complaint_text, 
            categories=", ".join(HACKATHON_CATEGORIES)
        )
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1
            ),
        )

        if response.text:
            analysis = json.loads(response.text)
            return jsonify(analysis)
        else:
            return jsonify({"error": "Empty response from Gemini"}), 500
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    if not GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY missing.")
    app.run(port=5000, debug=True)
