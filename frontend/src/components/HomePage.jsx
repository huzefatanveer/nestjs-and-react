// src/components/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import Modal from 'react-modal';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    setModalIsOpen(true); // Open modal when "Add to Cart" is clicked
    toast.info("You need to login to proceed further.", {
      position: toast.position,
      autoClose: 2000, // Toast will close after 2 seconds
    });
  };

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
      }

      setModalIsOpen(false); // Close modal after successful login
    } catch (error) {
      console.error('Error logging in', error);
      alert('Invalid credentials');
    }
  };

  // Custom styles for the modal
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: '100%',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      width: '300px',
      textAlign: 'center',
    },
  };

  return (
    <div className="homepage">
      <ToastContainer />
      <h1>Products</h1>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <img src={`http://localhost:3000/uploads/${product.imageUrl}`} alt={product.name} />
            <p>{product.description}</p>
            <p>${product.price}</p>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
            >
              Add to cart
            </button>
          </li>
        ))}
      </ul>

      {/* Modal for login */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Login Modal"
      >
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>Not registered? <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: 'blue' }}>Register here</span></p>
      </Modal>
    </div>
  );
};

export default HomePage;
