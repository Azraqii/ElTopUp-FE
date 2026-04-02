// src/pages/Auth/AuthSuccess.tsx
// Google OAuth Callback Handler
// Backend redirects here after Google OAuth with JWT in query param:
//   /auth/callback?token=eyJhbGci...

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../api/authService';

type Stage = 'syncing' | 'error';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [stage, setStage] = useState<Stage>('syncing');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handle = async () => {
      // ── 1. Extract JWT from query param ──────────────────────────────────
      // Backend redirects with: /auth/callback?token=eyJhbGci...
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        const errMsg = params.get('error_description') || params.get('error') || 'Token tidak ditemukan dari Google OAuth.';
        setErrorMsg(errMsg);
        setStage('error');
        return;
      }

      try {
        // ── 2. Fetch full profile from GET /api/auth/me ──────────────────────
        const profile = await authService.getMe(token);

        // ── 3. Build StoredUser & persist ────────────────────────────────────
        const storedUser = {
          ...profile,
          access_token: token,
        };
        localStorage.setItem('user', JSON.stringify(storedUser));
        setUser(storedUser);

        // ── 4. Redirect to dashboard ─────────────────────────────────────────
        navigate('/', { replace: true });
      } catch (err: any) {
        console.error('[AuthSuccess] Error:', err);
        const msg =
          err.response?.data?.error ||
          err.message ||
          'Gagal memproses akun Google. Coba lagi.';
        setErrorMsg(msg);
        setStage('error');
      }
    };

    handle();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Error UI ──────────────────────────────────────────────────────────────
  if (stage === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Login Google Gagal</h2>
          <p className="text-sm text-gray-500 mb-6">{errorMsg}</p>
          <button
            onClick={() => navigate('/auth/login')}
            className="w-full bg-brand-blue text-white font-bold py-3 rounded-2xl hover:bg-blue-600 transition-colors"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  // ── Loading / Syncing UI ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-brand-blue animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Memproses Akun Google</h2>
        <p className="text-sm text-gray-400">Mohon tunggu, kamu akan segera diarahkan…</p>
      </div>
    </div>
  );
};

export default AuthSuccess;