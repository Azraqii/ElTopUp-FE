// src/pages/ProductCatalog.tsx
import React, { useEffect } from 'react'; // 1. Import useEffect
import ProductListSection from '../section/catalog/ProductListSection';
import OtherGamesSection from '../section/catalog/OtherGameSection';

const ProductCatalog: React.FC = () => {
  
  // 2. Tambahkan Logic Scroll-to-Top
  // Ini akan memaksa layar kembali ke paling atas setiap kali halaman ini dibuka
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-white min-h-screen">
       {/* 1. Section Produk Utama (Roblox Games) */}
       <ProductListSection /> 
       
       {/* 2. Section Game Lainnya (Coming Soon) */}
       <OtherGamesSection />
    </main>
  );
};

export default ProductCatalog;