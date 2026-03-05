// src/pages/Product/ProductDetail.tsx
import React, { useEffect } from 'react'; // 1. Import useEffect
import ProductTopSection from '../section/product/ProductTopSection';
import ProductSelectionSection from '../section/product/ProductSelectionSection';

const ProductDetail: React.FC = () => {
  // Opsional: Ambil slug dari URL untuk dependency
  // const { slug } = useParams(); 

  // 2. Tambahkan Logic Scroll-to-Top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 

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