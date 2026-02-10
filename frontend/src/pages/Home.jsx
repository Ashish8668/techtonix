import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ background: '#fff', color: '#333' }}>
            {/* Hero Section */}
            <header style={{
                background: 'linear-gradient(135deg, #003366 0%, #00509d 100%)',
                color: 'white',
                padding: '100px 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Digital Citizen Grievance Portal</h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 40px', opacity: 0.9 }}>
                        Report civic issues, track resolution progress in real-time, and help us build a smarter, more responsive city using AI-powered routing.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <Link to="/register" className="btn-primary" style={{ width: 'auto', padding: '15px 40px', fontSize: '1.1rem', background: '#fca311', color: '#003366' }}>
                            File a Complaint
                        </Link>
                        <Link to="/login" style={{ color: 'white', border: '1px solid white', padding: '15px 40px', borderRadius: '4px', textDecoration: 'none', fontWeight: '600' }}>
                            Track Status
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section style={{ padding: '80px 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '50px' }}>How It Works</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                        <div className="card" style={{ padding: '40px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📝</div>
                            <h3>Submit</h3>
                            <p>Describe your issue in plain language. Our AI will automatically identify the category and urgency.</p>
                        </div>
                        <div className="card" style={{ padding: '40px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚡</div>
                            <h3>Route</h3>
                            <p>Your complaint is instantly routed to the correct department (Water, Roads, Sanitation, etc.) without manual delay.</p>
                        </div>
                        <div className="card" style={{ padding: '40px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛠️</div>
                            <h3>Resolve</h3>
                            <p>Officials update the status as they work. You get real-time timeline updates until the issue is fixed.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{ background: '#f8f9fa', padding: '60px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                        <h2 style={{ color: 'var(--primary-color)' }}>24/7</h2>
                        <p>Availability</p>
                    </div>
                    <div>
                        <h2 style={{ color: 'var(--primary-color)' }}>100%</h2>
                        <p>Transparency</p>
                    </div>
                    <div>
                        <h2 style={{ color: 'var(--primary-color)' }}>Zero</h2>
                        <p>Paperwork</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#333', color: '#ccc', padding: '60px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ color: 'white' }}>CitizenConnect</h3>
                        <p>Empowering citizens through technology.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <div>
                            <h4 style={{ color: 'white' }}>Quick Links</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li><Link to="/contact" style={{ color: '#ccc', textDecoration: 'none' }}>Contact Us</Link></li>
                                <li><Link to="/login" style={{ color: '#ccc', textDecoration: 'none' }}>Department Login</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="container" style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid #444', paddingTop: '20px' }}>
                    <p>© 2026 Government Grievance Redressal System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
