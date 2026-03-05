// src/section/product/ProductTopSection.tsx
import React, { useState } from 'react';
import { productDetails } from '../../data/mockData';

const ProductTopSection: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);

  // Fungsi untuk scroll halus ke section bawah
  const scrollToSelection = () => {
    const section = document.getElementById('selection-section');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // UBAH: Pastikan bg-white sepenuhnya tanpa elemen dekorasi yang mengganggu
    <section className="relative bg-white pt-8 pb-12">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          
          {/* --- KIRI: GAMBAR BANNER --- */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl shadow-blue-200/50 border border-gray-100 group">
              <img 
                src={productDetails.imageBanner} 
                alt={productDetails.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/800x450?text=Game+Banner';
                }}
              />
              {/* Overlay Gradient Halus */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
            </div>
          </div>

          {/* --- KANAN: INFO & ACTION --- */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col h-full justify-start space-y-5 mt-2">
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                  {productDetails.name}
                </h1>
                <p className="text-gray-500 font-medium text-lg">
                  by <span className="text-brand-blue underline cursor-pointer hover:text-blue-700">{productDetails.developer}</span>
                </p>
              </div>

              {/* UBAH: Icon Hati Interaktif (SVG) */}
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`
                  p-3 rounded-full transition-all duration-300 border
                  ${isLiked 
                    ? 'bg-red-50 border-red-100 text-red-500 shadow-sm' 
                    : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                  }
                `}
              >
                <svg 
                  className={`w-7 h-7 transition-transform active:scale-90 ${isLiked ? 'fill-current' : 'fill-none'}`} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Price Box */}
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-lg shadow-blue-100/50 mt-2">
                <p className="text-sm text-gray-500 mb-1">Mulai Dari</p>
                <div className="flex items-end gap-2 mb-4">
                   <span className="text-3xl font-black text-brand-blue">Rp 2.590</span>
                </div>
                <button 
                  onClick={scrollToSelection}
                  className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-brand-blue/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Pilih Item ↓
                </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTopSection;