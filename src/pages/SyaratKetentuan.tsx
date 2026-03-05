// src/pages/SyaratKetentuan.tsx
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
        title: '1. Ketentuan Umum',
        content: (
            <p>
                Dengan menggunakan layanan El Top Up ("kami", "platform"), kamu menyetujui syarat dan ketentuan ini secara penuh. Jika kamu tidak menyetujui syarat ini, mohon untuk tidak menggunakan layanan kami. Kami berhak memperbarui ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.
            </p>
        ),
    },
    {
        id: 'layanan',
        title: '2. Deskripsi Layanan',
        content: (
            <ul className="list-disc list-inside space-y-1">
                <li>El Top Up menyediakan layanan top up Robux untuk pengguna Roblox di Indonesia.</li>
                <li>Layanan dilakukan melalui mekanisme pembelian Game Pass di akun Roblox pengguna.</li>
                <li>El Top Up adalah reseller independen dan tidak berafiliasi dengan Roblox Corporation.</li>
                <li>Robux yang kamu terima berasal dari akun resmi yang dikelola oleh tim kami.</li>
            </ul>
        ),
    },
    {
        id: 'pembelian',
        title: '3. Proses Pembelian',
        content: (
            <ul className="list-disc list-inside space-y-1">
                <li>Kamu wajib memasukkan username Roblox yang benar. Kami tidak bertanggung jawab atas kesalahan input username.</li>
                <li>Setelah order dibuat, kamu wajib membuat Game Pass dengan harga yang telah ditentukan.</li>
                <li>Jangan mengubah harga Game Pass atau mengaktifkan Regional Pricing hingga proses selesai.</li>
                <li>Robux akan dikirim setelah pembayaran terkonfirmasi, umumnya dalam 1–5 menit.</li>
                <li>Pada kondisi tertentu (server Roblox sibuk, dll.), proses dapat memakan waktu hingga 24 jam.</li>
            </ul>
        ),
    },
    {
        id: 'pembayaran',
        title: '4. Pembayaran',
        content: (
            <ul className="list-disc list-inside space-y-1">
                <li>Seluruh pembayaran bersifat final setelah dikonfirmasi.</li>
                <li>Harga yang tercantum sudah termasuk PPN jika berlaku.</li>
                <li>Biaya tambahan (biaya QRIS, biaya admin transfer) akan ditampilkan sebelum konfirmasi pembayaran.</li>
                <li>Kami tidak menyimpan data kartu kredit atau detail rekening bank kamu.</li>
            </ul>
        ),
    },
    {
        id: 'refund',
        title: '5. Kebijakan Refund',
        content: (
            <>
                <p className="mb-2">Refund dapat diproses dalam kondisi berikut:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Robux tidak masuk dalam waktu 24 jam setelah pembayaran terkonfirmasi.</li>
                    <li>Terjadi kesalahan pengiriman dari sisi sistem kami.</li>
                </ul>
                <p className="mt-2">
                    Refund <strong>tidak</strong> dapat diproses jika:
                </p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>Username yang diinputkan salah dan bukan tanggung jawab kami.</li>
                    <li>Kamu mengubah harga Game Pass atau mengaktifkan Regional Pricing sebelum proses selesai.</li>
                    <li>Akun Roblox kamu terkena banned atau pembatasan dari Roblox Corporation.</li>
                </ul>
            </>
        ),
    },
    {
        id: 'larangan',
        title: '6. Larangan Penggunaan',
        content: (
            <ul className="list-disc list-inside space-y-1">
                <li>Dilarang menggunakan layanan kami untuk aktivitas ilegal atau penipuan.</li>
                <li>Dilarang melakukan chargeback tanpa alasan yang sah.</li>
                <li>Dilarang mencoba memanipulasi sistem pembayaran atau memperoleh Robux secara curang.</li>
                <li>Pelanggaran dapat mengakibatkan pemblokiran akun dan pelaporan ke pihak berwajib.</li>
            </ul>
        ),
    },
    {
        id: 'privasi',
        title: '7. Privasi Data',
        content: (
            <ul className="list-disc list-inside space-y-1">
                <li>Kami mengumpulkan data minimal yang diperlukan untuk memproses transaksi (username Roblox, data pembayaran).</li>
                <li>Data kamu tidak akan dijual atau dibagikan kepada pihak ketiga tanpa izin kamu, kecuali diwajibkan oleh hukum.</li>
                <li>Kami menggunakan enkripsi standar industri untuk melindungi data transaksi.</li>
            </ul>
        ),
    },
    {
        id: 'hukum',
        title: '8. Hukum yang Berlaku',
        content: (
            <p>
                Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia. Setiap perselisihan yang timbul akan diselesaikan melalui musyawarah terlebih dahulu, dan jika tidak tercapai kesepakatan, akan diselesaikan melalui jalur hukum yang berlaku di Indonesia.
            </p>
        ),
    },
    {
        id: 'kontak',
        title: '9. Kontak',
        content: (
            <p>
                Untuk pertanyaan seputar syarat dan ketentuan ini, silakan hubungi kami melalui:{' '}
                <a href="mailto:eltopup@gmail.com" className="text-brand-blue font-semibold hover:underline">eltopup@gmail.com</a>{' '}
                atau WhatsApp{' '}
                <a href="https://wa.me/6285121300646" target="_blank" rel="noopener noreferrer" className="text-brand-blue font-semibold hover:underline">+62 851-2130-0646</a>.
            </p>
        ),
    },
];

const SyaratKetentuan: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-white">

            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-50 to-white pt-20 pb-14">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block bg-brand-blue/10 text-brand-blue text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">Syarat & Ketentuan</h1>
                    <p className="text-gray-400 text-base">Terakhir diperbarui: Maret 2026</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-4">

                {/* Intro */}
                <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-5">
                    <p className="text-base text-gray-600 leading-relaxed">
                        Harap baca syarat dan ketentuan berikut dengan seksama sebelum menggunakan layanan El Top Up. Dengan melanjutkan transaksi, kamu dianggap telah membaca, memahami, dan menyetujui seluruh syarat ini.
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
                    <Link to="/" className="text-sm text-gray-500 hover:text-brand-blue transition-colors">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SyaratKetentuan;
