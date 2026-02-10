import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import DeptDashboard from './pages/DeptDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

const PrivateRoute = ({ children, role }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  if (role && userData?.role !== role) {
    if (userData?.role === 'admin') return <Navigate to="/admin-dashboard" />;
    if (userData?.role === 'department') return <Navigate to="/dept-dashboard" />;
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute role="user">
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dept-dashboard"
            element={
              <PrivateRoute role="department">
                <DeptDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          {/* Redirect to login by default */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
