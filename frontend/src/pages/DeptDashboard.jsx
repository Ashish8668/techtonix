import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const DeptDashboard = () => {
    const { currentUser, userData } = useAuth();
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [updateMsg, setUpdateMsg] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            // For simplicity, showing all reports in the same city for the department
            // Real app would filter by department_id and city
            const q = query(collection(db, 'reports'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReports(data.filter(r => r.location?.city === userData?.city));
        };
        fetchReports();
    }, [userData]);

    const handleUpdateStatus = async (reportId, newStatus) => {
        try {
            // 1. Update report status
            await updateDoc(doc(db, 'reports', reportId), {
                status: newStatus,
                updated_at: serverTimestamp(),
                assigned_officer_id: currentUser.uid
            });

            // 2. Add to report_updates collection
            await addDoc(collection(db, 'report_updates'), {
                report_id: reportId,
                updated_by: currentUser.uid,
                message: updateMsg || `Status updated to ${newStatus}`,
                status: newStatus,
                timestamp: serverTimestamp()
            });

            alert('Report updated successfully');
            setUpdateMsg('');
            setSelectedReport(null);
            // Refresh logic here
        } catch (err) {
            console.error(err);
            alert('Error updating report');
        }
    };

    return (
        <div className="dashboard-layout">
            <div className="sidebar">
                <h3>Civic Portal</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Dept: {userData?.role}</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '40px' }}>Location: {userData?.city}</p>
            </div>
            <div className="main-content">
                <h2>Department Dashboard</h2>
                <div className="reports-list">
                    {reports.map(report => (
                        <div key={report.id} className="card" onClick={() => setSelectedReport(report)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h4>ID: {report.id.substring(0, 8)}</h4>
                                <span className={`status-badge status-${report.status.toLowerCase().replace(' ', '')}`}>
                                    {report.status}
                                </span>
                            </div>
                            <p style={{ margin: '10px 0' }}>{report.complaint_text}</p>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                <p>Priority: {report.priority} | Category: {report.category}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedReport && (
                    <div className="modal" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <div className="auth-card" style={{ maxWidth: '600px' }}>
                            <h3>Update Complaint Status</h3>
                            <p><strong>Complaint:</strong> {selectedReport.complaint_text}</p>
                            <textarea
                                placeholder="Add a remark (e.g., 'Work order issued to contractor...')"
                                value={updateMsg}
                                onChange={(e) => setUpdateMsg(e.target.value)}
                            ></textarea>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn-primary" onClick={() => handleUpdateStatus(selectedReport.id, 'In Progress')}>In Progress</button>
                                <button className="btn-primary" style={{ background: '#28a745' }} onClick={() => handleUpdateStatus(selectedReport.id, 'Resolved')}>Resolve</button>
                                <button className="btn-primary" style={{ background: '#dc3545' }} onClick={() => handleUpdateStatus(selectedReport.id, 'Rejected')}>Reject</button>
                                <button onClick={() => setSelectedReport(null)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeptDashboard;
