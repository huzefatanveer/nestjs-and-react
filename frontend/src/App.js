import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const App = () => {
    const userRole = localStorage.getItem('role'); // Assuming the role is stored after login
    console.log('userRole is :', userRole)

    return (
        <Router>
            <Routes>
                {/* Redirect to the register page when the app starts */}
                <Route path="/" element={<Navigate to="/register" />} />

                {/* Define the routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Protect the AdminPanel route, only accessible to admin users */}
                <Route
                    path="/admin" element={<AdminPanel/>}
                  
                />
            </Routes>
        </Router>
    );
};

export default App;
