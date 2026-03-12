import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Halaman Auth
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import AuthSuccess from './pages/Auth/AuthSuccess';

// Import Komponen UI
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';

// Import Halaman Utama
import LandingPage from './pages/LandingPage';
import ProductDetail from './pages/ProductDetail';
import ProductCatalog from './pages/ProductCatalog';
import RobuxCheckout from './pages/RobuxCheckout';
import Bantuan from './pages/Bantuan';
import TentangKami from './pages/TentangKami';
import SyaratKetentuan from './pages/SyaratKetentuan';
import KebijakanPrivasi from './pages/KebijakanPrivasi';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans flex flex-col">
        
        {/* Navbar (Fixed position di dalam komponennya, jadi butuh padding di konten utama) */}
        <Navbar />

        {/* Container Utama: pt-16 untuk kompensasi tinggi Navbar */}
        <div className="pt-16 pb-10 flex-grow">
          <Routes>
            {/* Halaman Depan */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth */}
            <Route path="/auth/register" element={<Register />} /> 
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthSuccess />} />
            
            {/* ROUTE BARU: Halaman Catalog (Berisi DisplaySection dkk) */}
            <Route path="/products" element={<ProductCatalog />} />

            {/* Transaksi Detail (Dinamis berdasarkan slug) */}
            <Route path="/transaction/:slug" element={<ProductDetail />} />

            {/* Robux Checkout Flow */}
            <Route path="/checkout/robux" element={<RobuxCheckout />} />

            {/* Info Pages */}
            <Route path="/bantuan" element={<Bantuan />} />
            <Route path="/tentang-kami" element={<TentangKami />} />
            <Route path="/syarat-ketentuan" element={<SyaratKetentuan />} />
            <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />

            {/* User Pages */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/pesanan" element={<Orders />} />
            <Route path="/pesanan/:id" element={<OrderDetail />} />

            {/* Placeholder Pages */}
            <Route path="/transactions" element={<div className="max-w-7xl mx-auto px-4 mt-8"><h1>Riwayat Transaksi</h1></div>} />
            <Route path="*" element={<div className="text-center mt-20"><h1>404 - Halaman Tidak Ditemukan</h1></div>} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;