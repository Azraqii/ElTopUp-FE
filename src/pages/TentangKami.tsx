// src/pages/TentangKami.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const values = [
    {
        icon: (
            <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: 'Proses Instan',
        desc: 'Robux masuk ke akun kamu dalam hitungan menit setelah pembayaran terkonfirmasi.',
    },
    {
        icon: (
            <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        title: 'Aman & Terpercaya',
        desc: 'Transaksi aman dengan metode pembayaran resmi. Garansi uang kembali jika ada masalah.',
    },
    {
        icon: (
            <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Harga Terbaik',
        desc: 'Kami menawarkan harga kompetitif dengan kurs terbaik. Hemat lebih banyak untuk setiap top up.',
    },
    {
        icon: (
            <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
        title: 'Dukungan 24/7',
        desc: 'Tim admin kami siap membantu kamu setiap hari. Hubungi lewat WhatsApp untuk respon tercepat.',
    },
];

const stats = [
    { value: '42 Juta+', label: 'RBX Terjual' },
    { value: '99K+',     label: 'Transaksi Sukses' },
    { value: '4+ Tahun', label: 'Beroperasi' },
    { value: '5 Bintang', label: 'Rating Kepuasan' },
];

const TentangKami: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white">

            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-50 to-white pt-20 pb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl -mr-20 -mt-10 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <span className="inline-block bg-brand-blue/10 text-brand-blue text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                        Tentang El Top Up
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        Platform Top Up Robux<br />Terpercaya di Indonesia
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                        El Top Up hadir untuk memberikan pengalaman top up Robux yang mudah, aman, dan harga terbaik bagi para gamer Indonesia.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
                            <p className="font-extrabold text-brand-blue text-xl leading-tight">{s.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Cerita */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                    <h2 className="font-extrabold text-gray-900 text-2xl">Cerita Kami</h2>
                    <p className="text-gray-600 text-base leading-relaxed">
                        El Top Up didirikan oleh para gamer yang paham betul sulitnya top up Robux dengan harga wajar dan proses yang cepat. Berawal dari kebutuhan komunitas, kami berkembang menjadi salah satu platform top up Robux terpercaya di Indonesia.
                    </p>
                    <p className="text-gray-600 text-base leading-relaxed">
                        Dengan pengalaman lebih dari 4 tahun dan lebih dari 99.000 transaksi sukses, kami berkomitmen untuk terus menghadirkan layanan terbaik bagi setiap pelanggan.
                    </p>
                </div>

                {/* Nilai Kami */}
                <div>
                    <h2 className="font-extrabold text-gray-900 text-2xl mb-4">Kenapa Pilih El Top Up?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {values.map((v) => (
                            <div key={v.title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-4 items-start hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    {v.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-base">{v.title}</p>
                                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                    <p className="text-sm text-amber-700 leading-relaxed">
                        <strong>Disclaimer:</strong> El Top Up tidak berafiliasi dengan Roblox Corporation. "Roblox" dan "Robux" adalah merek dagang dari Roblox Corporation. El Top Up adalah reseller independen yang memberikan layanan top up untuk pengguna Roblox di Indonesia.
                    </p>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm text-center">
                    <h3 className="font-extrabold text-gray-900 text-2xl mb-2">Siap Top Up Robux?</h3>
                    <p className="text-base text-gray-500 mb-4">Proses cepat, harga terbaik, dan aman.</p>
                    <Link
                        to="/checkout/robux"
                        className="inline-block bg-brand-blue text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-brand-blue/30 hover:bg-blue-600 hover:-translate-y-0.5 transition-all"
                    >
                        Top Up Sekarang →
                    </Link>
                </div>

                {/* Contact shortcut */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center text-center">
                    <Link to="/bantuan" className="text-sm text-brand-blue font-semibold hover:underline">
                        Butuh bantuan? Hubungi kami →
                    </Link>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <Link to="/syarat-ketentuan" className="text-sm text-gray-500 hover:text-brand-blue transition-colors">
                        Syarat & Ketentuan
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TentangKami;
