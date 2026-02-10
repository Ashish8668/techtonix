import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [loginType, setLoginType] = useState('user'); // 'user' (Citizen) or 'department'
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

            // Determine which collection to check
            const collectionName = loginType === 'user' ? 'users' : 'departments';
            const userDoc = await getDoc(doc(db, collectionName, userCredential.user.uid));

            if (userDoc.exists()) {
                if (loginType === 'user') navigate('/dashboard');
                else navigate('/dept-dashboard');
            } else {
                setError(`Account verified but not found in ${loginType === 'user' ? 'Citizens' : 'Departments'} collection. Please ensure you registered in the correct category.`);
                await auth.signOut();
            }
        } catch (err) {
            console.error("Login Error Details:", err.code, err.message);
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError("Invalid email or password. Please check your credentials.");
            } else if (err.code === 'auth/invalid-api-key') {
                setError("Firebase API Key is invalid. Check your .env file.");
            } else {
                setError("Login failed. Check your internet or Firebase console (Auth must be enabled).");
            }
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
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
