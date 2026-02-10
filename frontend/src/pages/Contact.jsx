import React, { useState } from 'react';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="container" style={{ padding: '80px 20px', maxWidth: '800px' }}>
            <div className="card" style={{ padding: '40px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Contact Support</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
                    Facing technical issues or have a query? Send us a message and our team will get back to you.
                </p>

                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#e8f5e9', borderRadius: '8px' }}>
                        <h3 style={{ color: '#2e7d32' }}>✅ Message Sent!</h3>
                        <p>Thank you for reaching out. We will contact you shortly.</p>
                        <button onClick={() => setSubmitted(false)} className="btn-primary" style={{ marginTop: '20px', width: 'auto' }}>
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ fontSize: '0.9rem', color: '#555' }}>Full Name</label>
                                <input type="text" placeholder="John Doe" required />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.9rem', color: '#555' }}>Email Address</label>
                                <input type="email" placeholder="john@example.com" required />
                            </div>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <label style={{ fontSize: '0.9rem', color: '#555' }}>Subject</label>
                            <input type="text" placeholder="How can we help?" required />
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <label style={{ fontSize: '0.9rem', color: '#555' }}>Message</label>
                            <textarea rows="6" placeholder="Type your message here..." required></textarea>
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
                            Submit Message
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <h4 style={{ color: 'var(--primary-color)' }}>📍 Office Location</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            Municipal Corporation Building,<br />
                            Main Secretariat, City Center,<br />
                            Digital State - 400001
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--primary-color)' }}>📞 Helpline</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            Toll-Free: 1800-111-AI-HELP<br />
                            Email: support@citizenconnect.gov.in<br />
                            Response Time: 24-48 Hours
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
