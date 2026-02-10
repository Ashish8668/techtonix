import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, updateDoc, doc, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const DeptDashboard = () => {
    const { currentUser, userData } = useAuth();
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [updateMsg, setUpdateMsg] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            if (!userData) return;

            // Fetching reports that match this department's category AND city for consistency
            const q = query(
                collection(db, 'reports'),
                where('category', '==', userData.category),
                where('location.city', '==', userData.city)
            );

            try {
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReports(data);
            } catch (err) {
                console.error("Error fetching dept reports:", err);
                // Fallback: search all if category filtering fails (indexing might be needed)
                const fallbackQ = query(collection(db, 'reports'));
                const snap = await getDocs(fallbackQ);
                const allData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReports(allData.filter(r => r.category === userData.category && r.location?.city === userData.city));
            }
        };
        fetchReports();
    }, [userData]);

    const handleUpdateStatus = async (reportId, newStatus) => {
        try {
            await updateDoc(doc(db, 'reports', reportId), {
                status: newStatus,
                updated_at: serverTimestamp(),
                assigned_dept_id: currentUser.uid
            });

            await addDoc(collection(db, 'report_updates'), {
                report_id: reportId,
                updated_by: userData?.name || 'Department Admin',
                message: updateMsg || `Complaint marked as ${newStatus}`,
                status: newStatus,
                timestamp: serverTimestamp()
            });

            alert('Case Status Updated!');
            setUpdateMsg('');
            setSelectedReport(null);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    return (
        <div className="dashboard-layout">
            <div className="sidebar">
                <h3>Department Portal</h3>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '10px 0' }}>{userData?.name}</p>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '0.9rem' }}>📍 City: {userData?.city}</p>
                    <p style={{ fontSize: '0.9rem' }}>📂 Category: <strong>{userData?.category}</strong></p>
                </div>
                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Shared Credentials Active</p>
            </div>

            <div className="main-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2>Pending Complaints: {userData?.category}</h2>
                    <span className="status-badge status-progress">{reports.length} Active Cases</span>
                </div>

                <div className="reports-list">
                    {reports.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
                            <p>No complaints found for <strong>{userData?.category}</strong> in <strong>{userData?.city}</strong>.</p>
                        </div>
                    ) : reports.map(report => (
                        <div key={report.id} className="card" onClick={() => setSelectedReport(report)} style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h4>Case Ref: {report.id.substring(0, 8)}</h4>
                                <span className={`status-badge status-${report.status?.toLowerCase().replace(' ', '')}`}>
                                    {report.status}
                                </span>
                            </div>
                            <p style={{ margin: '15px 0', fontSize: '1.1rem' }}>{report.complaint_text}</p>
                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem' }}>
                                <span className={`priority-${report.priority?.toLowerCase()}`}>Priority: {report.priority}</span>
                                <span style={{ color: '#666' }}>Location: {report.location?.city}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedReport && (
                    <div className="modal" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                    }}>
                        <div className="auth-card" style={{ maxWidth: '600px', width: '95%' }}>
                            <h3>Resolve Complaint</h3>
                            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px', marginBottom: '20px', borderLeft: '4px solid var(--primary-color)' }}>
                                <p><strong>Details:</strong> {selectedReport.complaint_text}</p>
                                <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#555' }}><strong>AI Summary:</strong> {selectedReport.summary}</p>
                            </div>

                            <textarea
                                rows="3"
                                placeholder="Public remark for the citizen..."
                                value={updateMsg}
                                onChange={(e) => setUpdateMsg(e.target.value)}
                            ></textarea>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <button className="btn-primary" onClick={() => handleUpdateStatus(selectedReport.id, 'In Progress')}>In Progress</button>
                                <button className="btn-primary" style={{ background: '#28a745' }} onClick={() => handleUpdateStatus(selectedReport.id, 'Resolved')}>Mark Resolved</button>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    style={{ background: '#eee', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeptDashboard;
