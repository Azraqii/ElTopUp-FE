import React from "react";

const home: React.FC = () => {
    return (
         <section className="relative bg-white overflow-hidden pt-20 pb-32">
            
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            {/* div pembatas */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* container utama */}
                {/* PERBAIKAN LAYOUT:
                    - Base (Mobile/Minimize): grid-cols-1 (tumpuk ke bawah).
                    - md (Tablet/Desktop): grid-cols-[35%_1fr] (kiri 35%, kanan sisanya).
                    - gap-12: Memberi jarak yang cukup.
                    - items-center: Memastikan vertikal alignment pas di tengah.
                */}
                <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-16 items-center">
                    
                    {/* Div Kiri (Asset) */}
                    {/* Di mobile, kita bisa sembunyikan atau tampilkan. 
                        Kode asli Anda pakai 'hidden md:flex', artinya hilang di mobile. 
                        Jika ingin muncul di mobile, hapus 'hidden'.
                        Saya biarkan 'hidden md:flex' sesuai kode asli Anda agar konsisten.
                    */}
                    <div className="hidden md:flex justify-left items-center w-full">
                         <div className="bg-brand-blue rounded-full w-full max-w-md aspect-square shadow-lg"></div>
                    </div>

                    {/* Div Kanan (Headline) */}
                    {/* Hapus padding hardcode 'py-5 pl-5' yang kaku. Biarkan grid mengatur jarak.
                        Gunakan w-full agar teks mengambil ruang yang tersedia.
                    */}
                    <div className="w-full text-center lg:text-left">
                        
                        {/* headline */}
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                            Top Up Robux Lebih Cepat,<br />
                            Lebih Murah, Lebih Aman.
                        </h1>     
                        
                        {/* sub-headline */}
                        {/* Margin:
                            - mx-auto: Agar di tengah saat Mobile.
                            - lg:mx-0: Agar margin kiri 0 (nempel kiri) saat Desktop.
                        */}
                        <p className="mt-6 text-lg text-gray-600 md:max-w-lg leading-relaxed mx-auto lg:mx-0">
                            Top up Robux tercepat dengan harga terbaik dan layanan 24/7. {' '}
                            <span className="font-semibold text-gray-900 underline decoration-brand-blue decoration-2 underline-offset-2">
                            Fast, Secure, Trusted
                            </span>
                        </p>                               
                    </div>
                </div>
            </div>
        </section>
    );
};

export default home;