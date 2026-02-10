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

MODEL_NAME = "gemini-1.5-flash" # Stable version (User mentioned 2.5, but 1.5/2.0 are current)

PROMPT_TEMPLATE = """
As a government NLP assistant, analyze the following citizen complaint and return ONLY a valid JSON object.
Do not include any greeting or explanation.

Complaint: {text}

JSON Format:
{{
  "category": "String (e.g., Sanitation, Roads, Water, Electricity, Public Safety)",
  "priority": "String (Low, Medium, High, Urgent)",
  "sentiment": "String (Positive, Neutral, Negative)",
  "summary": "String (Max 25 words)",
  "recommended_department": "String (Matched with category)",
  "extracted_entities": {{
    "location": "String or null",
    "time_reference": "String or null",
    "service": "String or null"
  }}
}}

Rules:
1. Priority 'Urgent' if there is immediate danger or public health risk.
2. If unsure about any field, return null.
3. Keep the tone neutral.
"""

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    complaint_text = data.get('text', '')

    if not complaint_text:
        return jsonify({"error": "No text provided"}), 400

    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = PROMPT_TEMPLATE.format(text=complaint_text)
        
        # Using generate_content for Gemini
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
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
    # Add a check for API key
    if not GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY not found in environment variables.")
    app.run(port=5000, debug=True)
