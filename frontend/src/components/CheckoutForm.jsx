import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/success",
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      // Payment succeeded
      const orderId = localStorage.getItem('orderId');
      // You might want to update the order status here or on the success page
      navigate('/success', { state: { orderId } });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>Pay</button>
    </form>
  );
};

export default CheckoutForm;