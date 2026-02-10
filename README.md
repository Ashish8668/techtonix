# CitizenConnect: AI-Powered Complaint System

CitizenConnect is a government-style complaint reporting system that uses Google Gemini AI (via a Flask NLP Server) to automatically analyze and route citizen issues.

## Tech Stack
- **Frontend**: React (Vite) + Lucide Icons + Framer Motion
- **Database**: Firebase Auth + Firestore
- **NLP Server**: Flask + Google Gemini AI

## Prerequisites
1. **Firebase Project**: Create a project and enable Auth & Firestore.
2. **Gemini API Key**: Get a free API key from [Google AI Studio](https://aistudio.google.com/).
3. **Python 3.x**: Required for the NLP server.

## Setup Instructions

### 1. NLP Server Configuration
Create a `.env` file in the `nlp-server` directory:
```env
GEMINI_API_KEY=your_gemini_api_key
```

Install and run:
```bash
cd nlp-server
pip install -r requirements.txt
python app.py
```

### 2. Frontend Configuration
Create a `.env` file in the `frontend` directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- **AI Auto-Analysis**: Uses Gemini 1.5 Flash (via Flask) to categorize, prioritize, and summarize complaints instantly.
- **Role-Based Dashboards**: Separate views for Citizens, Department Officers, and Admins.
- **Audit Trail**: Every status change is tracked in real-time on the complaint timeline.
- **Privacy Conscious**: Sensitive data is processed via your own secure Flask endpoint.
