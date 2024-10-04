import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './checkoutForm.css';

const stripePromise = loadStripe('pk_test_51OzH82P9qbSqpsNt1xSQoLz935KJNOhr1jc2xWozRBHjtjxVw6N973Y5B9geDJRcwdrNWs4l0dnEBI3jxzx5mmYa003vtCjuFQ');

const CheckoutForm = () => {
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedClientSecret = localStorage.getItem('clientSecret');
    if (storedClientSecret) {
      setClientSecret(storedClientSecret);
    } else {
      console.error('No client secret found');
      navigate('/cart'); // Redirect back to cart if no client secret is found
    }
  }, [navigate]);

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm />
    </Elements>
  );
};

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const checkOrderStatus = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:3000/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      return response.data.status;
    } catch (error) {
      console.error('Error checking order status:', error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3001/success",
      },
      redirect: 'if_required'
    });

    if (result.error) {
      console.error(result.error.message);
      setPaymentError(result.error.message);
      setIsProcessing(false);
    } else {
      // Payment succeeded
      const orderId = localStorage.getItem('orderId');
      
      // Poll for order status update
      let orderStatus = await checkOrderStatus(orderId);
      let attempts = 0;
      while (orderStatus !== 'completed' && attempts < 5) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
        orderStatus = await checkOrderStatus(orderId);
        attempts++;
      }

      setIsProcessing(false);
      navigate('/success', { state: { orderId, orderStatus } });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={isProcessing || !stripe}>
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>
      {paymentError && <div className="error-message">{paymentError}</div>}
    </form>
  );
};

export default CheckoutForm;