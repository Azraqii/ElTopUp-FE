// src/pages/Pesanan.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mockOrders } from '../data/mockOrders';
import type { OrderStatus } from '../data/mockOrders';

// ── Status config ──────────────────────────────────────────────
const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; dotColor: string; badgeBg: string }
> = {
  on_progress: {
    label: 'On Progress',
    color: 'text-yellow-700',
    dotColor: 'bg-yellow-400',
    badgeBg: 'bg-yellow-50 border border-yellow-200',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-700',
    dotColor: 'bg-green-500',
    badgeBg: 'bg-green-50 border border-green-200',
  },
  failed: {
    label: 'Failed',
    color: 'text-red-700',
    dotColor: 'bg-red-500',
    badgeBg: 'bg-red-50 border border-red-200',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-gray-500',
    dotColor: 'bg-gray-400',
    badgeBg: 'bg-gray-50 border border-gray-200',
  },
};

// ── Filter tabs ────────────────────────────────────────────────
const filterTabs: { label: string; value: 'all' | OrderStatus }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'On Progress', value: 'on_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
];

// ── Helpers ────────────────────────────────────────────────────
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatPrice = (n: number) =>
  `Rp ${n.toLocaleString('id-ID')}`;

// ── Component ──────────────────────────────────────────────────
const Pesanan: React.FC = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | OrderStatus>('all');

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Kamu belum login.</p>
        <Link
          to="/auth/login"
          className="bg-brand-blue text-white px-8 py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity"
        >
          Login Sekarang
        </Link>
      </div>
    );
  }

  const filtered =
    activeFilter === 'all'
      ? mockOrders
      : mockOrders.filter((o) => o.status === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/profile"
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Back to profile"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
          <p className="text-sm text-gray-400">{mockOrders.length} total transaksi</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {filterTabs.map((tab) => {
          const count =
            tab.value === 'all'
              ? mockOrders.length
              : mockOrders.filter((o) => o.status === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5
                ${
                  activeFilter === tab.value
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                  ${activeFilter === tab.value ? 'bg-white/20 text-white' : 'bg-white text-gray-600'}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Order Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-500 font-medium">Belum ada pesanan di kategori ini.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => {
            const cfg = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Top row: ID + status */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{order.id}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.date)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${cfg.badgeBg} ${cfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
                    {cfg.label}
                  </span>
                </div>

                {/* Product info */}
                <div className="flex items-center gap-4">
                  <img
                    src={order.gameImage}
                    alt={order.gameName}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">{order.productName}</p>
                    <p className="text-sm text-gray-400">{order.gameName}</p>
                    {order.robloxUsername && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Username: <span className="font-medium text-gray-600">{order.robloxUsername}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400 mb-0.5">{order.amount}</p>
                    <p className="font-bold text-brand-blue">{formatPrice(order.price)}</p>
                  </div>
                </div>

                {/* Bottom action (optional) */}
                {order.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                    <button className="text-xs font-semibold text-brand-blue hover:underline">
                      Beli Lagi
                    </button>
                  </div>
                )}
                {order.status === 'on_progress' && (
                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-xs text-yellow-600 font-medium flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sedang diproses...
                    </p>
                    <button className="text-xs font-semibold text-gray-400 hover:underline">
                      Hubungi Support
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Pesanan;
