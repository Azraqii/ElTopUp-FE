import React from 'react';
import ProductTopSection from '../section/product/ProductTopSection';
import ProductSelectionSection from '../section/product/ProductSelectionSection';

const ProductDetail: React.FC = () => {
  return (
    <main className="bg-white min-h-screen pt-16">
      {/* Section Atas: Banner & Info Game */}
      <ProductTopSection />
      
      {/* Section Bawah: Pilihan Item & Form Transaksi */}
      <ProductSelectionSection />
    </main>
  );
};

export default ProductDetail;