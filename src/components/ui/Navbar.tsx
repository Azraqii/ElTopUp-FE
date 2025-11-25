import React, { useState } from "react";
import { Link } from "react-router-dom";

//Import Assets
import logoELTopup from "../../assets/eltopup.svg";
import iconSearch from "../../assets/search.svg";
import iconCart from "../../assets/cart.svg";

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Beli Robux', path: '/'},
        { name : 'Produk', path: '/products'},
        { name : 'Tentang Kami', path: '/about'},
        { name : 'Bantuan', path: '/support'},
    ];

    return (
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
                        {/* navigasi link - hidden di mobile / klo di minimize */}
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

                    {/* bagian kanan: search + cart + sign in menu */}
                    <div className = "flex items-center gap-6">
                        {/* search icon */}
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <img src={iconSearch} alt="Search" className="w-5 h-5" />
                        </button>
                        {/* cart icon */}
                        <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full relative">
                            <img src={iconCart} alt="Cart" className="w-5 h-5" />
                        </button>
                        {/* sign up button */}
                        <Link 
                            to="/auth/login" 
                            className="bg-brand-blue text-white px-5 py-2 md:px-8 md:py-2.5 rounded-full text-xs md:text-sm font-bold hover:opacity-90 transition-opacity"
                            >
                            Sign In
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;