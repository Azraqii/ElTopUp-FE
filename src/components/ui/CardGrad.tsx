import React from 'react';

interface CardGradProps {
  icon: string; //string ke file SVG
  text: string;
}

const CardGrad: React.FC<CardGradProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-brand-blue text-white shadow-md shadow-blue-200 transition-transform hover:-translate-y-1 cursor-default select-none">
      <span className="text-sm font-bold whitespace-nowrap">{text}</span>
      {/* Menggunakan img tag untuk SVG custom */}
      <img src={icon} alt="" className="w-5 h-5" /> 
    </div>
  );
};

export default CardGrad;