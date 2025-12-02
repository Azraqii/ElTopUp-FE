// src/section/product/ProductSelectionSection.tsx
import React, { useState, useEffect } from 'react';
import ProductItemCard from '../../components/ui/ProductItemCart';
import { productPackages } from '../../data/mockData';
import type { ProductPackage } from '../../data/mockData';

const ProductSelectionSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ProductPackage | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [username, setUsername] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  // Efek Reset & Hitung Harga
  useEffect(() => {
    if (selectedItem) {
      setQuantity(1);
      setTotalPrice(selectedItem.price);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (selectedItem) {
      setTotalPrice(selectedItem.price * quantity);
    }
  }, [quantity, selectedItem]);

  // Handler Quantity
  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (!selectedItem) return;
    if (selectedItem.type === 'gamepass') return;

    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
    else if (type === 'inc') setQuantity(q => q + 1);
  };

  return (
    <section id="selection-section" className="relative bg-white py-10 rounded-t-[2.5rem] -mt-8 z-20 min-h-[60vh] pb-32">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Pilih Nominal</h2>
                <p className="text-gray-500 text-base mt-1">Pilih paket yang Anda butuhkan</p>
            </div>
            
             {/* Filter Tabs */}
            <div className="flex bg-gray-200/50 p-1.5 rounded-xl">
                <button className="px-5 py-2 text-sm font-bold bg-white shadow-sm rounded-lg text-gray-800 transition-all">Semua</button>
                <button className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-all">Currency</button>
                <button className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-all">Gamepass</button>
            </div>
        </div>

        {/* --- GRID ITEM --- */}
        {/* PERUBAHAN DI SINI: */}
        {/* 1. grid-cols-2 (HP) -> Tetap 2 agar muat */}
        {/* 2. md:grid-cols-3 (Tablet/Desktop) -> Maksimal 3 kolom agar kartu lebih LEBAR */}
        {/* 3. gap-4 md:gap-6 -> Jarak antar kartu diperbesar sedikit */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-10">
            {productPackages.map((item) => (
                <ProductItemCard 
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    isSelected={selectedItem?.id === item.id}
                    onClick={() => setSelectedItem(item)}
                />
            ))}
        </div>
      </div>

      {/* --- STICKY BOTTOM BAR --- */}
      <div className={`
          fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-5px_30px_rgba(0,0,0,0.15)] p-5 md:p-6 z-50 
          transition-transform duration-500 ease-in-out
          ${selectedItem ? 'translate-y-0' : 'translate-y-[120%]'}
      `}>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-5 md:gap-8">
              
              {/* Info Kiri */}
              <div className="hidden md:block flex-1 border-r border-gray-100 mr-4">
                  <p className="text-xs font-bold text-brand-blue uppercase mb-1 tracking-wider">
                      {selectedItem?.type === 'gamepass' ? 'Gamepass (Max 1)' : 'Item Terpilih'}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 truncate pr-4">{selectedItem?.name}</h3>
              </div>

              {/* Input Tengah */}
              <div className="flex gap-3 w-full lg:w-auto items-center">
                   <input 
                      type="text" 
                      placeholder="Username Roblox" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 lg:w-72 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-base font-medium transition-all"
                   />

                   {/* Counter */}
                   <div className="flex items-center bg-gray-100 rounded-2xl p-1.5 shrink-0 border border-gray-200">
                      <button 
                          onClick={() => handleQuantityChange('dec')}
                          disabled={quantity <= 1 || selectedItem?.type === 'gamepass'}
                          className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm disabled:opacity-50 disabled:shadow-none text-gray-700 font-bold hover:text-brand-blue transition-all"
                      > - </button>
                      <span className="w-10 text-center font-bold text-base text-gray-900">{quantity}</span>
                      <button 
                          onClick={() => handleQuantityChange('inc')}
                          disabled={selectedItem?.type === 'gamepass'}
                          className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm disabled:opacity-50 disabled:shadow-none text-gray-700 font-bold hover:text-brand-blue transition-all"
                      > + </button>
                   </div>
              </div>

              {/* Action Kanan */}
              <div className="flex justify-between items-center w-full lg:w-auto gap-8 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                  <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Total Bayar</p>
                      <p className="text-2xl font-black text-brand-blue">Rp {totalPrice.toLocaleString('id-ID')}</p>
                  </div>
                  <button className="bg-brand-blue text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-brand-blue/30 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-brand-blue/50 transition-all flex items-center gap-2">
                      <span>🛒</span> Checkout
                  </button>
              </div>
          </div>
      </div>

    </section>
  );
};

export default ProductSelectionSection;