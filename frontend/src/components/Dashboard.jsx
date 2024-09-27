// src/components/Dashboard.js
import React from 'react';

const Dashboard = () => {
    const role = localStorage.getItem('role'); // Assuming you store role after login

    return (
        <div>
            <h1>Welcome to the Dashboard!</h1>
            {role === 'admin' ? (
                <p>You are logged in as an Admin. Here is your admin-specific dashboard.</p>
            ) : (
                <p>You are logged in as a User. This is your user dashboard.</p>
            )}
        </div>
    );
};

export default Dashboard;
