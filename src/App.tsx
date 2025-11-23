// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login'; // <-- IMPORT BARU

function App() {
  return (
    <BrowserRouter>
      {/* Bungkus dengan AuthProvider di main.tsx */}
      <Routes>
        {/* Route Publik */}
        <Route path="/" element={<h1>Halaman Utama - Selamat Datang!</h1>} /> 
        
        {/* Route Autentikasi */}
        <Route path="/auth/register" element={<Register />} /> 
        <Route path="/auth/login" element={<Login />} /> {/* <-- ROUTE LOGIN BARU */}
        
        {/* Route yang memerlukan Login */}
        <Route path="/transactions" element={<h1>Riwayat Transaksi</h1>} />
        
        <Route path="*" element={<h1>404 - Halaman Tidak Ditemukan</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;