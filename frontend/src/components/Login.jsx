// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth', { email, password });
      const { access_token, role } = response.data;

      localStorage.setItem('token', access_token); // Save token to localStorage
      localStorage.setItem('role', role); // Save user role to localStorage
      
      if (role === 'admin') {
        navigate('/admin'); // Redirect to admin panel
      } else {
        navigate('/dashboard'); // Redirect to user dashboard
      }// Redirect to user dashboard
    } catch (error) {
      console.error('Error logging in', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>Not registered? <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: 'blue' }}>Register here</span></p>
    </div>
  );
};

export default Login;
