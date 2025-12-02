// src/section/product/ProductSelectionSection.tsx
import React, { useState, useEffect } from 'react';
import ProductItemCard from '../../components/ui/ProductItemCard';
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

  // Reset quantity saat item berubah
  useEffect(() => {
    if (selectedItem) {
      setQuantity(1);
      setTotalPrice(selectedItem.price);
    }
  }, [selectedItem]);

  // Update total harga saat quantity berubah
  useEffect(() => {
    if (selectedItem) {
      setTotalPrice(selectedItem.price * quantity);
    }
  }, [quantity, selectedItem]);

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (!selectedItem) return;
    if (selectedItem.type === 'gamepass') return;

    if (type === 'dec' && quantity > 1) {
      setQuantity(q => q - 1);
    } else if (type === 'inc') {
      setQuantity(q => q + 1);
    }
  };

  const handleCheckout = () => {
    if (!username) {
      alert("Mohon isi Username Roblox Anda!");
      document.getElementById('roblox-username')?.focus();
      return;
    }
    
    console.log("Checkout Payload:", {
        item: selectedItem,
        qty: quantity,
        total: totalPrice,
        user: username
    });
    alert(`Mengarahkan ke pembayaran...\nItem: ${selectedItem?.name}\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}`);
  };

  return (
    // UBAH 1: Menghapus 'min-h-screen' agar section tidak memaksa tinggi layar penuh
    // UBAH 2: Mengurangi 'pb-12' menjadi 'pb-4' agar footer lebih naik
    <section id="selection-section" className="relative bg-white pt-16 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Pilih Produk</h2>
                <p className="text-gray-500 text-sm mt-1">Dapatkan berbagai produk dengan mudah dan harga termurah!</p>
            </div>
            
            <div className="relative w-full md:w-72">
                <input 
                    type="text" 
                    placeholder="Cari item..." 
                    className="w-full px-4 py-2.5 rounded-full border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm transition-all"
                />
            </div>
        </div>

        {/* --- TAMBAHAN: KATEGORI TABS (Scrollable) --- */}
        <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
            <div className="flex gap-3 w-max">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => {
                            setActiveCategory(category);
                            setSelectedItem(null); // Reset pilihan saat ganti kategori agar UI bersih
                        }}
                        className={`
                            px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 border
                            ${activeCategory === category 
                                ? 'bg-brand-blue text-white border-brand-light shadow-md' // Style aktif
                                : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200' // Style inaktif
                            }
                        `}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>

        {/* --- GRID ITEM (Gunakan filteredPackages) --- */}
        {/* UBAH 3: Mengurangi 'mb-24' menjadi 'mb-20'. 
            Kita butuh sedikit margin (sekitar 80px/5rem) agar Sticky Bar tidak menutupi item terakhir saat discroll,
            tapi tidak sejauh 24 (96px). */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
            {filteredPackages.length > 0 ? (
                filteredPackages.map((item) => (
                    <ProductItemCard 
                        key={item.id}
                        name={item.name}
                        price={item.price}
                        // Pastikan prop image ada di ProductItemCard dan MockData
                        image={item.image} 
                        isSelected={selectedItem?.id === item.id}
                        onClick={() => setSelectedItem(item)}
                    />
                ))
            ) : (
                <div className="col-span-full text-center py-10 text-gray-400">
                    Tidak ada item di kategori ini.
                </div>
            )}
        </div>

        {/* --- STICKY BOTTOM BAR (TETAP DIPERTAHANKAN) --- */}
        {selectedItem && (
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 md:p-8 z-50 animate-slide-up">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
                    
                    {/* Info Item */}
                    <div className="flex-1 w-full border-b lg:border-b-0 pb-4 lg:pb-0 border-gray-100">
                        {/* Menampilkan kategori kecil di atas nama item */}
                        <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">
                            {selectedItem.category} {selectedItem.type === 'gamepass' && '(Max. 1)'}
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{selectedItem.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Harga Satuan: <span className="font-semibold text-gray-700">Rp {selectedItem.price.toLocaleString('id-ID')}</span>
                        </p>
                    </div>

                    {/* Input & Qty */}
                    <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto items-center">
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