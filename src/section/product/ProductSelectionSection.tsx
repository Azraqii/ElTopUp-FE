// src/section/product/ProductSelectionSection.tsx
import React, { useState, useEffect } from 'react';
// Import komponen & data
import ProductItemCard from '../../components/ui/ProductItemCart';
import { productPackages } from '../../data/mockData';
import type { ProductPackage, ProductCategory } from '../../data/mockData';

// Daftar Kategori sesuai request
const CATEGORIES: ProductCategory[] = [
  'Coins', 
  'Crates', 
  'Game Pass', 
  'Limited Time', 
  'Server Boost', 
  'Upgrade Server Boost', 
  'Wheel Spins'
];

const ProductSelectionSection: React.FC = () => {
  // 1. Tambahkan State untuk Category (Default: Coins)
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('Coins');

  const [selectedItem, setSelectedItem] = useState<ProductPackage | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [username, setUsername] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  // 2. Filter data berdasarkan kategori yang dipilih
  const filteredPackages = productPackages.filter(item => item.category === activeCategory);

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

  // Handler tombol quantity (+ / -)
  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (!selectedItem) return;
    if (selectedItem.type === 'gamepass') return;

    if (type === 'dec' && quantity > 1) {
      setQuantity(q => q - 1);
    } else if (type === 'inc') {
      setQuantity(q => q + 1);
    }
  };

  // Handler Checkout
  const handleCheckout = () => {
    if (!username) {
      alert("Mohon isi Username Roblox Anda!");
      // Focus ke input username
      document.getElementById('roblox-username')?.focus();
      return;
    }
    
    // Simulasi Redirect ke Payment
    console.log("Checkout Payload:", {
        item: selectedItem,
        qty: quantity,
        total: totalPrice,
        user: username
    });
    alert(`Mengarahkan ke pembayaran...\nItem: ${selectedItem?.name}\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}`);
  };

  return (
    <section id="selection-section" className="relative bg-gray-50 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER PILIH PRODUK --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Pilih Nominal</h2>
                <p className="text-gray-500 text-base mt-1">Pilih paket yang Anda butuhkan</p>
            </div>
            
            {/* Search Bar Sederhana */}
            <div className="relative w-full md:w-72">
                <input 
                    type="text" 
                    placeholder="Cari item..." 
                    className="w-full px-4 py-2.5 rounded-full border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm transition-all"
                />
            </div>
        </div>

        {/* --- GRID ITEM --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-32">
            {productPackages.map((item) => (
                <ProductItemCard 
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    isSelected={selectedItem?.id === item.id}
                    onClick={() => setSelectedItem(item)}
                />
            ))}
        </div>

        {/* --- STICKY BOTTOM BAR (Form Transaksi) --- */}
        {/* Muncul hanya jika item sudah dipilih */}
        {selectedItem && (
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 md:p-8 z-50 animate-slide-up">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
                    
                    {/* Info Item Terpilih */}
                    <div className="flex-1 w-full border-b lg:border-b-0 pb-4 lg:pb-0 border-gray-100">
                        <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">
                            Item Terpilih {selectedItem.type === 'gamepass' && '(Maks. 1)'}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{selectedItem.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Harga Satuan: <span className="font-semibold text-gray-700">Rp {selectedItem.price.toLocaleString('id-ID')}</span>
                        </p>
                    </div>

                    {/* Input Username & Quantity */}
                    <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto items-center">
                        
                        {/* Input Username */}
                        <div className="w-full md:w-64">
                            <input 
                                id="roblox-username"
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username Roblox" 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-blue outline-none transition-all font-medium"
                            />
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center bg-gray-100 rounded-xl p-1">
                            <button 
                                onClick={() => handleQuantityChange('dec')}
                                disabled={quantity <= 1 || selectedItem.type === 'gamepass'}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-gray-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:text-brand-blue transition-colors font-bold"
                            >
                                -
                            </button>
                            <div className="w-12 text-center font-bold text-gray-800">
                                {quantity}
                            </div>
                            <button 
                                onClick={() => handleQuantityChange('inc')}
                                disabled={selectedItem.type === 'gamepass'}
                                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-gray-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:text-brand-blue transition-colors font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Total & Checkout */}
                    <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-gray-100 pt-4 lg:pt-0 mt-2 lg:mt-0">
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Total Bayar</p>
                            <p className="text-2xl font-black text-brand-blue">
                                Rp {totalPrice.toLocaleString('id-ID')}
                            </p>
                        </div>
                        
                        <button 
                            onClick={handleCheckout}
                            className="bg-brand-blue text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-brand-blue/30 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-2"
                        >
                            <span>🛒</span>
                            Checkout
                        </button>
                    </div>

                </div>
            </div>
        )}

      </div>

    </section>
  );
};

export default ProductSelectionSection;