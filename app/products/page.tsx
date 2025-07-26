import Link from 'next/link';
import React from 'react';

const ProductsPage = () => {
  return (
    <div>
      <h1>Products</h1>
      <p>Welcome to our products page!</p>
      <div>
        <h2>Available Products</h2>
        <ul>
          <li><Link href="/products/samsung">Samsung</Link></li>
          <li><Link href="/products/Linkpple">Apple</Link></li>
          <li><Link href="/products/lg">LG</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default ProductsPage;
