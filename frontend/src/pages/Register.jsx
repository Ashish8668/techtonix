import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

// CONSISTENT NOMENCLATURE FOR HACKATHON
export const DEPARTMENTS = [
    "Sanitation",
    "Parivahan",
    "Ladki Bahin",
    "Niradhar",
    "PM Kisan"
];

const Register = () => {
    const [regType, setRegType] = useState('user'); // 'user' or 'department'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        city: '',
        state: '',
        category: '' // Must match DEPARTMENTS array
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            if (regType === 'user') {
                await setDoc(doc(db, 'users', user.uid), {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    role: 'user',
                    city: formData.city,
                    state: formData.state,
                    created_at: serverTimestamp()
                });
                navigate('/dashboard');
            } else {
                await setDoc(doc(db, 'departments', user.uid), {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    category: formData.category, // e.g. "Ladki Bahin"
                    city: formData.city,
                    state: formData.state,
                    role: 'department',
                    created_at: serverTimestamp()
                });
                navigate('/dept-dashboard');
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '2px solid #eee' }}>
                    <button
                        onClick={() => setRegType('user')}
                        style={{
                            flex: 1,
                            background: 'none',
                            color: regType === 'user' ? 'var(--primary-color)' : '#999',
                            borderBottom: regType === 'user' ? '2px solid var(--primary-color)' : 'none',
                            borderRadius: 0,
                            padding: '10px'
                        }}
                    >
                        Citizen Register
                    </button>
                    <button
                        onClick={() => setRegType('department')}
                        style={{
                            flex: 1,
                            background: 'none',
                            color: regType === 'department' ? 'var(--primary-color)' : '#999',
                            borderBottom: regType === 'department' ? '2px solid var(--primary-color)' : 'none',
                            borderRadius: 0,
                            padding: '10px'
                        }}
                    >
                        Department Register
                    </button>
                </div>

                <h2>{regType === 'user' ? 'Citizen' : 'Department'} Registration</h2>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

                <form onSubmit={handleRegister}>
                    <input
                        name="name"
                        placeholder={regType === 'user' ? "Full Name" : "Department Portal Name"}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Official Email Address"
                        onChange={handleChange}
                        required
                    />

                    {regType === 'department' && (
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '0.85rem', color: '#666' }}>Select Department:</label>
                            <select name="category" onChange={handleChange} required>
                                <option value="">-- Choose Category --</option>
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <input name="phone" placeholder="Contact Number" onChange={handleChange} required />
                    <input name="city" placeholder="City" onChange={handleChange} required />
                    <input name="state" placeholder="State" onChange={handleChange} required />
                    <input name="password" type="password" placeholder="Set Password" onChange={handleChange} required />

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : `Confirm ${regType === 'user' ? 'Registration' : 'Department Portal'}`}
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
