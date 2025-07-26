import React from 'react';

interface Props {
  params: {
    slug: string[];
  };
}

const ProductPage = ({ params: { slug } }: Props) => {
  return (
    <div>
      <h1>Product Page</h1>
      <p>Slug: {slug.join(' / ')}</p>
    </div>
  );
};

export default ProductPage;
