import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

const Navbar = () => {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav style={{
            background: 'var(--primary-color)',
            color: 'white',
            padding: '15px 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    CitizenConnect
                </Link>

                <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem' }}>Home</Link>

                    {currentUser ? (
                        <>
                            {userData?.role === 'user' ? (
                                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem' }}>My Cases</Link>
                            ) : (
                                <Link to="/dept-dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem' }}>Case Queue</Link>
                            )}
                            <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem' }}>Contact Us</Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    color: 'white',
                                    padding: '6px 15px',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '0.95rem' }}>Contact Us</Link>
                            <Link to="/login" style={{
                                background: 'var(--accent-color)',
                                color: 'var(--primary-color)',
                                textDecoration: 'none',
                                padding: '8px 20px',
                                borderRadius: '4px',
                                fontWeight: '600'
                            }}>
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
