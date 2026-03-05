// src/pages/RobuxCheckout.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

// ─── Konstanta Harga ─────────────────────────────────────────────────────────
const PRICE_PER_1000_IDR = Math.round(4.5 * 16950); // 4.5 USD × 16.950 = 76.275
const PAYMENT_FEES: Record<string, number> = {
    qris: 500,
    bca: 0,
    mandiri: 0,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(n);

const computeSubtotal = (amount: number) =>
    Math.ceil((amount * PRICE_PER_1000_IDR) / 1000);

/** Roblox takes 30% marketplace tax, so seller must list at ceil(amount / 0.7) */
const computeGamePassPrice = (amount: number) => Math.ceil(amount / 0.7);

// ─── Types ───────────────────────────────────────────────────────────────────
interface CheckoutState {
    username: string;
    amount: number;
}

type Step = 1 | 2 | 3;
type PaymentMethod = 'qris' | 'bca' | 'mandiri';

// ─── Sub-komponen: Step Indicator ─────────────────────────────────────────────
const STEPS = [
    { id: 1, label: 'Detail Akun' },
    { id: 2, label: 'Game Pass' },
    { id: 3, label: 'Pembayaran' },
];

const StepIndicator: React.FC<{ currentStep: Step }> = ({ currentStep }) => (
    <div className="flex items-center justify-center w-full mb-10">
        {STEPS.map((step, idx) => {
            const done = currentStep > step.id;
            const active = currentStep === step.id;
            return (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-1.5">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all
                                ${done
                                    ? 'bg-brand-blue border-brand-blue text-white'
                                    : active
                                        ? 'bg-brand-blue border-brand-blue text-white shadow-lg shadow-brand-blue/30'
                                        : 'bg-white border-gray-200 text-gray-400'
                                }`}
                        >
                            {done ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                step.id
                            )}
                        </div>
                        <span className={`text-xs font-semibold ${active ? 'text-brand-blue' : done ? 'text-gray-500' : 'text-gray-400'}`}>
                            {step.label}
                        </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                        <div
                            className={`flex-1 h-0.5 mx-3 mb-4 rounded-full transition-all ${
                                currentStep > step.id ? 'bg-brand-blue' : 'bg-gray-200'
                            }`}
                        />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

// ─── Sub-komponen: Ringkasan Pembelian (Sidebar) ──────────────────────────────
interface SummaryProps {
    amount: number;
    subtotal: number;
    fee: number;
    total: number;
    paymentMethod: PaymentMethod;
}

const OrderSummary: React.FC<SummaryProps> = ({ amount, subtotal, fee, total, paymentMethod }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Ringkasan Pembelian</h3>
        </div>

        <div className="space-y-3 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-500">Jumlah RBX</span>
                <span className="font-semibold text-gray-800">{amount.toLocaleString('id-ID')} RBX</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Harga per 1.000 RBX</span>
                <span className="font-semibold text-gray-800">{formatIDR(PRICE_PER_1000_IDR)}</span>
            </div>
            <div className="pt-2 border-t border-gray-100 flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-800">{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">
                    {paymentMethod === 'qris' ? 'Biaya QRIS' : 'Biaya Admin'}
                </span>
                <span className="font-semibold text-gray-800">
                    {fee > 0 ? formatIDR(fee) : <span className="text-green-600">Gratis</span>}
                </span>
            </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-extrabold text-brand-blue text-xl">{formatIDR(total)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
            *Total estimasi. Biaya final sesuai metode pembayaran yang dipilih.
        </p>
    </div>
);

// ─── Halaman Utama ────────────────────────────────────────────────────────────
const RobuxCheckout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const routeState = location.state as CheckoutState | null;

    const [currentStep, setCurrentStep] = useState<Step>(1);

    // Step 2: validasi game pass
    const [isValidating, setIsValidating] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Step 3: pembayaran
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
    const [isPaying, setIsPaying] = useState(false);
    const [paymentDone, setPaymentDone] = useState(false);

    // Guard: jika tidak ada state (akses langsung url), redirect ke home
    if (!routeState?.username || !routeState?.amount) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <p className="text-gray-500 mb-4">Sesi order tidak ditemukan atau sudah berakhir.</p>
                <Link to="/" className="bg-brand-blue text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-all">
                    Kembali ke Beranda
                </Link>
            </div>
        );
    }

    const { username, amount } = routeState;
    const subtotal = computeSubtotal(amount);
    const fee = PAYMENT_FEES[paymentMethod] ?? 0;
    const total = subtotal + fee;
    const gamePassPrice = computeGamePassPrice(amount);

    // ── Mock validasi game pass (placeholder backend) ──
    const handleValidate = async () => {
        setIsValidating(true);
        setValidationError(null);
        setIsValidated(false);
        // Simulasi network request ~2 detik (nanti diganti dengan real API)
        await new Promise((r) => setTimeout(r, 2000));
        // [PLACEHOLDER] Selalu sukses untuk sekarang
        const success = true;
        if (success) {
            setIsValidated(true);
        } else {
            setValidationError('Game Pass tidak ditemukan. Pastikan harga sudah benar dan coba lagi.');
        }
        setIsValidating(false);
    };

    // ── Mock pembayaran ──
    const handlePay = async () => {
        setIsPaying(true);
        await new Promise((r) => setTimeout(r, 1500));
        setIsPaying(false);
        setPaymentDone(true);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* Back button */}
                <button
                    onClick={() => (currentStep > 1 ? setCurrentStep((s) => (s - 1) as Step) : navigate('/'))}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium mb-6 transition-colors group"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    {currentStep > 1 ? 'Kembali' : 'Kembali ke Beranda'}
                </button>

                {/* Judul */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Top Up Robux</h1>
                    <p className="text-gray-500 text-sm mt-1">Ikuti 3 langkah mudah untuk mengisi RBX kamu.</p>
                </div>

                {/* Step Indicator */}
                <StepIndicator currentStep={currentStep} />

                {/* Layout: Konten + Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

                    {/* ─── Konten Langkah ─── */}
                    <div className="flex flex-col gap-5">

                        {/* ════════════ STEP 1: Detail Akun ════════════ */}
                        {currentStep === 1 && (
                            <>
                                {/* Akun Kamu */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-gray-900">Akun Kamu</h2>
                                            <p className="text-xs text-gray-400">RBX akan dikirim ke username ini</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl px-5 py-3.5 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-0.5">Username Roblox</p>
                                            <p className="font-bold text-gray-900 text-lg">{username}</p>
                                        </div>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="text-xs text-brand-blue font-semibold hover:underline"
                                        >
                                            Ubah
                                        </button>
                                    </div>
                                </div>

                                {/* Detail Pesanan */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-gray-900">Detail Pesanan</h2>
                                            <p className="text-xs text-gray-400">Konfirmasi jumlah Robux yang kamu beli</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-white rounded-xl px-5 py-4 border border-blue-100">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-0.5">Jumlah Robux</p>
                                            <p className="font-extrabold text-gray-900 text-2xl">{amount.toLocaleString('id-ID')} <span className="text-brand-blue text-xl">RBX</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-0.5">Subtotal</p>
                                            <p className="font-extrabold text-gray-900 text-lg">{formatIDR(subtotal)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Info cara kerja */}
                                <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-5">
                                    <p className="text-sm font-semibold text-brand-blue mb-2">Bagaimana cara kerjanya?</p>
                                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                        <li>Konfirmasi detail akun dan jumlah RBX</li>
                                        <li>Buat Game Pass di akun Roblox kamu dengan harga tertentu</li>
                                        <li>Selesaikan pembayaran — RBX otomatis masuk dalam &lt;5 menit</li>
                                    </ol>
                                </div>

                                <button
                                    onClick={() => setCurrentStep(2)}
                                    className="bg-brand-blue text-white font-bold text-base py-4 px-8 rounded-2xl shadow-lg shadow-brand-blue/30 hover:bg-blue-600 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 w-fit"
                                >
                                    Lanjut Buat Game Pass
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* ════════════ STEP 2: Validasi Game Pass ════════════ */}
                        {currentStep === 2 && (
                            <>
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-5">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-gray-900">Buat Game Pass</h2>
                                            <p className="text-xs text-gray-400">Langkah terakhir sebelum pembayaran</p>
                                        </div>
                                    </div>

                                    {/* Target harga */}
                                    <div className="bg-gradient-to-br from-brand-blue to-blue-500 rounded-2xl px-6 py-5 text-white text-center mb-5">
                                        <p className="text-sm opacity-80 mb-1">Buat Game Pass dengan harga persis</p>
                                        <p className="text-4xl font-extrabold tracking-wide">{gamePassPrice.toLocaleString('id-ID')} RBX</p>
                                        <p className="text-sm opacity-70 mt-1">di akun @{username}</p>
                                    </div>

                                    {/* Langkah instruksi */}
                                    <div className="space-y-3 mb-5">
                                        {[
                                            { n: 1, text: `Buka Roblox → Create → Game Passes` },
                                            { n: 2, text: `Buat Game Pass baru di experience mana saja` },
                                            { n: 3, text: `Set harga tepat ${gamePassPrice.toLocaleString('id-ID')} RBX (jangan aktifkan Regional Pricing)` },
                                            { n: 4, text: `Klik "Save Changes", lalu tekan tombol "Cek Game Pass" di bawah` },
                                        ].map(({ n, text }) => (
                                            <div key={n} className="flex items-start gap-3">
                                                <span className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold flex-shrink-0 flex items-center justify-center mt-0.5">
                                                    {n}
                                                </span>
                                                <p className="text-sm text-gray-700">{text}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <a
                                        href="https://create.roblox.com/dashboard/creations"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue border border-brand-blue/30 bg-blue-50 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-all mb-5"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Buka Roblox Creator Dashboard
                                    </a>

                                    {/* Peringatan */}
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3 items-start mb-5">
                                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                        </svg>
                                        <p className="text-xs text-amber-700 font-medium">
                                            Pastikan <strong>Regional Pricing</strong> tidak dicentang saat mengisi harga game pass.
                                        </p>
                                    </div>

                                    {/* Tombol cek */}
                                    {!isValidated ? (
                                        <button
                                            onClick={handleValidate}
                                            disabled={isValidating}
                                            className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2
                                                ${isValidating
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 hover:bg-blue-600 hover:-translate-y-0.5'
                                                }`}
                                        >
                                            {isValidating ? (
                                                <>
                                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                    </svg>
                                                    Mengecek Game Pass...
                                                </>
                                            ) : (
                                                'Cek Game Pass'
                                            )}
                                        </button>
                                    ) : (
                                        /* ── Sukses ditemukan ── */
                                        <div className="space-y-4">
                                            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-green-800">Game Pass ditemukan!</p>
                                                    <p className="text-sm text-green-600">Harga: {gamePassPrice.toLocaleString('id-ID')} RBX · @{username}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setCurrentStep(3)}
                                                className="w-full bg-brand-blue text-white font-bold text-base py-4 rounded-2xl shadow-lg shadow-brand-blue/30 hover:bg-blue-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                            >
                                                Lanjut ke Pembayaran
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    {/* Error state */}
                                    {validationError && (
                                        <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                            <p className="text-sm text-red-600">{validationError}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ════════════ STEP 3: Pembayaran ════════════ */}
                        {currentStep === 3 && (
                            <>
                                {paymentDone ? (
                                    /* ── Success state ── */
                                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-extrabold text-gray-900 mb-2">Pembayaran Dikonfirmasi!</h3>
                                        <p className="text-gray-500 text-sm mb-6">
                                            RBX kamu sedang diproses dan akan tersedia dalam <strong>1–5 menit</strong>.
                                        </p>
                                        <Link to="/" className="inline-block bg-brand-blue text-white font-bold px-8 py-3 rounded-2xl hover:bg-blue-600 transition-all">
                                            Kembali ke Beranda
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        {/* Pilih Metode Bayar */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                            <h2 className="font-bold text-gray-900 mb-4">Pilih Metode Pembayaran</h2>

                                            <div className="space-y-3">
                                                {/* QRIS */}
                                                <button
                                                    onClick={() => setPaymentMethod('qris')}
                                                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all
                                                        ${paymentMethod === 'qris'
                                                            ? 'border-brand-blue bg-blue-50/50'
                                                            : 'border-gray-100 bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v-4m6 11h-6m6-8h2M4 4h6v4H4zm0 12h6v4H4zm12-12h4v4h-4z" />
                                                            </svg>
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-semibold text-gray-900 text-sm">QRIS</p>
                                                            <p className="text-xs text-gray-400">GoPay · OVO · Dana · m-Banking</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">+Rp500</span>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'qris' ? 'border-brand-blue' : 'border-gray-300'}`}>
                                                            {paymentMethod === 'qris' && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue" />}
                                                        </div>
                                                    </div>
                                                </button>

                                                {/* Bank Transfer BCA */}
                                                <button
                                                    onClick={() => setPaymentMethod('bca')}
                                                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all
                                                        ${paymentMethod === 'bca'
                                                            ? 'border-brand-blue bg-blue-50/50'
                                                            : 'border-gray-100 bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                            <span className="text-[10px] font-extrabold text-blue-600">BCA</span>
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-semibold text-gray-900 text-sm">Transfer Bank BCA</p>
                                                            <p className="text-xs text-gray-400">Virtual Account · Gratis admin</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-medium">Segera</span>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bca' ? 'border-brand-blue' : 'border-gray-300'}`}>
                                                            {paymentMethod === 'bca' && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue" />}
                                                        </div>
                                                    </div>
                                                </button>

                                                {/* Mandiri */}
                                                <button
                                                    onClick={() => setPaymentMethod('mandiri')}
                                                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all
                                                        ${paymentMethod === 'mandiri'
                                                            ? 'border-brand-blue bg-blue-50/50'
                                                            : 'border-gray-100 bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                                                            <span className="text-[8px] font-extrabold text-yellow-700 leading-tight text-center">MAN<br/>DIRI</span>
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="font-semibold text-gray-900 text-sm">Transfer Bank Mandiri</p>
                                                            <p className="text-xs text-gray-400">Virtual Account · Gratis admin</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-medium">Segera</span>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'mandiri' ? 'border-brand-blue' : 'border-gray-300'}`}>
                                                            {paymentMethod === 'mandiri' && <div className="w-2.5 h-2.5 rounded-full bg-brand-blue" />}
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Info placeholder jika bank dipilih */}
                                        {(paymentMethod === 'bca' || paymentMethod === 'mandiri') && (
                                            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex gap-3">
                                                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-sm font-bold text-amber-700">Payment Gateway Segera Hadir</p>
                                                    <p className="text-xs text-amber-600 mt-0.5">
                                                        Metode ini sedang dalam pengembangan. Untuk saat ini silakan gunakan QRIS.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* QRIS Placeholder */}
                                        {paymentMethod === 'qris' && (
                                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                                <h3 className="font-bold text-gray-900 mb-4">Bayar via QRIS</h3>
                                                {/* Placeholder QR */}
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center px-4">
                                                        <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v-4m6 11h-6m6-8h2M4 4h6v4H4zm0 12h6v4H4zm12-12h4v4h-4z" />
                                                        </svg>
                                                        <p className="text-xs text-gray-400 font-medium">QR Code akan muncul setelah<br />payment gateway terhubung</p>
                                                    </div>
                                                    <p className="text-sm text-gray-500 text-center">
                                                        Bayar <span className="font-bold text-gray-900">{formatIDR(total)}</span> ke QRIS di bawah
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Tombol Bayar */}
                                        <button
                                            onClick={paymentMethod === 'qris' ? handlePay : undefined}
                                            disabled={isPaying || paymentMethod !== 'qris'}
                                            className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2
                                                ${isPaying || paymentMethod !== 'qris'
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 hover:bg-blue-600 hover:-translate-y-0.5'
                                                }`}
                                        >
                                            {isPaying ? (
                                                <>
                                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                    </svg>
                                                    Memproses Pembayaran...
                                                </>
                                            ) : paymentMethod === 'qris' ? (
                                                `Konfirmasi Pembayaran ${formatIDR(total)}`
                                            ) : (
                                                'Metode ini Belum Tersedia'
                                            )}
                                        </button>

                                        <p className="text-xs text-gray-400 text-center">
                                            Dengan melanjutkan, kamu menyetujui syarat & ketentuan layanan ElTopUp.
                                        </p>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* ─── Sidebar: Ringkasan ─── */}
                    <div className="lg:sticky lg:top-24 self-start">
                        <OrderSummary
                            amount={amount}
                            subtotal={subtotal}
                            fee={fee}
                            total={total}
                            paymentMethod={paymentMethod}
                        />

                        {/* Info akun */}
                        <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Dikirim ke</p>
                                    <p className="font-bold text-gray-900 text-sm">@{username}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RobuxCheckout;
