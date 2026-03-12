// src/pages/Pesanan.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

// ── Types ──────────────────────────────────────────────────────
type OrderStatus = 'On Progress' | 'Completed' | 'Failed' | 'Cancelled';

interface Order {
  id: string;
  orderNumber: string;
  formattedDate: string;
  priceIdr: number;
  targetUsername: string;
  itemName: string;
  gameName: string;
  gameImage: string;
  amount: string;
  uiStatus: OrderStatus;
  paymentStatus: string;
  robuxshipStatus: string;
}

// ── Status config ──────────────────────────────────────────────
const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; dotColor: string; badgeBg: string }
> = {
  'On Progress': {
    label: 'On Progress',
    color: 'text-yellow-700',
    dotColor: 'bg-yellow-400',
    badgeBg: 'bg-yellow-50 border border-yellow-200',
  },
  'Completed': {
    label: 'Completed',
    color: 'text-green-700',
    dotColor: 'bg-green-500',
    badgeBg: 'bg-green-50 border border-green-200',
  },
  'Failed': {
    label: 'Failed',
    color: 'text-red-700',
    dotColor: 'bg-red-500',
    badgeBg: 'bg-red-50 border border-red-200',
  },
  'Cancelled': {
    label: 'Cancelled',
    color: 'text-gray-500',
    dotColor: 'bg-gray-400',
    badgeBg: 'bg-gray-50 border border-gray-200',
  },
};

// ── Filter tabs ────────────────────────────────────────────────
const filterTabs: { label: string; value: 'Semua' | OrderStatus }[] = [
  { label: 'Semua', value: 'Semua' },
  { label: 'On Progress', value: 'On Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Cancelled', value: 'Cancelled' },
];

// ── Helpers ────────────────────────────────────────────────────
const formatPrice = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

// ── Component ──────────────────────────────────────────────────
const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'Semua' | OrderStatus>('Semua');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders dari backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
        
        const response = await axios.get(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });

        setOrders(response.data.orders || []);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.error || 'Gagal mengambil data pesanan.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 pt-16">
        <p className="text-gray-500 text-base sm:text-lg text-center">Kamu belum login.</p>
        <Link
          to="/auth/login"
          className="bg-brand-blue text-white px-8 py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity text-sm sm:text-base"
        >
          Login Sekarang
        </Link>
      </div>
    );
  }

  // Filter orders berdasarkan tab aktif
  const filteredOrders =
    activeFilter === 'Semua'
      ? orders
      : orders.filter((o) => o.uiStatus === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-10 pt-20  min-h-screen">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pesanan Saya</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            {isLoading ? 'Memuat...' : `${orders.length} total transaksi`}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {filterTabs.map((tab) => {
          const count =
            tab.value === 'Semua'
              ? orders.length
              : orders.filter((o) => o.uiStatus === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5
                ${
                  activeFilter === tab.value
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {tab.label}
              <span
                className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold
                  ${activeFilter === tab.value ? 'bg-white/20 text-white' : 'bg-white text-gray-600'}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 280px)' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mb-4"></div>
          <p className="text-gray-500 font-medium text-sm sm:text-base">Memuat pesanan...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center text-center px-4" style={{ minHeight: 'calc(100vh - 280px)' }}>
          <div className="text-4xl sm:text-5xl mb-4">⚠️</div>
          <p className="text-red-500 font-medium mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-blue text-white px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Order Cards */}
      {!isLoading && !error && (
        <>
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-4" style={{ minHeight: 'calc(100vh - 280px)' }}>
              <p className="text-gray-500 font-medium text-sm sm:text-base">
                {activeFilter === 'Semua'
                  ? 'Belum ada pesanan.'
                  : `Belum ada pesanan dengan status "${activeFilter}".`}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4 pb-8">
              {filteredOrders.map((order) => {
                const cfg = statusConfig[order.uiStatus];
                return (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/pesanan/${order.id}`)}
                    className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer"
                  >
                    {/* Top row: ID + status */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div>
                        <p className="text-xs text-gray-400 font-medium">#{order.orderNumber}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">{order.formattedDate}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${cfg.badgeBg} ${cfg.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
                        {cfg.label}
                      </span>
                    </div>

                    {/* Product info */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img
                        src={order.gameImage}
                        alt={order.gameName}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/56?text=Game';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 truncate text-sm sm:text-base">{order.itemName}</p>
                        <p className="text-xs sm:text-sm text-gray-400">{order.gameName}</p>
                        {order.targetUsername && (
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                            Username: <span className="font-medium text-gray-600">{order.targetUsername}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">{order.amount}</p>
                        <p className="font-bold text-brand-blue text-sm sm:text-base">{formatPrice(order.priceIdr)}</p>
                      </div>
                    </div>

                    {/* Bottom action — always visible */}
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                      {/* Left: inline status text */}
                      <div className="flex-1 min-w-0">
                        {order.uiStatus === 'On Progress' && (
                          <p className="text-[10px] sm:text-xs text-yellow-600 font-medium flex items-center gap-1.5">
                            <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {order.paymentStatus === 'UNPAID' ? 'Menunggu pembayaran...' : 'Sedang diproses...'}
                          </p>
                        )}
                        {order.uiStatus === 'Failed' && (
                          <p className="text-[10px] sm:text-xs text-red-500 font-medium">Transaksi gagal</p>
                        )}
                        {order.uiStatus === 'Cancelled' && (
                          <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Dibatalkan</p>
                        )}
                      </div>

                      {/* Right: action buttons */}
                      <div
                        className="flex items-center gap-3 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {order.uiStatus === 'Completed' && (
                          <Link
                            to="/checkout/robux"
                            className="text-[10px] sm:text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            Beli Lagi
                          </Link>
                        )}
                        <Link
                          to={`/pesanan/${order.id}`}
                          className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-brand-blue hover:text-blue-700 transition-colors"
                        >
                          Lihat Detail
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
