// src/pages/Auth/AuthSuccess.tsx

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.tsx';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  
  useEffect(() => {
    // 1. Ambil token dari URL query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
        // Karena kita hanya mengirim token, kita harus mendekode data dasar user
        // Peringatan: Untuk keamanan, decoding token sebaiknya dilakukan di BE.
        // Tapi untuk development cepat, kita asumsikan payload valid.
        
        // Contoh decoding dasar JWT (payload[1])
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Buat objek user minimal
        const user = {
            _id: payload.id, // ID dari JWT payload
            email: payload.email || 'user_google', // Tambahkan field email jika ada
            role: 'user', // Asumsi default role
            token: token,
        };
        
        // 2. Simpan user ke Local Storage dan Auth Context
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        // 3. Redirect ke halaman utama
        navigate('/');
    } else {
        // Jika tidak ada token, anggap gagal dan arahkan ke login
        navigate('/auth/login?error=google_failed');
    }
  }, [location.search, navigate, setUser]);

  return (
    <div className="p-10 text-center mt-10">
      <h1 className="text-xl font-semibold">Memproses Login Google...</h1>
      <p>Mohon tunggu sebentar. Anda akan segera diarahkan.</p>
    </div>
  );
};

export default AuthSuccess;