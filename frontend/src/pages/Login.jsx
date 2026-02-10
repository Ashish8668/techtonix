import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [loginType, setLoginType] = useState('user'); // 'user' or 'department'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Check role and redirect
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;

                // Verify if they are logging into the right section
                if (role !== loginType) {
                    setError(`This account is not registered as a ${loginType === 'user' ? 'Citizen' : 'Department'}.`);
                    setLoading(false);
                    return;
                }

                if (role === 'user') navigate('/dashboard');
                else if (role === 'department') navigate('/dept-dashboard');
                else if (role === 'admin') navigate('/admin-dashboard');
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '2px solid #eee' }}>
                    <button
                        onClick={() => setLoginType('user')}
                        style={{
                            flex: 1,
                            background: 'none',
                            color: loginType === 'user' ? 'var(--primary-color)' : '#999',
                            borderBottom: loginType === 'user' ? '2px solid var(--primary-color)' : 'none',
                            borderRadius: 0,
                            padding: '10px'
                        }}
                    >
                        Citizen Login
                    </button>
                    <button
                        onClick={() => setLoginType('department')}
                        style={{
                            flex: 1,
                            background: 'none',
                            color: loginType === 'department' ? 'var(--primary-color)' : '#999',
                            borderBottom: loginType === 'department' ? '2px solid var(--primary-color)' : 'none',
                            borderRadius: 0,
                            padding: '10px'
                        }}
                    >
                        Department Login
                    </button>
                </div>

                <h2>{loginType === 'user' ? 'Citizen' : 'Department'} Login</h2>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder={`${loginType === 'user' ? 'Citizen' : 'Department'} Email`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Logging in...' : `Login as ${loginType === 'user' ? 'Citizen' : 'Department'}`}
                    </button>
                </form>
                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                    New {loginType === 'user' ? 'citizen' : 'department'}? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
