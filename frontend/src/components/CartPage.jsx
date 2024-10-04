import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getItemsSelector, incrementItem, decrementItem, removeItem } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartPage.css';

const CartPage = () => {
  const cartItems = useSelector(getItemsSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      console.error('Cart is empty!');
      return;
    }


    console.log({id: cartItems.id})
    const orderItems = cartItems.map(item => ({
      id: item.id,
      
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      description: item.description
    }));

    try {
      const response = await axios.post('http://localhost:3000/orders', {
        products: orderItems,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      
      const { clientSecret, orderId } = response.data;
      
      // Store clientSecret and orderId in localStorage
      localStorage.setItem('clientSecret', clientSecret);
      localStorage.setItem('orderId', orderId);

      // Navigate to the checkout page
      navigate('/checkout');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <p>Total Items: {totalItems}</p>
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
      <ul className="cart-item-list">
        {cartItems.map((item, index) => {
          const imageUrl = `http://localhost:3000/uploads/${item.imageUrl}`;
          return (
            <li key={index} className="cart-item">
              <img src={imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <p>{item.name}</p>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Image url: {item.imageUrl}</p>
                <p>id: {item.id}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() => dispatch(decrementItem({ name: item.name }))}
                    className="btn btn-secondary"
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(incrementItem({ name: item.name }))}
                    className="btn btn-secondary"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => dispatch(removeItem({ name: item.name }))}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {cartItems.length > 0 && (
        <button className="btn btn-primary checkout-button" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default CartPage;