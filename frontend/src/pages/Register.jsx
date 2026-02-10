import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'user', // Default to citizen
        city: '',
        state: ''
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

            // Save user info to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                city: formData.city,
                state: formData.state,
                is_active: true,
                created_at: serverTimestamp(),
                last_login: serverTimestamp()
            });

            navigate(formData.role === 'user' ? '/dashboard' : '/dept-dashboard');
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
                <h2>Citizen Registration</h2>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                <form onSubmit={handleRegister}>
                    <input name="name" placeholder="Full Name" onChange={handleChange} required />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                    <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
                    <input name="city" placeholder="City" onChange={handleChange} required />
                    <input name="state" placeholder="State" onChange={handleChange} required />
                    <select name="role" onChange={handleChange}>
                        <option value="user">Citizen</option>
                        <option value="department">Department Officer</option>
                    </select>
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Registering...' : 'Create Account'}
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
