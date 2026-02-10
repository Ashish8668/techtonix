import React, { useState } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const ComplaintForm = ({ onComplete }) => {
    const { currentUser } = useAuth();
    const [complaintText, setComplaintText] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!complaintText.trim()) return;

        setLoading(true);
        try {
            // 1. Call Local NLP Server (which now uses Gemini)
            const nlpResponse = await axios.post('http://localhost:5000/analyze', {
                text: complaintText
            });
            const data = nlpResponse.data;

            setAnalysis(data);

            // 2. Store in Firestore
            await addDoc(collection(db, 'reports'), {
                user_id: currentUser.uid,
                complaint_text: complaintText,
                category: data.category,
                priority: data.priority,
                sentiment: data.sentiment,
                summary: data.summary,
                recommended_department: data.recommended_department,
                status: 'Submitted',
                location: {
                    city: data.extracted_entities?.location || 'Unknown',
                    ward: null
                },
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            });

            alert('Complaint submitted successfully!');
            onComplete();
        } catch (err) {
            console.error(err);
            alert('Error submitting complaint. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="card">
            <h3>Submit a New Complaint</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                Please describe your issue in detail. Our AI will automatically analyze and route it to the correct department.
            </p>
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="6"
                    placeholder="Describe your issue here (e.g., 'Street lights are not working in Shivaji Nagar since last 3 days...')"
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    required
                ></textarea>

                {analysis && (
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
                        <p><strong>Auto-Analysis:</strong></p>
                        <p>Category: {analysis.category}</p>
                        <p>Priority: {analysis.priority}</p>
                        <p>Summary: {analysis.summary}</p>
                    </div>
                )}

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Analyzing and Submitting...' : 'Submit Complaint'}
                </button>
            </form>
        </div>
    );
};

export default ComplaintForm;
