import React from 'react';
// Import data dummy
import { productDetails } from '../../data/mockData';

const ProductTopSection: React.FC = () => {
  // Fungsi untuk scroll halus ke section bawah
  const scrollToSelection = () => {
    const section = document.getElementById('selection-section');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-white pt-8 pb-12">
      {/* Background Blur Dekorasi */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* --- KIRI: GAMBAR BANNER --- */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl shadow-blue-200/50 border border-gray-100 group">
              {/* Placeholder Image jika URL mati */}
              <img 
                src={productDetails.imageBanner} 
                alt={productDetails.name} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=Game+Banner';
                }}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
            </div>
          </div>

          {/* --- KANAN: INFO & ACTION --- */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col h-full justify-center space-y-6">
            
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                {productDetails.name}
              </h1>
              <p className="text-gray-500 font-medium text-lg">
                by <span className="text-brand-blue underline cursor-pointer hover:text-blue-700">{productDetails.developer}</span>
              </p>
            </div>

            {/* Tombol Action (Like/Share) - Placeholder Visual */}
            <div className="flex gap-3">
               <button className="p-3 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors">
                 ❤️
               </button>
               <button className="p-3 rounded-full bg-gray-100 hover:bg-blue-50 hover:text-blue-500 transition-colors">
                 🔗
               </button>
            </div>

            {/* Tombol "Dummy" Beli Sekarang - Scroll ke bawah */}
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-lg shadow-blue-100/50 mt-4">
                <p className="text-sm text-gray-500 mb-1">Mulai Dari</p>
                <div className="flex items-end gap-2 mb-4">
                   <span className="text-3xl font-black text-brand-blue">Rp 2.590</span>
                   {/* <span className="text-gray-400 text-sm mb-1.5">/ item</span> */}
                </div>
                <button 
                  onClick={scrollToSelection}
                  className="w-full bg-brand-blue text-white py-3.5 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300/50 transition-all transform hover:-translate-y-0.5"
                >
                  Beli Sekarang
                </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductTopSection;