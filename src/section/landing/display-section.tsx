import React from 'react';
import { Link } from 'react-router-dom';
// Menggunakan icon SVG sebagai ganti lucide-react, seperti yang diminta sebelumnya
import imgArrowRight from '../../assets/Arrow_right.svg';

// Import Komponen UI
import DisplayCard from '../../components/ui/DisplayCard';
import CardGradSelengkapnya from '../../components/ui/CardGradSelengkapnya';

// Import Aset Gambar (Pastikan file-file ini ada di folder src/assets/)
// Jika belum ada, Anda bisa menggunakan placeholder atau komentar dulu.
import imgGrowAGarden from '../../assets/GrowAGarden.png';
import imgFishIt from '../../assets/FishIt.png';
import imgStealABrainrot from '../../assets/StealABrainrot.png';

const DisplaySection: React.FC = () => {
  return (
    <section id="display-section" className="relative bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- BAGIAN 1: MORE PRODUCTS --- */}
        <div className="mb-16">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              More Products
            </h2>
            
            {/* Tombol Selengkapnya jika hover maka pointer*/}
            <Link 
              to="/products" 
              className="flex items-center gap-2  px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 group"
            >
              <CardGradSelengkapnya icon={imgArrowRight} text="Selengkapnya" />
            </Link>
          </div>

          {/* Grid Cards: Overflow Scroll untuk Mobile, Grid untuk Desktop */}
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar">
            
            {/* Card 1: Fish It! */}
            <div className="min-w-[280px] md:min-w-0 snap-center mr-4 md:mr-0">
              <DisplayCard 
                title="Fish It!" 
                imageSrc={imgFishIt} 
                href="/transaction/fish-it" 
              />
            </div>

            {/* Card 2: Steal A Brainrot */}
            <div className="min-w-[280px] md:min-w-0 snap-center mr-4 md:mr-0">
              <DisplayCard 
                title="Steal A Brainrot" 
                imageSrc={imgStealABrainrot} 
                href="/transaction/steal-a-brainrot" 
              />
            </div>

            {/* Card 3: Grow A Garden */}
            <div className="min-w-[280px] md:min-w-0 snap-center mr-4 md:mr-0">
              <DisplayCard 
                title="Grow A Garden" 
                imageSrc={imgGrowAGarden} 
                href="/transaction/grow-a-garden" 
              />
            </div>

            {/* Card 4: Coming Soon (Placeholder) */}
            <div className="min-w-[280px] md:min-w-0 snap-center mr-4 md:mr-0">
              <DisplayCard 
                title="Coming Soon" 
                href="#" 
                isComingSoon={true} 
              />
            </div>

          </div>
        </div>


        {/* --- BAGIAN 2: OTHER GAMES --- */}
        <div>
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Other Games
            </h2>
            
            <Link 
              to="/products" 
              className="flex items-center gap-2  px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 group"
            >
              <CardGradSelengkapnya icon={imgArrowRight} text="Selengkapnya" />
            </Link>
            
          </div>

          {/* Grid Cards (Semua Coming Soon) */}
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 md:mx-0 md:px-0 snap-x snap-mandatory hide-scrollbar">
            
            {/* Generate 4 Kartu Coming Soon */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="min-w-[280px] md:min-w-0 snap-center mr-4 md:mr-0">
                <DisplayCard 
                  title="Coming Soon" 
                  href="#" 
                  isComingSoon={true} 
                />
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
};

export default DisplaySection;