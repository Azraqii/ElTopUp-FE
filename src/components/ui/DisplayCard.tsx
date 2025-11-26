import React from "react";
import { Link } from 'react-router-dom';

interface DisplayCardProps {
  title: string;       
  imageSrc?: string;   
  href: string;        
  isComingSoon?: boolean;       //jika image kosong, isComingSoon true
}

const DisplayCard: React.FC<DisplayCardProps> = ({ title, imageSrc, href, isComingSoon = false }) => {
  const CardContent = () => (
    <div className="flex flex-col gap-3 h-full">
      {/* --- Image Container --- */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
        
        {isComingSoon ? (
          // --- Tampilan Coming Soon (Sensor Effect) ---
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 overflow-hidden">
             {/* Background abstrak blur untuk efek "sensor" */}
             <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 opacity-70 blur-2xl scale-125"></div>
             
             {/* Overlay Text */}
             <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
               <span className="bg-black/60 text-white px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold tracking-widest uppercase border border-white/10 shadow-lg">
                 Coming Soon
               </span>
             </div>
          </div>
        ) : (
          // --- Tampilan Normal (Gambar Produk) ---
          imageSrc ? (
            <img 
              src={imageSrc} 
              alt={title} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
          ) : (
            // Fallback jika gambar tidak ada tapi bukan coming soon
            <div className="w-full h-full flex items-center justify-center bg-brand-blue/10 text-brand-blue font-bold">
              No Image
            </div>
          )
        )}
      </div>

      {/* --- Title --- */}
      <h3 className={`text-lg md:text-xl font-bold transition-colors duration-200 line-clamp-1
        ${isComingSoon 
          ? 'text-gray-400' // Warna abu jika coming soon
          : 'text-gray-900 group-hover:text-brand-blue' // Hitam ke Biru saat hover jika aktif
        }
      `}>
        {title}
      </h3>
    </div>
  );

  // Jika Coming Soon, jangan gunakan Link (tidak bisa diklik)
  if (isComingSoon) {
    return (
      <div className="block group cursor-default select-none opacity-80">
        <CardContent />
      </div>
    );
  }

  // Jika Aktif, bungkus dengan Link ke halaman transaksi (nanti akan 404)
  return (
    <Link to={href} className="block group">
      <CardContent />
    </Link>
  );
}

export default DisplayCard;