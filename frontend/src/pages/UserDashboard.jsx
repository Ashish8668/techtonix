import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import ComplaintForm from '../components/ComplaintForm';

const UserDashboard = () => {
    const { currentUser, userData } = useAuth();
    const [reports, setReports] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            const q = query(
                collection(db, 'reports'),
                where('user_id', '==', currentUser.uid),
                orderBy('created_at', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReports(data);
        };
        fetchReports();
    }, [currentUser.uid]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Submitted': return 'status-submitted';
            case 'In Progress': return 'status-progress';
            case 'Resolved': return 'status-resolved';
            case 'Rejected': return 'status-rejected';
            default: return '';
        }
    };

    return (
        <div className="dashboard-layout">
            <div className="sidebar">
                <h3>CitizenConnect</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '40px' }}>Welcome, {userData?.name}</p>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'View Complaints' : 'Submit New Complaint'}
                </button>
            </div>
            <div className="main-content">
                {showForm ? (
                    <ComplaintForm onComplete={() => { setShowForm(false); /* Refresh logic here */ }} />
                ) : (
                    <>
                        <h2>My Complaints</h2>
                        <div className="stats-row" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                            <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', marginBottom: '10px' }}>💬</div>
                                <h3>{reports.length}</h3>
                                <p>Total Submitted</p>
                            </div>
                            <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
                                <h3>{reports.filter(r => r.status === 'Resolved').length}</h3>
                                <p>Resolved</p>
                            </div>
                        </div>

                        <div className="reports-list">
                            {reports.map(report => (
                                <div key={report.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span className={`status-badge ${getStatusClass(report.status)}`}>{report.status}</span>
                                        <span className="text-light" style={{ fontSize: '0.8rem' }}>
                                            {report.created_at?.toDate().toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4>{report.category}</h4>
                                    <p style={{ margin: '10px 0', fontSize: '0.95rem' }}>{report.summary || report.complaint_text.substring(0, 100) + '...'}</p>
                                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
                                        <span className={`priority-${report.priority?.toLowerCase()}`}>Priority: {report.priority}</span>
                                        <span>Location: {report.location?.city || 'Not specified'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
