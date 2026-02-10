import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, reports: 0, departments: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [userSnap, reportSnap, deptSnap] = await Promise.all([
                getDocs(collection(db, 'users')),
                getDocs(collection(db, 'reports')),
                getDocs(collection(db, 'departments'))
            ]);
            setStats({
                users: userSnap.size,
                reports: reportSnap.size,
                departments: deptSnap.size
            });
            setLoading(false);
        };
        fetchStats();
    }, []);

    return (
        <div className="dashboard-layout">
            <div className="sidebar">
                <h3>Admin Panel</h3>
                <p>System Administrator</p>
            </div>
            <div className="main-content">
                <h2>System Overview</h2>
                <div className="stats-row" style={{ display: 'flex', gap: '20px' }}>
                    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
                        <h3>{stats.users}</h3>
                        <p>Registered Citizens</p>
                    </div>
                    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>📄</div>
                        <h3>{stats.reports}</h3>
                        <p>Total Reports</p>
                    </div>
                    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏢</div>
                        <h3>{stats.departments}</h3>
                        <p>Departments</p>
                    </div>
                </div>

                <div className="card" style={{ marginTop: '20px' }}>
                    <h3>Recent Activity</h3>
                    <p>Activity log for system administrators will appear here.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
