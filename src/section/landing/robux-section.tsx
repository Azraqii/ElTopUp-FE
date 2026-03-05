import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import aset SVG
import iconZap from '../../assets/Zap.svg';
import iconStar from '../../assets/Star.svg';
import iconShield from '../../assets/Shield.svg';

// Import komponen UI
import CardGrad from '../../components/ui/CardGrad.tsx';

// Harga: 4.5 USD / 1000 Robux, 1 USD = 16.950 Rp
const PRICE_PER_1000_IDR = Math.round(4.5 * 16950); // = 76.275 Rp
const QUICK_AMOUNTS = [100, 500, 1000, 2500, 5000, 10000];

const formatIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const computePrice = (amount: number) => Math.ceil((amount * PRICE_PER_1000_IDR) / 1000);

const RobuxSection: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [rawAmount, setRawAmount] = useState<string>('100');

    const numAmount = parseInt(rawAmount) || 0;
    const price = numAmount >= 50 ? computePrice(numAmount) : 0;

    const handleAmountChange = (val: string) => {
        // hanya angka
        const cleaned = val.replace(/\D/g, '');
        if (cleaned === '') { setRawAmount(''); return; }
        const num = Math.min(parseInt(cleaned), 100000);
        setRawAmount(num.toString());
    };

    const handleBuy = () => {
        if (!username.trim()) {
            alert('Mohon isi username Roblox kamu terlebih dahulu!');
            return;
        }
        if (numAmount < 50) {
            alert('Minimal pembelian adalah 50 Robux!');
            return;
        }
        navigate('/checkout/robux', {
            state: { username: username.trim(), amount: numAmount },
        });
    };

    return (
        <section id="robux-section" className="relative bg-white pb-20 pt-10">

            {/* Glow Effect */}
            <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-blue-300/50 rounded-full blur-3xl opacity-60 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Badge kecil atas */}
                <div className="flex flex-wrap justify-end gap-3 mb-4 transform md:scale-125 md:origin-right">
                    <CardGrad icon={iconZap} text="Proses Instan" />
                    <CardGrad icon={iconStar} text="Simple" />
                    <CardGrad icon={iconShield} text="Garansi Uang Kembali" />
                </div>

                {/* Main card */}
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-[2rem] px-8 md:px-12 py-6 md:py-10 shadow-xl shadow-blue-100/50 relative overflow-hidden">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Top Up Robux</h2>
                        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                            Stock 726.313+
                        </div>
                    </div>

                    {/* Grid: kiri input, kanan quick-select + harga */}
                    <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8">

                        {/* Kiri: Username */}
                        <div className="flex flex-col justify-center gap-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
                                    Username Roblox
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

                            {/* Harga live */}
                            {numAmount >= 50 && (
                                <div className="bg-white border border-blue-100 rounded-2xl px-5 py-4 shadow-sm">
                                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                                        <span>Harga ({numAmount.toLocaleString('id-ID')} RBX)</span>
                                        <span className="font-semibold text-gray-800">{formatIDR(price)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Biaya QRIS</span>
                                        <span className="font-semibold text-gray-800">{formatIDR(500)}</span>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                        <span className="font-bold text-gray-900 text-base">Total</span>
                                        <span className="font-extrabold text-brand-blue text-lg">{formatIDR(price + 500)}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1.5">*Biaya dapat berbeda tergantung metode pembayaran</p>
                                </div>
                            )}

                            <button
                                onClick={handleBuy}
                                className="bg-brand-blue text-white font-bold text-lg py-4 px-10 rounded-2xl shadow-lg shadow-brand-blue/40 hover:bg-blue-600 hover:-translate-y-1 active:translate-y-0 transition-all w-fit"
                            >
                                Lanjut Beli →
                            </button>
                        </div>

                        {/* Kanan: Input jumlah + quick-select */}
                        <div className="flex flex-col justify-center gap-4 pl-0 lg:pl-8">
                            <div>
                                <label htmlFor="robux-amount" className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
                                    Jumlah Robux
                                </label>
                                <div className="relative">
                                    <input
                                        id="robux-amount"
                                        type="text"
                                        inputMode="numeric"
                                        value={rawAmount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        className="w-full bg-white border-2 border-gray-100 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 rounded-2xl px-6 py-4 text-lg font-medium text-gray-800 shadow-sm outline-none transition-all pr-20 placeholder:text-gray-300"
                                        placeholder="Masukkan jumlah"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">RBX</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1.5 ml-1">Minimum 50 • Maksimum 100.000 Robux</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-500 mb-2 ml-1">Atau pilih cepat:</p>
                                <div className="grid grid-cols-3 gap-2.5">
                                    {QUICK_AMOUNTS.map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => setRawAmount(amt.toString())}
                                            className={`rounded-xl py-2.5 px-3 border-2 text-sm font-bold transition-all
                                                ${numAmount === amt
                                                    ? 'bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/30'
                                                    : 'bg-white border-gray-100 text-gray-700 hover:border-brand-blue/50 hover:text-brand-blue'
                                                }`}
                                        >
                                            {amt.toLocaleString('id-ID')}
                                            <span className="block text-[10px] font-normal opacity-70">RBX</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dekorasi Glow Internal */}
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
                </div>
            </div>
        </section>
    );
};

export default RobuxSection;