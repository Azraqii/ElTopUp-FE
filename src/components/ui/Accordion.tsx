import React, { useState } from 'react';
// Menggunakan icon SVG chevron-down.svg
import iconChevronDown from '../../assets/chevron-down.svg';

interface AccordionProps {
  title: string;
  content: string;
  className?: string; // Menambahkan prop className opsional
}

const Accordion: React.FC<AccordionProps> = ({ title, content, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Menambahkan ${className} dan 'h-full' agar kartu mengisi tinggi container grid
    // flex flex-col justify-start memastikan konten tertata rapi saat kartu memanjang
    <div className={`rounded-xl transition-all duration-300 border border-transparent h-full flex flex-col ${isOpen ? 'bg-brand-blue shadow-lg ring-2 ring-blue-200' : 'bg-gradient-to-r from-blue-400 to-brand-blue shadow-md hover:shadow-xl hover:-translate-y-1'} ${className}`}>
      <button
        className="flex justify-between items-center w-full p-5 text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-white text-sm md:text-base leading-snug">
          {title}
        </span>
        
        {/* Icon Chevron: Putih, berputar saat aktif */}
        <img 
          src={iconChevronDown} 
          alt="Toggle" 
          className={`w-5 h-5 text-white filter brightness-0 invert transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {/* Content Wrapper */}
      {/* flex-grow agar jika ada ruang sisa, konten bisa mengisinya (opsional, tapi bagus untuk alignment) */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {/* Garis pemisah tipis */}
        <div className="border-t border-white/20 mx-5"></div>
        
        <div className="p-5 text-blue-50 text-sm leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Accordion;