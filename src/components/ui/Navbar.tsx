import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

//Import Assets
import logoELTopup from "../../assets/eltopup.svg";


const Navbar: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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
        logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    const displayName = user ? (user.name ?? user.email.split('@')[0]) : '';
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <>
        <nav className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm z-50 top-0 left-0 transition-all duration-300 ">
            {/* div pembatas */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* div flex wrapper */}
                <div className="flex justify-between items-center h-16">
                    {/* bagian kiri: logo + menus */}
                    <div className = "flex items-center gap-10">
                        {/* logo di kiri */}
                        <Link to="/" className="flex-shrink-0">
                            <img src={logoELTopup} alt="ELTopup Logo" className="h-[75px] w-auto" />
                        </Link>
                        {/* navigasi link - hidden di mobile */}
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

                    {/* bagian kanan: sign in / profile + hamburger */}
                    <div className = "flex items-center gap-4">

                        {user ? (
                            /* ── Profile Avatar + Dropdown ── */
                            <div className="relative hidden md:block" ref={dropdownRef}>
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
                                        className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                                        {/* User info header */}
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
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* ── Sign In button ── */
                            <Link 
                                to="/auth/login" 
                                className="hidden md:inline-flex bg-brand-blue text-white px-8 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* hamburger - only on mobile */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </nav>

        {/* ── Mobile Sidebar Overlay ── */}
        {isSidebarOpen && (
            <div
                className="fixed inset-0 bg-black/40 z-[60] md:hidden"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}

        {/* ── Mobile Sidebar Panel ── */}
        <div className={`fixed top-0 right-0 h-full w-72 bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            {/* Header sidebar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                    <img src={logoELTopup} alt="ELTopup Logo" className="h-[60px] w-auto" />
                </Link>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* User info (jika login) */}
            {user && (
                <div className="flex items-center gap-3 px-5 py-4 bg-blue-50 border-b border-blue-100">
                    <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {initial}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                </div>
            )}

            {/* Nav links */}
            <nav className="flex flex-col px-4 py-4 gap-1 flex-1">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className="text-base font-semibold text-gray-800 hover:text-brand-blue hover:bg-blue-50 px-4 py-3 rounded-xl transition-all"
                    >
                        {link.name}
                    </Link>
                ))}

                {/* Auth links jika sudah login */}
                {user && (
                    <>
                        <div className="border-t border-gray-100 my-2" />
                        <Link
                            to="/profile"
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-base font-semibold text-gray-800 hover:text-brand-blue hover:bg-blue-50 px-4 py-3 rounded-xl transition-all"
                        >
                            Profile
                        </Link>
                        <Link
                            to="/pesanan"
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-base font-semibold text-gray-800 hover:text-brand-blue hover:bg-blue-50 px-4 py-3 rounded-xl transition-all"
                        >
                            Pesanan
                        </Link>
                    </>
                )}
            </nav>

            {/* Sign In / Logout button */}
            <div className="px-5 pb-8">
                {user ? (
                    <button
                        onClick={() => { handleLogout(); setIsSidebarOpen(false); }}
                        className="block w-full bg-red-500 text-white text-center font-bold py-3 rounded-2xl hover:bg-red-600 transition-all"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/auth/login"
                        onClick={() => setIsSidebarOpen(false)}
                        className="block w-full bg-brand-blue text-white text-center font-bold py-3 rounded-2xl hover:bg-blue-600 transition-all"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </div>
        </>
    );
};

export default Navbar;