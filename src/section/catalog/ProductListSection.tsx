// src/section/catalog/ProductListSection.tsx
import React from 'react';
import DisplayCard from '../../components/ui/DisplayCard';

import FishItImg from '../../assets/FishIt.png';
import GrowAGardenImg from '../../assets/GrowAGarden.png';
import StealABrainrotImg from '../../assets/StealABrainrot.png';

const ProductListSection: React.FC = () => {
  const ROBLOX_PRODUCTS = [
    // --- BARIS 1: GAME AKTIF + 1 FILLER ---
    {
      id: 1,
      title: "Coming Soon",
      image: FishItImg,
      href: "/transaction/fish-it",
      isComingSoon: true,
    },
    {
      id: 2,
      title: "Coming Soon",
      image: StealABrainrotImg,
      href: "/transaction/steal-a-brainrot",
      isComingSoon: true,
    },
    {
      id: 3,
      title: "Coming Soon",
      image: GrowAGardenImg,
      href: "/transaction/grow-a-garden",
      isComingSoon: true,
    },
    { 
      id: 4, 
      title: "",
      href: "#", 
      isComingSoon: true 
    },

    // --- BARIS 2: TAMBAHAN COMING SOON (4 ITEM) ---
    { id: 5, title: "", href: "#", isComingSoon: true },
    { id: 6, title: "", href: "#", isComingSoon: true },
    { id: 7, title: "", href: "#", isComingSoon: true },
    { id: 8, title: "", href: "#", isComingSoon: true },
  ];

  return (
    <section className="bg-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Products
            </h2>
            <button className="text-sm font-bold text-brand-blue bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                Selengkapnya
            </button>
        </div>

        {/* Grid Produk: 4 Kolom */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {ROBLOX_PRODUCTS.map((game) => (
                <DisplayCard 
                    key={game.id}
                    title={game.title}
                    imageSrc={game.image}
                    href={game.href}
                    isComingSoon={game.isComingSoon}
                />
            ))}
        </div>

      </div>
    </section>
  );
};

export default ProductListSection;