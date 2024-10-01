// src/components/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import './Register.css';
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
            setSuccess(true);
            navigate('/login'); // Redirect to login after registration
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
            <p>Already registered? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'blue' }}>Login here</span></p>
        </div>
    );
};

export default Register;
