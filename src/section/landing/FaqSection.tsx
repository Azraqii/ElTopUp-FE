import React from 'react';
import Accordion from '../../components/ui/Accordion';

const FaqSection: React.FC = () => {
  // Data FAQ dengan penomoran di judulnya
  const faqs = [
    {
      question: "1. Bagaimana cara membeli Robux di website ini?",
      answer: "Pilih paket Robux yang diinginkan, masukkan username Roblox Anda, lalu ikuti instruksi pembayaran yang tersedia. Setelah pembayaran terkonfirmasi, Robux akan dikirim ke akun Anda."
    },
    {
      question: "2. Berapa lama proses top up?",
      answer: "robux 5 hari, item secepatnya insyaAllah..."
    },
    {
      question: "3. Apakah aman membeli Robux di sini?",
      answer: "Aman banget dongss."
    },
    {
      question: "4. Bagaimana jika Robux tidak masuk ke akun?",
      answer: "Tanya bos aja nnti"
    },
    {
      question: "5. Bisakah saya membeli untuk teman?",
      answer: "Bisa banget dong, kalau bisa beli yang banyak sekalian hehe."
    },
    {
      question: "6. Apakah kalian meminta data pribadi?",
      answer: "g"
    }
  ];

  return (
    <section className="bg-white py-16 md:py-24 relative overflow-hidden">
      {/* Background Glow Dekoratif (Opsional, agar senada dengan hero) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header FAQ */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Pertanyaan Yang Sering Ditanya
          </h2>
        </div>

        {/* Grid FAQ: 1 Kolom (Mobile), 2 Kolom (Tablet), 3 Kolom (Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((faq, index) => (
            // Class h-full di sini memaksa wrapper mengisi tinggi grid cell
            <div key={index} className="h-full">
               <Accordion title={faq.question} content={faq.answer} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FaqSection;