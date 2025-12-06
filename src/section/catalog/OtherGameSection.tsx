// src/section/catalog/OtherGamesSection.tsx
import React from 'react';
import DisplayCard from '../../components/ui/DisplayCard';

const OtherGamesSection: React.FC = () => {
  
  // Kita buat array dummy isi 4 item
  const OTHER_GAMES = [1, 2, 3, 4];

  return (
    <section className="bg-white pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Other Games
            </h2>
        </div>

        {/* Grid: 4 Kolom */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {OTHER_GAMES.map((id) => (
                <DisplayCard 
                    key={id}
                    title="" // Kosongkan title agar "tidak ada namanya" di tampilan
                    href="#"
                    isComingSoon={true}
                />
            ))}
        </div>

      </div>
    </section>
  );
};

export default OtherGamesSection;