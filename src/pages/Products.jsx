
import React from 'react';
import { products } from '../assets/assets'; // Adjust the path based on where assets.js is located relative to your Products.js file
import '../design/Products.css'; // Assuming the CSS file is named Products.css and in the same directory as Products.jsx


const Products = () => {
  return (
    <div>
      <h1>Here are the Products!</h1>
      <div className="products-page">
        <h2>Our Sunglasses Collection</h2>
        <div className="sunglasses-display">
          {products.map((product) => (
            <div key={product._id} className="product-item">
              <img src={product.image[0]} alt={product.name} className="sunglasses-img" />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;