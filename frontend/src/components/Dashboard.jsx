import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';
import { addItem } from "../redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
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

  return (
    <div className="homepage">
      <button onClick={() => navigate('/cart')} className="cart-button">
        View Cart
      </button>
      <h1>Products</h1>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <img src={`http://localhost:3000/uploads/${product.imageUrl}`} alt={product.name} />
            <p>{product.description}</p>
            <p>${product.price}</p>
            <button
              onClick={() => dispatch(addItem({ name: product.name, price: product.price, imageUrl: product.imageUrl }))}
              className="btn btn-primary"
            >
              Add to cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
