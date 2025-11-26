import React from 'react';

interface CardRobuxProps {
  amount: string; 
  prefix?: string; 
  isSelected?: boolean; // Tambahkan prop baru
}

const CardRobux: React.FC<CardRobuxProps> = ({ amount, prefix = "R$", isSelected = false }) => {
  return (
    <div 
      className={`
        bg-white rounded-xl px-4 py-3 border flex items-center justify-center min-w-[100px] cursor-pointer transition-all duration-200 group
        ${isSelected 
          ? 'shadow-md border-green-500 -translate-y-0.5' 
          : 'shadow-sm border-gray-100 hover:shadow-md hover:-translate-y-0.5' 
        }
      `}
    >
      <span 
        className={`
          font-extrabold text-base md:text-lg tracking-wide whitespace-nowrap transition-colors
          ${isSelected
            ? 'text-green-500' 
            : 'text-green-600 group-hover:text-green-500' 
          }
        `}
      >
        {prefix} {amount}
      </span>
    </div>
  );
};

export default CardRobux;