// src/pages/KebijakanPrivasi.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Section {
    id: string;
    title: string;
    content: React.ReactNode;
}

const sections: Section[] = [
    {
        id: 'umum',
        title: '1. Pendahuluan',
        content: (
            <p>
                El Top Up ("kami", "platform") berkomitmen untuk melindungi privasi pengguna. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi kamu saat menggunakan layanan kami di eltopup.id.
            </p>
        ),
    },
    {
        id: 'data',
        title: '2. Data yang Kami Kumpulkan',
        content: (
            <ul className="list-disc list-inside space-y-1">
                <li><strong>Username Roblox</strong> — diperlukan untuk mengirimkan Robux ke akun kamu.</li>
                <li><strong>Nomor WhatsApp / Email</strong> — digunakan untuk konfirmasi pesanan dan dukungan pelanggan.</li>
                <li><strong>Data transaksi</strong> — jumlah Robux yang dibeli, metode pembayaran, waktu transaksi.</li>
                <li><strong>Data teknis</strong> — alamat IP, jenis browser, dan log akses untuk keamanan sistem.</li>
            </ul>
        ),
    },
    {
        id: 'penggunaan',
        title: '3. Penggunaan Data',
        content: (
            <ul className="list-disc list-inside space-y-1">
                <li>Memproses dan menyelesaikan transaksi top-up Robux.</li>
                <li>Mengirimkan notifikasi dan konfirmasi pesanan.</li>
                <li>Memberikan dukungan teknis dan layanan pelanggan.</li>
                <li>Mencegah penipuan dan menjaga keamanan platform.</li>
                <li>Meningkatkan kualitas layanan melalui analisis data agregat (tanpa identitas).</li>
            </ul>
        ),
    },
    {
        id: 'penyimpanan',
        title: '4. Penyimpanan & Keamanan',
        content: (
            <p>
                Data kamu disimpan di server yang aman. Kami menerapkan enkripsi dan kontrol akses yang ketat untuk melindungi informasi pribadi kamu dari akses yang tidak sah. Data transaksi disimpan selama 2 tahun untuk keperluan audit dan penyelesaian sengketa, setelah itu dihapus secara permanen.
            </p>
        ),
    },
    {
        id: 'berbagi',
        title: '5. Berbagi Data dengan Pihak Ketiga',
        content: (
            <ul className="list-disc list-inside space-y-1">
                <li>Kami <strong>tidak menjual</strong> data pribadi kamu kepada pihak mana pun.</li>
                <li>Data dapat diteruskan ke penyedia pembayaran (QRIS, bank) sebatas yang diperlukan untuk memproses transaksi.</li>
                <li>Kami dapat mengungkapkan data jika diwajibkan oleh hukum atau perintah pengadilan.</li>
            </ul>
        ),
    },
    {
        id: 'hak',
        title: '6. Hak Pengguna',
        content: (
            <ul className="list-disc list-inside space-y-1">
                <li><strong>Akses</strong> — kamu berhak meminta informasi tentang data yang kami simpan.</li>
                <li><strong>Koreksi</strong> — kamu berhak meminta perbaikan data yang tidak akurat.</li>
                <li><strong>Penghapusan</strong> — kamu dapat meminta penghapusan data pribadi, kecuali jika kami diwajibkan menyimpannya oleh hukum.</li>
                <li>Untuk menggunakan hak ini, hubungi kami melalui email atau WhatsApp di bawah.</li>
            </ul>
        ),
    },
    {
        id: 'cookie',
        title: '7. Cookie & Pelacakan',
        content: (
            <p>
                Kami menggunakan cookie sesi untuk mempertahankan status login dan preferensi kamu. Kami tidak menggunakan cookie pelacakan pihak ketiga untuk periklanan. Kamu dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur mungkin tidak berfungsi dengan baik.
            </p>
        ),
    },
    {
        id: 'perubahan',
        title: '8. Perubahan Kebijakan',
        content: (
            <p>
                Kami berhak memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di platform. Dengan terus menggunakan layanan kami setelah perubahan, kamu dianggap menyetujui kebijakan yang diperbarui.
            </p>
        ),
    },
    {
        id: 'kontak',
        title: '9. Hubungi Kami',
        content: (
            <p>
                Jika kamu memiliki pertanyaan atau permintaan terkait kebijakan privasi ini, silakan hubungi kami:{' '}
                <a href="mailto:eltopup@gmail.com" className="text-brand-blue font-semibold hover:underline">eltopup@gmail.com</a>{' '}
                atau WhatsApp{' '}
                <a href="https://wa.me/6285121300646" target="_blank" rel="noopener noreferrer" className="text-brand-blue font-semibold hover:underline">+62 851-2130-0646</a>.
            </p>
        ),
    },
];

const KebijakanPrivasi: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white">

            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-50 to-white pt-20 pb-14">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block bg-brand-blue/10 text-brand-blue text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">Kebijakan Privasi</h1>
                    <p className="text-gray-400 text-base">Terakhir diperbarui: Maret 2026</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-4">

                {/* Intro */}
                <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-5">
                    <p className="text-base text-gray-600 leading-relaxed">
                        Privasi kamu adalah prioritas kami. Harap baca kebijakan ini untuk memahami bagaimana El Top Up mengumpulkan, menggunakan, dan melindungi informasi pribadi kamu.
                    </p>
                </div>

                {/* Daftar isi */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <p className="font-bold text-gray-900 text-base mb-3">Daftar Isi</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {sections.map((s) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className="text-base text-brand-blue font-medium hover:underline py-0.5"
                            >
                                {s.title}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Sections */}
                {sections.map((s) => (
                    <div
                        key={s.id}
                        id={s.id}
                        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm scroll-mt-24"
                    >
                        <h2 className="font-extrabold text-gray-900 text-lg mb-3">{s.title}</h2>
                        <div className="text-base text-gray-600 leading-relaxed space-y-2">
                            {s.content}
                        </div>
                    </div>
                ))}

                {/* Bottom links */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center text-center pt-2">
                    <Link to="/bantuan" className="text-sm text-brand-blue font-semibold hover:underline">
                        Butuh bantuan? Hubungi kami →
                    </Link>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <Link to="/syarat-ketentuan" className="text-sm text-gray-500 hover:text-brand-blue transition-colors">
                        Syarat & Ketentuan
                    </Link>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <Link to="/" className="text-sm text-gray-500 hover:text-brand-blue transition-colors">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default KebijakanPrivasi;
