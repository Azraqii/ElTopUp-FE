// src/pages/Auth/Register.tsx

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../api/authService';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const { email, password, confirmPassword } = formData;

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

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      setIsLoading(false);
      return;
    }

    try {
      // Panggil service API register
      const user = await authService.register({ email, password });
      
      // Update state global dan arahkan ke halaman utama
      setUser(user);
      navigate('/'); 

    } catch (err: any) {
      // Tangani error dari backend (misalnya, email sudah terdaftar)
      const message = err.response?.data?.message || 'Pendaftaran gagal. Coba lagi.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-10 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Daftar Akun Baru</h2>
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Sudah punya akun? <a href="/auth/login" className="text-blue-600 hover:underline">Login di sini</a>
      </p>
    </div>
  );
};

export default Register;