import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

//Import Assets
import logoELTopup from "../../assets/eltopup.svg";


const Navbar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navLinks = [
        { name: 'Beli Robux', path: '/'},
        { name: 'Produk', path: '/products'},
        { name: 'Tentang Kami', path: '/tentang-kami'},
        { name: 'Bantuan', path: '/bantuan'},
    ];

    // Tutup dropdown jika klik di luar
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsLoggingOut(true);
        setIsDropdownOpen(false);
        setTimeout(() => {
            logout();
            navigate('/');
        }, 700);
    };

    const displayName = user ? (user.name ?? user.email.split('@')[0]) : '';
    const initial = displayName.charAt(0).toUpperCase();

    const isActive = (path: string) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <>
        {/* ── Top Navbar ── */}
        <nav className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm z-50 top-0 left-0 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo + desktop nav links */}
                    <div className="flex items-center gap-10">
                        <Link to="/" className="flex-shrink-0 -ml-2 md:ml-0">
                            <img src={logoELTopup} alt="ELTopup Logo" className="h-[75px] w-auto" />
                        </Link>
                        <div className="hidden md:flex space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-base font-semibold text-gray-900 hover:text-brand-blue transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right side: profile avatar (all screens) or sign in */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                                    className="flex items-center gap-2 focus:outline-none group"
                                    aria-label="Profile menu"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={displayName}
                                            className="w-9 h-9 rounded-full border-2 border-brand-blue object-cover"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm border-2 border-blue-200 group-hover:border-brand-blue transition-colors">
                                            {initial}
                                        </div>
                                    )}
                                    <svg
                                        className={`hidden md:block w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-brand-blue transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </Link>
                                        <Link
                                            to="/pesanan"
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-brand-blue transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Pesanan
                                        </Link>
                                        <div className="border-t border-gray-50 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isLoggingOut ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                {isLoggingOut ? 'Keluar...' : 'Logout'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/auth/login"
                                className="bg-brand-blue text-white px-5 py-2 md:px-8 md:py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                            >
                                Masuk
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>

        {/* ── Mobile Bottom Navigation Bar ── */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.07)] z-50">
            <div className="flex items-end justify-around px-1 pb-4 pt-2">

                {/* 1. Produk */}
                <Link to="/products" className="flex flex-col items-center gap-1 min-w-[56px]">
                    <div className={`p-1.5 rounded-xl transition-colors ${isActive('/products') ? 'text-brand-blue' : 'text-gray-400'}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/products') ? 2.5 : 2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                        </svg>
                    </div>
                    <span className={`text-[10px] font-semibold leading-none ${isActive('/products') ? 'text-brand-blue' : 'text-gray-400'}`}>Produk</span>
                </Link>

                {/* 2. Pesanan */}
                <Link to="/pesanan" className="flex flex-col items-center gap-1 min-w-[56px]">
                    <div className={`p-1.5 rounded-xl transition-colors ${isActive('/pesanan') ? 'text-brand-blue' : 'text-gray-400'}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/pesanan') ? 2.5 : 2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <span className={`text-[10px] font-semibold leading-none ${isActive('/pesanan') ? 'text-brand-blue' : 'text-gray-400'}`}>Pesanan</span>
                </Link>

                {/* 3. Beli Robux — CENTER */}
                <div className="flex flex-col items-center gap-1">
                    <Link
                        to="/checkout/robux"
                        className="w-14 h-14 rounded-full bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/40 border-[3px] border-white"
                    >
                        <span className="text-white font-black text-lg tracking-tight">R$</span>
                    </Link>
                    <span className={`text-[10px] font-bold leading-none ${isActive('/') ? 'text-brand-blue' : 'text-gray-400'}`}>Robux</span>
                </div>

                {/* 4. Bantuan */}
                <Link to="/bantuan" className="flex flex-col items-center gap-1 min-w-[56px]">
                    <div className={`p-1.5 rounded-xl transition-colors ${isActive('/bantuan') ? 'text-brand-blue' : 'text-gray-400'}`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/bantuan') ? 2.5 : 2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className={`text-[10px] font-semibold leading-none ${isActive('/bantuan') ? 'text-brand-blue' : 'text-gray-400'}`}>Bantuan</span>
                </Link>

                {/* 5. Profil / Sign In */}
                <Link
                    to={user ? '/profile' : '/auth/login'}
                    className="flex flex-col items-center gap-1 min-w-[56px]"
                >
                    <div className={`p-1.5 rounded-xl transition-colors ${isActive('/profile') || isActive('/auth') ? 'text-brand-blue' : 'text-gray-400'}`}>
                        {user && user.avatar ? (
                            <img src={user.avatar} alt={displayName} className="w-6 h-6 rounded-full object-cover border border-brand-blue" />
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('/profile') || isActive('/auth') ? 2.5 : 2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                    </div>
                    <span className={`text-[10px] font-semibold leading-none ${isActive('/profile') || isActive('/auth') ? 'text-brand-blue' : 'text-gray-400'}`}>
                        {user ? 'Profil' : 'Masuk'}
                    </span>
                </Link>

            </div>
        </nav>
        </>
    );
};

export default Navbar;
