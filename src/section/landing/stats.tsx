// src/section/landing/robux-section.tsx — Stats / Build-Trust Section
import React, { useEffect, useRef, useState } from 'react';

// ─── Mock data transaksi terbaru (sementara disembunyikan) ─────────────────────────────────────────
// const RECENT_TRANSACTIONS = [
//     { user: 'xNovaRBX',     amount: 2500,   time: '2 menit lalu' },
//     { user: 'BloxMaster99', amount: 1000,   time: '5 menit lalu' },
//     { user: 'iQynnn',       amount: 500,    time: '8 menit lalu' },
//     { user: 'starfall_rbx', amount: 10000,  time: '12 menit lalu' },
//     { user: 'HayashiKun',   amount: 5000,   time: '15 menit lalu' },
//     { user: 'Zenitsu_gg',   amount: 100,    time: '18 menit lalu' },
//     { user: 'ProGamerzID',  amount: 2500,   time: '21 menit lalu' },
//     { user: 'cloudy_rbx',   amount: 500,    time: '24 menit lalu' },
// ];

// ─── Animated Counter Hook ───────────────────────────────────────────────────
const useCountUp = (target: number, duration: number, started: boolean) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!started) return;
        let startTime: number | null = null;
        const step = (ts: number) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, started]);
    return count;
};

// ─── Stat Item ───────────────────────────────────────────────────────────────
interface StatItemProps {
    target: number;
    suffix: string;
    duration: number;
    label: string;
    sublabel: string;
    started: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ target, suffix, duration, label, sublabel, started }) => {
    const count = useCountUp(target, duration, started);
    return (
        <div className="flex flex-col items-center text-center px-6 py-8">
            <p className="text-6xl md:text-7xl font-extrabold text-brand-blue tracking-tight tabular-nums">
                {count.toLocaleString('id-ID')}{suffix}
            </p>
            <p className="mt-3 font-bold text-gray-900 text-lg">{label}</p>
            <p className="text-gray-500 text-base mt-1">{sublabel}</p>
        </div>
    );
};

// ─── Komponen Utama ───────────────────────────────────────────────────────────
const RobuxSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.25 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const STATS = [
        { target: 42226836, suffix: '+', duration: 2200, label: 'RBX Terjual',        sublabel: 'Total RBX yang udah terjual' },
        { target: 99709,    suffix: '+', duration: 1800, label: 'Total Pesanan',       sublabel: 'Pesanan udah diproses' },
        { target: 8,        suffix: '+', duration: 1200, label: 'Tahun Beroperasi',    sublabel: 'Pengalaman melayani pembeli' },
    ];

    return (
        <section
            id="robux-section"
            ref={sectionRef}
            className="relative bg-blue-50 py-20 overflow-hidden"
        >

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-center min-h-[260px]">

                {/* ── Angka Statistik ── */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {STATS.map((s) => (
                        <StatItem key={s.label} {...s} started={started} />
                    ))}
                </div>

                {/* ── Transaksi Sukses Terbaru (sementara disembunyikan) ──
                <div>
                    <div className="flex items-center gap-2.5 mb-6">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                        </span>
                        <h3 className="font-bold text-gray-900 text-base">Transaksi Sukses Terbaru</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {RECENT_TRANSACTIONS.map((tx, i) => (
                            <div
                                key={i}
                                className="bg-white border border-gray-100 rounded-2xl px-4 py-3.5 shadow-sm flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-light to-brand-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {tx.user.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm truncate">@{tx.user}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        <span className="text-green-600 font-bold">+{tx.amount.toLocaleString('id-ID')} RBX</span>
                                        {' · '}{tx.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                */}
            </div>
        </section>
    );
};

export default RobuxSection;