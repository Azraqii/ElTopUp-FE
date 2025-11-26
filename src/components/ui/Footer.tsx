import React from "react";
import logoElTopup from "../../assets/eltopup.svg";
import Instagram from "../../assets/Instagram.svg";
import Mail from "../../assets/Mail.svg";
import Phone from "../../assets/Phone.svg";

const Footer: React.FC = () => {
    return (
        // Footer Section
        <footer className="bg-brand-light/30 pt-10 pb-6 border-t border-brand-light">
            {/* div pembatas */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-gray-700">
                    
                    {/* --- KOLOM 1: BRAND & DESKRIPSI*/}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        {/* Logo */}
                        <div className="flex items-center mb-4">
                            <img src={logoElTopup} alt="ElTopup Logo" className="h-8 mr-2" />
                            <span className="text-xl font-bold text-gray-900">El Top Up</span>
                        </div>

                        {/* Deskripsi */}
                        <p className="text-sm leading-relaxed mb-4 max-w-sm">
                            Tempat terpercaya untuk membeli Robux dan item Roblox dengan cepat, aman, dan harga terbaik.
                        </p>

                        {/* Copyright */}
                        <p className="text-xs text-gray-500">
                            © 2025. Tidak berafiliasi dengan Roblox Corporation.
                        </p>
                    </div>

                    {/* --- KOLOM 2: SHOP --- */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 text-lg">Shop</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                {/* Link ke Section Robux di Landing Page */}
                                <a 
                                    href="/#robux-section" 
                                    className="hover:text-brand-blue transition-colors"
                                >
                                    Beli Robux
                                </a>
                            </li>
                            <li>
                                {/* Link ke halaman Produk */}
                                <a 
                                    href="/products" 
                                    className="hover:text-brand-blue transition-colors"
                                >
                                    Produk
                                </a>
                            </li>
                            <li>
                                {/* Link Other Games (Placeholder) */}
                                <a 
                                    href="#" 
                                    className="hover:text-brand-blue transition-colors"
                                >
                                    Other Games
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* --- KOLOM 3: CONTACT --- */}
                    <div>
                       <h3 className="font-bold text-gray-900 mb-4 text-lg">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            
                            {/* WhatsApp Link */}
                            <li>
                                <a 
                                    href="https://wa.me/6285121300646" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-brand-blue transition-colors w-fit"
                                >
                                    <img src={Phone} alt="Phone" className="w-4 h-4" />
                                    <span>+62 851‑2130‑0646</span>
                                </a>
                            </li>

                            {/* Email Link */}
                            <li>
                                <a 
                                    href="mailto:eltopup@gmail.com" 
                                    className="flex items-center gap-2 hover:text-brand-blue transition-colors w-fit"
                                >
                                    <img src={Mail} alt="Email" className="w-4 h-4" />
                                    <span>eltopup@gmail.com</span>
                                </a>
                            </li>

                            {/* Instagram Link */}
                            <li>
                                <a 
                                    href="https://instagram.com/elroblox.id" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-brand-blue transition-colors w-fit"
                                >
                                    <img src={Instagram} alt="Instagram" className="w-4 h-4" />
                                    <span>@elroblox.id</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* --- KOLOM 4: ABOUT --- */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4 text-lg">About</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="/help" className="hover:text-brand-blue transition-colors">Bantuan</a></li>
                            <li><a href="/faq" className="hover:text-brand-blue transition-colors">Pertanyaan Umum</a></li>
                            <li><a href="/refund-policy" className="hover:text-brand-blue transition-colors">Kebijakan Refund</a></li>
                            <li><a href="/terms" className="hover:text-brand-blue transition-colors">Syarat & Ketentuan</a></li>
                        </ul>
                    </div>
                </div>  
            </div>
        </footer>
    );
};

export default Footer;