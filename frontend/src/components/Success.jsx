import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Success.css';
import axios from 'axios';

const SuccessPage = () => {
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const orderId = localStorage.getItem('orderId');

  useEffect(() => {
    if (!orderId) {
      navigate('/cart'); // Redirect to cart if no orderId is found
    } else {
      // Fetch the order details using orderId from the backend
      fetchOrderDetails(orderId);
    }
  }, [orderId, navigate]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:3000/orders/${orderId}`, 
        {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }
      )   
      
      setOrder(response.data); // Use response.data directly
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  // Check if order is null or not fetched yet
  if (!order) {
    return <div>Loading order details...</div>; // Display loading message
  }

  return (
    <div className="success-page">
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Here are your order details:</p>
      <div className="order-details">
        <h2>Order ID: {order.id}</h2>
        <p>Total Price: ${(order.totalPrice / 100).toFixed(2)}</p>
        <p>Status: {order.status}</p>
        <h3>Products:</h3>
        <ul>
          {order.orderProducts.map((product) => (
            <li key={product.id}>
              <div>
                <img src={`http://localhost:3000/uploads/${product.imageUrl}`} alt={product.name} width={50} />
                <p>{product.name}</p>
                <p>Quantity: {product.quantity}</p>
                <p>Unit Price: ${(product.unitPrice / 100).toFixed(2)}</p>
                <p>Total: ${(product.totalPrice / 100).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SuccessPage;
