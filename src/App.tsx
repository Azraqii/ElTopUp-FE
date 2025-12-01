import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Navbar from './components/ui/Navbar';
import LandingPage from './pages/LandingPage';
import Footer from './components/ui/Footer';

// Import Halaman Baru
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans flex flex-col">
        
        <Navbar />

        <div className="pt-16 pb-10 flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/auth/register" element={<Register />} /> 
            <Route path="/auth/login" element={<Login />} />
            
            {/* ROUTE BARU: Transaksi Detail */}
            {/* Menggunakan parameter :slug agar dinamis (misal: /transaction/fish-it) */}
            <Route path="/transaction/:slug" element={<ProductDetail />} /> 

            <Route path="/transactions" element={<div className="max-w-7xl mx-auto px-4"><h1>Riwayat Transaksi</h1></div>} />
            <Route path="*" element={<div className="text-center mt-10"><h1>404 - Halaman Tidak Ditemukan</h1></div>} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;