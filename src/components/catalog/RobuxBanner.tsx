import React from 'react';
import { useNavigate } from 'react-router-dom';

const RobuxBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-brand-blue rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Kiri */}
      <div className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-1 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
          ⚡ Instan
        </span>
        <h2 className="text-white font-extrabold text-xl sm:text-2xl leading-tight">
          Top Up Robux Murah!
        </h2>
        <p className="text-blue-100 text-sm">
          Mulai dari Rp109/Rbx. Garansi 100% aman.
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">✓ Garansi 100%</span>
          <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">✓ Robux Pasti Masuk</span>
        </div>
      </div>

      {/* Kanan — tombol */}
      <button
        onClick={() => navigate('/checkout/robux')}
        className="w-full sm:w-auto bg-white text-brand-blue font-bold text-sm px-6 py-3 rounded-2xl hover:bg-blue-50 transition-colors whitespace-nowrap shrink-0"
      >
        Beli Robux →
      </button>
    </div>
  );
};

export default RobuxBanner;
