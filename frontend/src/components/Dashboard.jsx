import React from 'react';
import HomePage from './HomePage';

const Dashboard = () => {
  const role = localStorage.getItem('role');

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      {role === 'admin' ? (
        <p>You are logged in as an Admin.</p>
      ) : (
        <p>You are logged in as a User.</p>
      )}
      <HomePage /> {/* Show products here */}
    </div>
  );
};

export default Dashboard;
