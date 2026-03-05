// src/pages/Auth/Login.tsx

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../api/authService';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();
  
  // Jika user sudah login, arahkan ke Home
  // if (user) { navigate('/'); } // Bisa ditambahkan jika perlu

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Panggil service API login
      const user = await authService.login({ email, password });
      
      // Update state global dan arahkan ke halaman utama
      setUser(user);
      navigate('/'); 

    } catch (err: any) {
      // Tangani error dari backend - format: { error: "message" }
      const message = err.response?.data?.error || 'Login gagal. Coba lagi nanti.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- AKHIR FUNGSI BARU ---

  return (
    <div className="max-w-md mx-auto p-4 mt-10 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Masuk ke Akun Anda</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400 mb-4"
        >
          {isLoading ? 'Masuk...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Belum punya akun? <a href="/auth/register" className="text-blue-600 hover:underline">Daftar di sini</a>
      </p>
    </div>
  );
};

export default Login;