// src/components/ui/ProductItemCard.tsx
import React from 'react';

interface ProductItemCardProps {
  name: string;
  price: number;
  image: string; // Prop Image ditambahkan
  isSelected: boolean;
  onClick: () => void;
}

const ProductItemCard: React.FC<ProductItemCardProps> = ({ name, price, image, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 overflow-hidden group h-full
        ${isSelected 
          ? 'border-brand-blue bg-blue-50 shadow-lg ring-2 ring-brand-blue/20' 
          : 'border-gray-100 bg-white hover:border-brand-blue/50 hover:shadow-md'
        }
      `}
    >
      {/* Indikator Checklist (Absolute Position - Tetap di pojok kanan atas) */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center">
           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
      )}

      {/* Container Flex Row: Kiri Teks, Kanan Gambar */}
      <div className="flex items-center justify-between gap-3 h-full">
        
        {/* --- SISI KIRI: Teks (Flex Column seperti layout awal) --- */}
        <div className="flex flex-col justify-between h-full flex-1 pr-2">
            {/* Nama Item */}
            <h3 className={`font-bold text-sm md:text-base leading-tight mb-2 ${isSelected ? 'text-brand-blue' : 'text-gray-800'}`}>
                {name}
            </h3>
            
            {/* Harga */}
            <div className="mt-auto">
                <p className="text-xs text-gray-500 mb-0.5">Harga</p>
                <p className="text-lg font-extrabold text-green-600">
                Rp {price.toLocaleString('id-ID')}
                </p>
            </div>
        </div>

        {/* --- SISI KANAN: Image --- */}
        <div className="shrink-0 w-16 h-16 bg-gray-100 rounded-lg p-1 flex items-center justify-center overflow-hidden">
            <img 
                src={image} 
                alt={name}
                className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110 duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=IMG'; }}
            />
        </div>

      </div>
    </div>
  );
};

export default ProductItemCard;