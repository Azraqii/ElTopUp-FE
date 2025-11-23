// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Pastikan CSS/Tailwind diimpor
import { AuthProvider } from './hooks/useAuth.tsx'; // <-- BARIS BARU: Import AuthProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* BUNGKUS APLIKASI DENGAN PROVIDER */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);