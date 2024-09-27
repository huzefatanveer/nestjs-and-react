// src/components/Register.js
import { useState } from 'react';
import axios from 'axios';
import './Register.css';  // Assuming you're adding CSS for styling
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!email || !password) {
            setError('Both fields are required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/users', { email, password });
            console.log('Registration successful', response.data);
            const { access_token, role } = response.data;
            setSuccess(true);
            // You can redirect to login or dashboard here
          //  localStorage.setItem('token', access_token); // Save token to localStorage
            localStorage.setItem('role', role);
            if (role === 'admin') {
                navigate('/admin'); // Redirect to admin panel
              } else {
                navigate('/dashboard'); // Redirect to user dashboard
              }
        } catch (err) {
            console.error('Registration error', err.response?.data || err.message);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Registration successful! Please login.</p>}
            <form onSubmit={handleRegister} className="register-form">
                <input
                    type="email"
                    placeholder="Email"
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;



