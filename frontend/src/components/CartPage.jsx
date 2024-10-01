import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getItemsSelector, incrementItem, decrementItem, removeItem } from '../redux/slices/cartSlice';
import './CartPage.css';

const CartPage = () => {
  const cartItems = useSelector(getItemsSelector);
  const dispatch = useDispatch();

  // Calculate total price and number of items
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0); // Sum the quantity of all items
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0); // Multiply price by quantity

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <p>Total Items: {totalItems}</p>
      <p>Total Price: ${totalPrice.toFixed(2)}</p> {/* Format totalPrice to 2 decimal places */}
      <ul className="cart-item-list">
        {cartItems.map((item, index) => {
          const imageUrl = `http://localhost:3000/uploads/${item.imageUrl}`;
          return (
            <li key={index} className="cart-item">
              <img src={imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <p>{item.name}</p>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p> {/* Display quantity */}

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
    </div>
  );
};

export default CartPage;
