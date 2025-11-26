import React from "react";

const home: React.FC = () => {
    return (
         <section className="relative bg-white overflow-hidden pt-20 pb-32">
            
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            {/* div pembatas */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* container utama */}
                <div className="grid grid-cols-1 md:grid-cols-[45%_55%] gap-16 items-center">
                    
                    {/* Div Kiri (Asset) */}
                    <div className="hidden md:flex justify-left items-center w-full">
                         <div className="bg-brand-blue rounded-full w-full max-w-md aspect-square shadow-lg"></div>
                    </div>

                    {/* Div Kanan (Headline) */}
                    <div className="w-full text-center lg:text-left">
                        
                        {/* headline */}
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                            Top Up Robux Lebih Cepat,<br />
                            Lebih Murah, Lebih Aman.
                        </h1>     
                        
                        {/* sub-headline */}
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