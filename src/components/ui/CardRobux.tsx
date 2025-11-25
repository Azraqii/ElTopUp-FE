import React from 'react';

interface CardRobuxProps {
  amount: string; // Contoh: "100"
  prefix?: string; // Contoh: "R$"
}

const CardRobux: React.FC<CardRobuxProps> = ({ amount, prefix = "R$" }) => {
  return (
    <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex items-center justify-center min-w-[100px] cursor-pointer hover:shadow-md hover:border-brand-blue hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Teks R$ hijau, menebal saat di hover */}
      <span className="text-green-600 font-extrabold text-base md:text-lg tracking-wide whitespace-nowrap group-hover:text-green-500 transition-colors">
        {prefix} {amount}
      </span>
    </div>
  );
};

export default CardRobux;