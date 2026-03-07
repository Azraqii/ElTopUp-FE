// src/pages/RobuxCheckout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

// ─── Konstanta ──────────────────────────────────────────────────────────────
const PRICE_PER_1000_IDR = Math.round(4.7 * 16950); // 4.7 USD × 16.950 = 79.665
const QUICK_AMOUNTS = [100, 500, 1000, 2500, 5000, 10000];
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

/** Roblox takes 30% marketplace tax, so seller must list at ceil(amount / 0.7) */
const computeGamePassPrice = (amount: number) => Math.ceil(amount / 0.7);

/** Price user pays is based on the game pass listing price (after-tax amount) */
const computeSubtotal = (amount: number) =>
    Math.ceil((computeGamePassPrice(amount) * PRICE_PER_1000_IDR) / 1000);

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;
type PaymentMethod = 'qris' | 'bca' | 'mandiri';

// ─── Sub-komponen: Step Indicator ─────────────────────────────────────────────
const STEPS = [
    { id: 1, label: 'Detail Akun' },
    { id: 2, label: 'Game Pass' },
    { id: 3, label: 'Pembayaran' },
];

// ─── Helpers input ────────────────────────────────────────────────────────────
const parseAmount = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) return null;
    return Math.min(parseInt(cleaned), 100_000);
};

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
    const navigate = useNavigate();
    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const [currentStep, setCurrentStep] = useState<Step>(1);

    // Step 1: form input
    const [username, setUsername] = useState('');
    const [rawAmount, setRawAmount] = useState('100');

    // Step 2: validasi game pass
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Step 3: pembayaran
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
    const [isPaying, setIsPaying] = useState(false);
    const [paymentDone, setPaymentDone] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const numAmount = parseInt(rawAmount) || 0;
    const subtotal = computeSubtotal(numAmount);
    const fee = PAYMENT_FEES[paymentMethod] ?? 0;
    const total = subtotal + fee;
    const gamePassPrice = computeGamePassPrice(numAmount);

    const handleAmountChange = (val: string) => {
        const n = parseAmount(val);
        setRawAmount(n !== null ? n.toString() : '');
    };

    const handleStep1Next = () => {
        if (!username.trim()) {
            alert('Mohon isi username Roblox kamu!');
            return;
        }
        if (numAmount < 50) {
            alert('Minimal pembelian adalah 50 Robux!');
            return;
        }
        goToStep(2);
    };

    // ── Real API: Validasi game pass dan buat order UNPAID ──
    const handleValidate = async () => {
        if (!user) {
            alert('Anda harus login terlebih dahulu!');
            navigate('/login');
            return;
        }

        setIsValidating(true);
        setValidationError(null);
        setIsValidated(false);

        try {
            const response = await axios.post(
                `${API_URL}/orders/checkout`,
                {
                    robloxUsername: username,
                    robuxAmount: numAmount,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                    },
                }
            );

            if (response.data.success) {
                setOrderId(response.data.orderId);
                setIsValidated(true);
                console.log('[Validation Success]', response.data);
            } else {
                setValidationError('Validasi gagal. Silakan coba lagi.');
            }
        } catch (error: any) {
            console.error('[Validation Error]', error);
            const errorMsg = error.response?.data?.details || error.response?.data?.error || 'Game Pass tidak ditemukan. Pastikan harga sudah benar dan coba lagi.';
            setValidationError(errorMsg);
        } finally {
            setIsValidating(false);
        }
    };

    // ── Real API: Bayar dan trigger RobuxShip order creation ──
    const handlePay = async () => {
        if (!orderId) {
            alert('Order ID tidak ditemukan. Silakan validasi ulang.');
            return;
        }

        if (!user) {
            alert('Anda harus login terlebih dahulu!');
            navigate('/login');
            return;
        }

        setIsPaying(true);

        try {
            const response = await axios.post(
                `${API_URL}/orders/${orderId}/mock-pay`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                    },
                }
            );

            if (response.data.success) {
                console.log('[Payment Success]', response.data);
                setPaymentDone(true);
                window.scrollTo({ top: 0, behavior: 'instant' });
                
                // Redirect ke halaman pesanan setelah 2 detik
                setTimeout(() => {
                    navigate('/pesanan');
                }, 2000);
            } else {
                alert('Pembayaran gagal. Silakan coba lagi.');
            }
        } catch (error: any) {
            console.error('[Payment Error]', error);
            const errorMsg = error.response?.data?.error || 'Terjadi kesalahan saat memproses pembayaran.';
            alert(errorMsg);
        } finally {
            setIsPaying(false);
        }
    };

    const goToStep = (step: Step) => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* Back button */}
                <button
                    onClick={() => {
                        if (currentStep === 1) navigate('/');
                        else if (currentStep === 2) { setIsValidated(false); setValidationError(null); goToStep(1); }
                        else goToStep((currentStep - 1) as Step);
                    }}
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
                <div className="relative">

                    {/* ─── Konten Langkah ─── */}
                    <div className="flex flex-col gap-5 lg:pr-[368px]">

                        {/* ════════════ STEP 1: Detail Akun ════════════ */}
                        {currentStep === 1 && (
                            <>
                                {/* Card: Username */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-gray-900">Akun Kamu</h2>
                                            <p className="text-xs text-gray-400">Masukkan username akun yang mau diisi RBX</p>
                                        </div>
                                    </div>
                                    <label htmlFor="username" className="block text-sm font-semibold text-gray-600 mb-2">
                                        Username Roblox
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        autoFocus
                                        className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 rounded-2xl px-5 py-4 text-base font-medium text-gray-800 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="Contoh: RobloxPlayer123"
                                    />
                                    <p className="text-xs text-gray-400 mt-2">RBX bakal dikirim ke username ini.</p>
                                </div>

                                {/* Card: Pilih Jumlah RBX */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-gray-900">Pilih Jumlah RBX</h2>
                                            <p className="text-xs text-gray-400">Isi jumlah RBX yang kamu mau atau pilih di bawah</p>
                                        </div>
                                    </div>
                                    <label htmlFor="rbx-amount" className="block text-sm font-semibold text-gray-600 mb-2">
                                        Mau beli berapa RBX?
                                    </label>
                                    <div className="relative mb-1">
                                        <input
                                            id="rbx-amount"
                                            type="text"
                                            inputMode="numeric"
                                            value={rawAmount}
                                            onChange={(e) => handleAmountChange(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-100 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 rounded-2xl px-5 py-4 text-base font-medium text-gray-800 outline-none transition-all pr-16 placeholder:text-gray-300"
                                            placeholder="100"
                                        />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">RBX</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-4">Minimum 50 · Maksimum 100.000 RBX</p>

                                    <p className="text-sm font-semibold text-gray-500 mb-2">Atau pilih cepat:</p>
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

                                {/* Info cara kerja */}
                                <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-5">
                                    <p className="text-sm font-semibold text-brand-blue mb-2">Bagaimana cara kerjanya?</p>
                                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                        <li>Masukkan username & jumlah RBX yang diinginkan</li>
                                        <li>Buat Game Pass di Roblox dengan harga yang kami tentukan</li>
                                        <li>Selesaikan pembayaran — RBX otomatis masuk dalam &lt;5 menit</li>
                                    </ol>
                                </div>

                                <button
                                    onClick={handleStep1Next}
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
                                                onClick={() => goToStep(3)}
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

                                        {/* Checkbox Terms */}
                                        <label className="flex items-start gap-3 cursor-pointer select-none">
                                            <div className="relative flex-shrink-0 mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    checked={termsAccepted}
                                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                                                    ${termsAccepted ? 'bg-brand-blue border-brand-blue' : 'bg-white border-gray-300'}`}>
                                                    {termsAccepted && (
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-600 leading-relaxed">
                                                Saya telah membaca dan menyetujui{' '}
                                                <Link to="/syarat-ketentuan" target="_blank" rel="noopener noreferrer" className="text-brand-blue font-semibold hover:underline">
                                                    Syarat & Ketentuan
                                                </Link>{' '}dan{' '}
                                                <Link to="/kebijakan-privasi" target="_blank" rel="noopener noreferrer" className="text-brand-blue font-semibold hover:underline">
                                                    Kebijakan Privasi
                                                </Link>{' '}layanan El Top Up.
                                            </span>
                                        </label>

                                        {/* Tombol Bayar */}
                                        <button
                                            onClick={paymentMethod === 'qris' ? handlePay : undefined}
                                            disabled={isPaying || paymentMethod !== 'qris' || !termsAccepted}
                                            className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2
                                                ${isPaying || paymentMethod !== 'qris' || !termsAccepted
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
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* ─── Sidebar: Ringkasan ─── */}
                    <div className="mt-6 lg:mt-0 lg:absolute lg:top-0 lg:right-0 lg:w-[340px]">
                        <OrderSummary
                            amount={numAmount}
                            subtotal={subtotal}
                            fee={fee}
                            total={total}
                            paymentMethod={paymentMethod}
                        />

                        {/* Info akun */}
                        {username && (
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RobuxCheckout;
