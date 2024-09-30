import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: null // Change to image file
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      console.log('Fetched products:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Add new product
  const addProduct = async () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('image', newProduct.image); // Append the image file

    try {
      await axios.post('http://localhost:3000/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchProducts(); // Refresh the product list
      setNewProduct({ name: '', description: '', price: '', image: null }); // Reset form
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Update existing product
  const updateProduct = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/products/${id}`, editingProduct, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditingProduct(null);
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] }); // Update image file state
  };
 console.log(products[0])
 console.log('Current Products State:', JSON.stringify(products, null, 2)); // Pretty print with 2 spaces

 
  // Render
  return (
    <div className="admin-panel">
      <h2>Admin Panel: Manage Products</h2>

      {/* Add Product Form */}
      <div className="add-product-form">
        <h3>Add New Product</h3>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="file" // Allow file upload
          accept="image/*" // Accept image files only
          onChange={handleFileChange} // Handle file input change
        />
        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="edit-product-form">
          <h3>Edit Product</h3>
          <input
            type="text"
            placeholder="Name"
            value={editingProduct.name}
            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={editingProduct.description}
            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={editingProduct.price}
            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
          />
          <button onClick={() => updateProduct(editingProduct.id)}>Save Changes</button>
          <button onClick={() => setEditingProduct(null)}>Cancel</button>
        </div>
      )}

      {/* Product List */}
      <h3>Products</h3>
      <ul>
      {products.map((product) => {
   // Log each product
  return (
    <li key={product.id}>
      <p>{product.name} - ${product.price}</p>
      <p>{product.description}</p>
      <img src={`http://localhost:3000/uploads/${product.imageUrl}`} alt={product.name} width="100" />
      <button onClick={() => deleteProduct(product.id)}>Delete</button>
      <button onClick={() => setEditingProduct(product)}>Edit</button>
    </li>
  );
})}
      </ul>
    </div>
  );
};

export default AdminPanel;
