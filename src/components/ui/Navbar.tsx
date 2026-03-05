import React, { useState } from "react";
import { Link } from "react-router-dom";

//Import Assets
import logoELTopup from "../../assets/eltopup.svg";
import iconSearch from "../../assets/search.svg";

const Navbar: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navLinks = [
        { name: 'Beli Robux', path: '/'},
        { name: 'Produk', path: '/products'},
        { name: 'Tentang Kami', path: '/tentang-kami'},
        { name: 'Bantuan', path: '/bantuan'},
    ];

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

                    {/* bagian kanan: search + sign in + hamburger */}
                    <div className = "flex items-center gap-4">
                        {/* search icon - hidden on mobile */}
                        <button className="hidden md:flex p-2 hover:bg-gray-100 rounded-full">
                            <img src={iconSearch} alt="Search" className="w-5 h-5" />
                        </button>
                        {/* sign up button - hidden on mobile */}
                        <Link 
                            to="/auth/login" 
                            className="hidden md:inline-flex bg-brand-blue text-white px-8 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                            >
                            Sign In
                        </Link>
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

            {/* Nav links */}
            <nav className="flex flex-col px-4 py-6 gap-1 flex-1">
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
            </nav>

            {/* Sign In button */}
            <div className="px-5 pb-8">
                <Link
                    to="/auth/login"
                    onClick={() => setIsSidebarOpen(false)}
                    className="block w-full bg-brand-blue text-white text-center font-bold py-3 rounded-2xl hover:bg-blue-600 transition-all"
                >
                    Sign In
                </Link>
            </div>
        </div>
        </>
    );
};

export default Navbar;