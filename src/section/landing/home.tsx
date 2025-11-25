import React from "react";

const home: React.FC = () => {
    return (
        <section className="relative bg-white overflow-hidden pt-20 pb-32">
            
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400/30   rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            {/* div pembatas */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* container utama */}
                <div className="grid grid-cols-1 md:grid-cols-[35%_1fr] gap-12 items-center">
                    
                    {/*div kiri buat asset*/}
                    <div className="hidden md:flex justify-center items-center ">
                         <div className="bg-brand-blue rounded-full w-full aspect-square"></div>
                    </div>

                    {/* div kanan buat headline */}
                    <div className = "w-full py-5 pl-5">
                        {/* headline */}
                        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight ml-8">
                            Top Up Robux Lebih Cepat,<br />
                            Lebih Murah, Lebih Aman.
                        </h1>     
                        
                        {/* sub-headline */}
                        <p className="mt-3 ml-8 mr-16 text-lg text-gray-600 md:max-w-2xl leading-relaxed">
                            Top up Robux tercepat dengan harga terbaik dan layanan 24/7. {' '}
                            <span className="font-semibold text-gray-900 underline decoration-brand-blue decoration-2 underline-offset-2">
                            Fast, secure, trusted
                            </span>
                        </p>                               
                    </div>
                </div>
            </div>
        </section>
    );
};

export default home;