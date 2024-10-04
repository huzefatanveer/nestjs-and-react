// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from './stripeConfig';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuccessPage from './components/Success';

const App = () => {
    const userRole = localStorage.getItem('role');
    console.log('userRole is:', userRole);

    return (
        <Router>
            <Elements stripe={stripePromise}>
                <ToastContainer position="top-center" />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route
                        path="/admin"
                        element={userRole === 'admin' ? <AdminPanel /> : <Login />}
                    />
                </Routes>
            </Elements>
        </Router>
    );
};

export default App;