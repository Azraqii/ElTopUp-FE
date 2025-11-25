import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Memperbaiki path import:
// Pastikan struktur foldernya benar.
// Jika 'pages' dan 'components' ada di dalam 'src', maka path relatifnya harus benar.
// Asumsi: App.tsx berada langsung di dalam src/
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Navbar from './components/ui/Navbar';

import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans">
        {/* 1. Navbar ditaruh di LUAR <Routes> 
          Agar muncul di semua halaman (Home, Login, Register) secara otomatis.
        */}
        <Navbar />

        {/* 2. Wrapper Konten dengan Padding Top (pt-24)
          Karena Navbar kita posisinya "fixed" (melayang), konten di bawahnya 
          harus didorong ke bawah agar tidak tertutup oleh Navbar.
        */}
        <div className="pt-16 pb-10">
          <Routes>
            {/* Route Utama (Home) */}
            <Route path="/" element={
              <LandingPage />
            } />
            
            {/* Route Autentikasi */}
            <Route path="/auth/register" element={<Register />} /> 
            <Route path="/auth/login" element={<Login />} />
            
            {/* Route Lainnya */}
            <Route path="/transactions" element={<div className="max-w-7xl mx-auto px-4"><h1>Riwayat Transaksi</h1></div>} />
            <Route path="*" element={<div className="text-center mt-10"><h1>404 - Halaman Tidak Ditemukan</h1></div>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;