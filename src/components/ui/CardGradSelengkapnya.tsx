// CardGrad tapi ada animasinya
import React from 'react';

interface CardGradProps {
  icon: string; 
  text: string;
}

const CardGrad: React.FC<CardGradProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-brand-blue text-white shadow-md shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-300 cursor-pointer select-none group">
      <span className="text-sm font-bold whitespace-nowrap">{text}</span>
      <img 
        src={icon} 
        alt="" 
        className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" 
      /> 
    </div>
  );
};

export default CardGrad;