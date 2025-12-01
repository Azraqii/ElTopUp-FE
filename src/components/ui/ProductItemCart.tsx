import React from 'react';
// Menggunakan SVG icon check (placeholder) atau teks saja jika belum ada icon
// Untuk saat ini kita gunakan styling CSS untuk indikator "selected"

interface ProductItemCardProps {
  name: string;
  price: number;
  isSelected: boolean;
  onClick: () => void;
}

const ProductItemCard: React.FC<ProductItemCardProps> = ({ name, price, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 overflow-hidden group flex flex-col justify-between h-full
        ${isSelected 
          ? 'border-brand-blue bg-blue-50 shadow-lg ring-2 ring-brand-blue/20' 
          : 'border-gray-100 bg-white hover:border-brand-blue/50 hover:shadow-md'
        }
      `}
    >
      {/* Indikator Checklist jika dipilih */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center">
           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
      )}

      {/* Nama Item */}
      <h3 className={`font-bold text-sm md:text-base leading-tight mb-4 ${isSelected ? 'text-brand-blue' : 'text-gray-800'}`}>
        {name}
      </h3>
      
      {/* Harga */}
      <div className="mt-auto">
        <p className="text-xs text-gray-500 mb-1">Harga</p>
        <p className="text-lg font-extrabold text-green-600">
          Rp {price.toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  );
};

export default ProductItemCard;