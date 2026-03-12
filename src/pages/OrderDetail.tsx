// src/pages/OrderDetail.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderDetail {
  orderId: string;
  paymentStatus: 'UNPAID' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
  robuxshipStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'ERROR' | null;
  robuxAmount: number;
  customerPriceIdr: number;
  robloxUsername: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// ─── Status config ────────────────────────────────────────────────────────────
type UiStatus = 'pending_payment' | 'processing' | 'completed' | 'failed';

function resolveUiStatus(order: OrderDetail): UiStatus {
  if (order.paymentStatus === 'UNPAID') return 'pending_payment';
  if (order.paymentStatus === 'PAID') {
    if (order.robuxshipStatus === 'COMPLETED') return 'completed';
    if (
      order.robuxshipStatus === 'FAILED' ||
      order.robuxshipStatus === 'CANCELLED' ||
      order.robuxshipStatus === 'ERROR'
    )
      return 'failed';
    return 'processing';
  }
  return 'failed';
}

const STATUS_CONFIG: Record<
  UiStatus,
  { label: string; color: string; bg: string; border: string; dotColor: string; icon: React.ReactNode }
> = {
  pending_payment: {
    label: 'Menunggu Pembayaran',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dotColor: 'bg-amber-400',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  processing: {
    label: 'Sedang Diproses',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dotColor: 'bg-brand-blue',
    icon: (
      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    ),
  },
  completed: {
    label: 'Selesai',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    dotColor: 'bg-green-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  failed: {
    label: 'Gagal / Dibatalkan',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    dotColor: 'bg-red-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

// ─── Timeline Step ────────────────────────────────────────────────────────────
interface TimelineStep {
  key: string;
  label: string;
  description: string;
  state: 'done' | 'active' | 'waiting';
}

function buildTimeline(order: OrderDetail): TimelineStep[] {
  const paid = order.paymentStatus === 'PAID';
  const robux = order.robuxshipStatus;

  const orderCreated: TimelineStep = {
    key: 'created',
    label: 'Pesanan Dibuat',
    description: formatDate(order.createdAt),
    state: 'done',
  };

  const payment: TimelineStep = {
    key: 'payment',
    label: 'Pembayaran',
    description: paid
      ? 'Pembayaran dikonfirmasi'
      : order.paymentStatus === 'UNPAID'
      ? 'Menunggu konfirmasi pembayaran'
      : 'Pembayaran gagal / kedaluwarsa',
    state: paid ? 'done' : order.paymentStatus === 'UNPAID' ? 'active' : 'done',
  };

  const delivery: TimelineStep = {
    key: 'delivery',
    label: 'Pengiriman Robux',
    description:
      !paid
        ? 'Menunggu pembayaran'
        : robux === 'COMPLETED'
        ? 'Robux berhasil dikirim!'
        : robux === 'FAILED' || robux === 'ERROR'
        ? 'Pengiriman gagal — hubungi support'
        : robux === 'CANCELLED'
        ? 'Pengiriman dibatalkan'
        : robux === 'PROCESSING'
        ? 'Sedang diproses oleh sistem'
        : 'Menunggu diproses',
    state:
      !paid
        ? 'waiting'
        : robux === 'COMPLETED'
        ? 'done'
        : robux === 'FAILED' || robux === 'ERROR' || robux === 'CANCELLED'
        ? 'done'
        : 'active',
  };

  const received: TimelineStep = {
    key: 'received',
    label: 'Robux Diterima',
    description:
      robux === 'COMPLETED'
        ? `${order.robuxAmount?.toLocaleString('id-ID')} Robux sudah masuk ke @${order.robloxUsername}`
        : 'Menunggu pengiriman selesai',
    state: robux === 'COMPLETED' ? 'done' : 'waiting',
  };

  return [orderCreated, payment, delivery, received];
}

// ─── Robuxship Status Badge ───────────────────────────────────────────────────
const ROBUXSHIP_LABEL: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'Menunggu', color: 'text-gray-500' },
  PROCESSING: { label: 'Diproses', color: 'text-blue-600' },
  COMPLETED:  { label: 'Selesai', color: 'text-green-600' },
  FAILED:     { label: 'Gagal', color: 'text-red-600' },
  CANCELLED:  { label: 'Dibatalkan', color: 'text-gray-500' },
  ERROR:      { label: 'Error', color: 'text-red-600' },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect jika tidak login
  useEffect(() => {
    if (!user) navigate('/auth/login');
  }, [user, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const fetchOrder = useCallback(
    async (silent = false) => {
      if (!user || !id) return;
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);

      try {
        const response = await axios.get(`${API_URL}/orders/${id}/status`, {
          headers: { Authorization: `Bearer ${user.access_token}` },
        });
        setOrder(response.data);
        setLastRefreshed(new Date());
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Gagal mengambil data order.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user, id, API_URL],
  );

  // Initial fetch
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Auto-poll setiap 10 detik jika status masih in-progress
  useEffect(() => {
    if (!order) return;
    const uiStatus = resolveUiStatus(order);
    if (uiStatus !== 'pending_payment' && uiStatus !== 'processing') return;

    const interval = setInterval(() => fetchOrder(true), 10_000);
    return () => clearInterval(interval);
  }, [order, fetchOrder]);

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
        <p className="text-gray-400 text-sm font-medium">Memuat detail pesanan...</p>
      </div>
    );
  }

  // ── Error State ──
  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-red-500 font-medium text-center">{error || 'Order tidak ditemukan.'}</p>
        <Link
          to="/pesanan"
          className="bg-brand-blue text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-colors"
        >
          Kembali ke Pesanan
        </Link>
      </div>
    );
  }

  const uiStatus = resolveUiStatus(order);
  const cfg = STATUS_CONFIG[uiStatus];
  const timeline = buildTimeline(order);
  const orderRef = order.orderId.substring(0, 8).toUpperCase();
  const isInProgress = uiStatus === 'pending_payment' || uiStatus === 'processing';

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* ── Back button ── */}
        <Link
          to="/pesanan"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium mb-6 transition-colors group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Pesanan
        </Link>

        {/* ── Page Title ── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Detail Pesanan</h1>
            <p className="text-sm text-gray-400 mt-0.5">#{orderRef}</p>
          </div>
          {/* Refresh badge */}
          <button
            onClick={() => fetchOrder(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-blue transition-colors mt-1"
            title="Refresh status"
          >
            <svg
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? 'Memperbarui...' : `${lastRefreshed.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
          </button>
        </div>

        {/* ── Status Banner ── */}
        <div className={`rounded-2xl border px-5 py-4 flex items-center gap-4 mb-5 ${cfg.bg} ${cfg.border}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
            {cfg.icon}
          </div>
          <div className="flex-1">
            <p className={`font-bold text-base ${cfg.color}`}>{cfg.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {uiStatus === 'pending_payment' && 'Selesaikan pembayaran untuk memproses pesananmu.'}
              {uiStatus === 'processing' && 'Robux sedang dalam proses pengiriman. Biasanya 1–5 menit.'}
              {uiStatus === 'completed' && `${order.robuxAmount?.toLocaleString('id-ID')} Robux telah dikirim ke akun @${order.robloxUsername}.`}
              {uiStatus === 'failed' && 'Terjadi masalah dengan pesanan ini. Hubungi support jika perlu.'}
            </p>
          </div>
          {isInProgress && (
            <span className="flex-shrink-0 text-xs font-semibold text-blue-500 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
              Auto-refresh
            </span>
          )}
        </div>

        {/* ── Order Info Card ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            Informasi Pesanan
          </h2>

          <div className="space-y-3">
            {/* Roblox Info */}
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {order.robloxUsername?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Username Roblox</p>
                <p className="font-bold text-gray-800">@{order.robloxUsername}</p>
              </div>
            </div>

            {/* Detail rows */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Jumlah Robux</p>
                <p className="font-bold text-gray-800">
                  {order.robuxAmount?.toLocaleString('id-ID')}
                  <span className="text-xs font-normal text-gray-400 ml-1">RBX</span>
                </p>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Total Bayar</p>
                <p className="font-bold text-brand-blue">{formatIDR(order.customerPriceIdr)}</p>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Tanggal Order</p>
                <p className="font-semibold text-gray-700 text-sm">{formatDate(order.createdAt)}</p>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Terakhir Update</p>
                <p className="font-semibold text-gray-700 text-sm">{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Status Detail Card ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Status Pesanan
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Payment status */}
            <div className="p-3.5 border border-gray-100 rounded-xl">
              <p className="text-xs text-gray-400 mb-1.5">Status Pembayaran</p>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                  order.paymentStatus === 'PAID'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : order.paymentStatus === 'UNPAID'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    order.paymentStatus === 'PAID' ? 'bg-green-500' : order.paymentStatus === 'UNPAID' ? 'bg-amber-400' : 'bg-red-500'
                  }`}
                />
                {order.paymentStatus === 'PAID' ? 'Dibayar' : order.paymentStatus === 'UNPAID' ? 'Belum Dibayar' : order.paymentStatus}
              </span>
            </div>

            {/* Robuxship status */}
            <div className="p-3.5 border border-gray-100 rounded-xl">
              <p className="text-xs text-gray-400 mb-1.5">Status Pengiriman</p>
              {order.paymentStatus !== 'PAID' ? (
                <span className="text-xs text-gray-400 font-medium">Menunggu pembayaran</span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                    order.robuxshipStatus === 'COMPLETED'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : order.robuxshipStatus === 'PROCESSING'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : order.robuxshipStatus === 'FAILED' || order.robuxshipStatus === 'ERROR'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : order.robuxshipStatus === 'CANCELLED'
                      ? 'bg-gray-50 text-gray-500 border-gray-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      order.robuxshipStatus === 'COMPLETED'
                        ? 'bg-green-500'
                        : order.robuxshipStatus === 'PROCESSING'
                        ? 'bg-brand-blue'
                        : order.robuxshipStatus === 'FAILED' || order.robuxshipStatus === 'ERROR'
                        ? 'bg-red-500'
                        : order.robuxshipStatus === 'CANCELLED'
                        ? 'bg-gray-400'
                        : 'bg-amber-400'
                    }`}
                  />
                  {order.robuxshipStatus
                    ? (ROBUXSHIP_LABEL[order.robuxshipStatus]?.label ?? order.robuxshipStatus)
                    : 'Menunggu'}
                </span>
              )}
            </div>
          </div>

          {/* Live info note */}
          {order.paymentStatus === 'PAID' && order.robuxshipStatus !== 'COMPLETED' && (
            <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-blue-700">
                Status pengiriman diperbarui otomatis dari <strong>RobuxShip</strong> setiap 10 detik.
                Robux biasanya tiba dalam <strong>1–5 menit</strong> setelah pembayaran dikonfirmasi.
              </p>
            </div>
          )}
        </div>

        {/* ── Timeline ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-5">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            Riwayat Proses
          </h2>

          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gray-100 -z-0" />

            <div className="space-y-5">
              {timeline.map((step) => (
                <div key={step.key} className="flex items-start gap-4 relative">
                  {/* Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${
                      step.state === 'done'
                        ? 'bg-brand-blue border-brand-blue'
                        : step.state === 'active'
                        ? 'bg-white border-brand-blue'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    {step.state === 'done' ? (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : step.state === 'active' ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-0.5">
                    <p
                      className={`font-semibold text-sm ${
                        step.state === 'waiting' ? 'text-gray-400' : 'text-gray-800'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        step.state === 'waiting' ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/pesanan"
            className="flex-1 text-center bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
          >
            Semua Pesanan
          </Link>

          {uiStatus === 'completed' && (
            <Link
              to="/checkout/robux"
              className="flex-1 text-center bg-brand-blue text-white font-bold py-3.5 rounded-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-brand-blue/25 text-sm"
            >
              Beli Lagi
            </Link>
          )}

          {(uiStatus === 'failed') && (
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-red-50 border border-red-200 text-red-600 font-bold py-3.5 rounded-2xl hover:bg-red-100 transition-colors text-sm"
            >
              Hubungi Support
            </a>
          )}

          {isInProgress && (
            <button
              onClick={() => fetchOrder(true)}
              disabled={isRefreshing}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-blue text-white font-bold py-3.5 rounded-2xl hover:bg-blue-600 transition-colors shadow-lg shadow-brand-blue/25 text-sm disabled:opacity-60"
            >
              <svg
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshing ? 'Memperbarui...' : 'Cek Status Sekarang'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
