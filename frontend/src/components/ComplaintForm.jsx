import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { analyzeComplaint } from '../gemini';

const ComplaintForm = ({ onComplete }) => {
    const { currentUser } = useAuth();
    const [complaintText, setComplaintText] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!complaintText.trim()) return;

        setLoading(true);
        console.log("📝 User Action: Submitting complaint to system...");
        try {
            // DIRECT CALL TO GEMINI FROM FRONTEND (No Flask Server Needed)
            const data = await analyzeComplaint(complaintText);

            if (!data) {
                console.warn("⚠️ System: AI Analysis failed or returned empty.");
                alert('AI Analysis failed. Checking connection...');
                setLoading(false);
                return;
            }

            console.log("💾 Database: Preparing to save complaint...");
            setAnalysis(data);

            // Store in Firestore with consistent fields
            await addDoc(collection(db, 'reports'), {
                user_id: currentUser.uid,
                complaint_text: complaintText,
                category: data.category,
                priority: data.priority,
                summary: data.summary,
                key_problem: data.key_problem,
                status: 'Submitted',
                location: {
                    city: data.location || 'Unknown',
                    state: 'Maharashtra' // Default for demo
                },
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });

            alert('Complaint submitted successfully!');
            onComplete();
        } catch (err) {
            console.error(err);
            alert('Submission failed. Check your Gemini API Key in .env');
        }
        setLoading(false);
    };

    return (
        <div className="card">
            <h3>Submit a New Complaint</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                Our AI will automatically categorize and route your issue to the correct department.
            </p>
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="6"
                    placeholder="Describe your issue here..."
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    required
                ></textarea>

                {analysis && (
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px', marginBottom: '15px', borderLeft: '4px solid #003366' }}>
                        <p><strong>Auto-Analysis:</strong></p>
                        <p>Category: <strong>{analysis.category}</strong></p>
                        <p>Priority: {analysis.priority}</p>
                        <p>Summary: {analysis.summary}</p>
                    </div>
                )}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'AI is analyzing...' : 'Submit Complaint'}
                </button>
            </form>
        </div>
    );
};

export default ComplaintForm;
