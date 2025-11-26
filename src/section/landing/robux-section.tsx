import React, { useState } from 'react';

// Import aset SVG
import iconZap from '../../assets/Zap.svg';
import iconStar from '../../assets/Star.svg';
import iconShield from '../../assets/Shield.svg';

// Import komponen UI
import CardGrad from '../../components/ui/CardGrad.tsx';
import CardRobux from '../../components/ui/CardRobux';

// Import Mock Data
import { robuxPackages } from '../../data/robuxPackages';

const RobuxSection: React.FC = () => {
    const [username, setUsername] = useState('');
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

    const handleBuy = () => {
        if (!username || !selectedPackage) {
            alert("Mohon isi username dan pilih paket Robux!");
            return;
        }
        console.log(`Membeli paket ID ${selectedPackage} untuk user ${username}`);
    };

    return (
        <section id="robux-section" className="relative bg-white py-20">
            
            {/* Glow Effect Pojok Kiri Atas Berbentuk 1/4 lingkaran */}
            <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-blue-300/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* div card atas */}
                <div className="flex justify-end gap-3 mb-4 transform md:scale-125 md:origin-right">
                    <CardGrad icon={iconZap} text="Proses Instan"/>
                    <CardGrad icon={iconStar} text="Simple" />
                    <CardGrad icon={iconShield} text="Garansi Uang Kembali" />
                </div>

                {/* main robux card */}
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-[2rem] px-8 md:px-12 py-6 md:py-10 shadow-xl shadow-blue-100/50 relative overflow-hidden">
                    
                    {/* header */}
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                            Top Up Robux
                        </h2>
                        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                            Stock 726.313+
                        </div>
                    </div>

                    {/* Grid Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 relative-z-10">
                        
                        {/* Kolom Kiri: Input */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-6">
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
                                    Masukkan Username Roblox
                                </label>
                                <input 
                                    id="username"
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white border-2 border-gray-100 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 rounded-2xl px-6 py-4 text-lg font-medium text-gray-800 shadow-sm outline-none transition-all placeholder:text-gray-300"
                                    placeholder="Contoh: RobloxPlayer123"
                                />
                            </div>
                            
                            <button 
                                onClick={handleBuy}
                                className="bg-brand-blue text-white font-bold text-lg py-4 px-10 rounded-2xl shadow-lg shadow-brand-blue/40 hover:bg-blue-600 hover:shadow-brand-blue/50 hover:-translate-y-1 active:translate-y-0 transition-all w-fit"
                            >
                                Beli Sekarang
                            </button>
                        </div>

                        {/* Kolom Kanan: Pilihan Robux */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pl-8 content-center">
                            {robuxPackages.map((pkg) => (
                                <div 
                                    key={pkg.id} 
                                    onClick={() => setSelectedPackage(pkg.id)}
                                >
                                    <CardRobux amount={pkg.amount.toString()} isSelected={selectedPackage === pkg.id} />
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Dekorasi Glow Internal */}
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
                </div>

            </div>
        </section>
    );
};

export default RobuxSection;