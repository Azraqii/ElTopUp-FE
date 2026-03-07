// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalTransactions: 0,
    completedOrders: 0,
    totalSpent: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch order statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
        
        const response = await axios.get(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });

        const orders = response.data.orders || [];
        const completed = orders.filter((o: any) => o.uiStatus === 'Completed');
        const total = completed.reduce((sum: number, o: any) => sum + o.priceIdr, 0);

        setStats({
          totalTransactions: orders.length,
          completedOrders: completed.length,
          totalSpent: total,
        });
      } catch (err) {
        console.error('Error fetching order stats:', err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

  // Avatar: gunakan initial dari email jika tidak ada avatar
  const displayName = user.name ?? user.email.split('@')[0];
  const initial = displayName.charAt(0).toUpperCase();
  const memberSince = new Date().getFullYear(); // Bisa diganti dari data user nanti

  const infoItems = [
    { label: 'Email', value: user.email },
    { label: 'Username', value: displayName },
    { label: 'Role', value: user.role === 'admin' ? 'Admin' : 'Member' },
    { label: 'Member Sejak', value: memberSince.toString() },
  ];

  const statCards = [
    {
      label: 'Total Pesanan',
      value: isLoadingStats ? '...' : stats.totalTransactions,
      suffix: 'transaksi',
      color: 'bg-blue-50 text-brand-blue',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Berhasil',
      value: isLoadingStats ? '...' : stats.completedOrders,
      suffix: 'selesai',
      color: 'bg-green-50 text-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Belanja',
      value: isLoadingStats ? '...' : `Rp ${stats.totalSpent.toLocaleString('id-ID')}`,
      suffix: '',
      color: 'bg-purple-50 text-purple-600',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-brand-blue to-blue-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-24 h-24 rounded-full border-4 border-white/40 object-cover shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white/40 bg-white/20 flex items-center justify-center shadow-md">
                <span className="text-4xl font-bold text-white">{initial}</span>
              </div>
            )}
          </div>

          {/* Info utama */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold mb-1">{displayName}</h1>
            <p className="text-blue-100 text-sm mb-3">{user.email}</p>
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
              {user.role === 'admin' ? '⭐ Admin' : '👤 Member'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              to="/pesanan"
              className="bg-white text-brand-blue text-sm font-bold px-5 py-2 rounded-full hover:bg-blue-50 transition-colors text-center"
            >
              Lihat Pesanan
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className={`rounded-2xl p-5 ${stat.color} flex items-center gap-4`}>
            <div className="opacity-70">{stat.icon}</div>
            <div>
              <p className="text-xs font-semibold opacity-70 uppercase tracking-wide">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
              {stat.suffix && <p className="text-xs opacity-60">{stat.suffix}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Akun */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">Detail Akun</h2>
        <div className="divide-y divide-gray-50">
          {infoItems.map((item) => (
            <div key={item.label} className="flex justify-between items-center py-3.5">
              <span className="text-sm text-gray-500 font-medium">{item.label}</span>
              <span className="text-sm text-gray-800 font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
