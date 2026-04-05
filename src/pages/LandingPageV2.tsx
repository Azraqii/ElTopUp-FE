import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGames, useGameCatalog } from '../hooks/useCatalog';
import RobuxBanner from '../components/catalog/RobuxBanner';
import CatalogSidebar from '../components/catalog/CatalogSidebar';
import ItemCard from '../components/catalog/ItemCard';
import GameSelector from '../components/catalog/GameSelector';
import type { Game, Product } from '../types/catalog';

const LandingPageV2: React.FC = () => {
  const navigate = useNavigate();
  const { games, loading: loadingGames } = useGames();

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { categories, products, loadingCategories, loadingProducts, fetchByCategory } =
    useGameCatalog(selectedGame?.slug ?? null);

  // Set game default setelah fetch selesai
  useEffect(() => {
    if (games.length > 0 && !selectedGame) {
      setSelectedGame(games[0]);
    }
  }, [games, selectedGame]);

  // Scroll ke atas saat mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGameChange = (game: Game) => {
    setSelectedGame(game);
    setSelectedCategory(null);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (slug: string | null) => {
    setSelectedCategory(slug);
    fetchByCategory(slug);
  };

  const handleBuy = (product: Product) => {
    navigate('/checkout/item', { state: { product, game: selectedGame } });
  };

  // Sort produk di frontend
  const sortedProducts = [...products].sort((a, b) =>
    sortOrder === 'asc' ? a.priceIdr - b.priceIdr : b.priceIdr - a.priceIdr
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* ── Baris Atas: GameSelector + Search ── */}
        <div className="flex items-center gap-3 mb-5">
          <GameSelector
            games={games}
            selectedGame={selectedGame}
            onSelect={handleGameChange}
            loading={loadingGames}
          />
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              disabled
              placeholder="Cari item... (segera hadir)"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* ── Layout 2 Kolom ── */}
        <div className="flex gap-5 items-start">

          {/* Sidebar */}
          <CatalogSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            loading={loadingCategories}
          />

          {/* Konten Utama */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* RobuxBanner */}
            <RobuxBanner />

            {/* Judul section */}
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-gray-900">
                Item {selectedGame?.name ?? 'Game'}
              </h1>
              {!loadingProducts && (
                <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {sortedProducts.length}
                </span>
              )}
            </div>

            {/* Grid Item / Loading / Empty */}
            {loadingProducts ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <svg className="w-14 h-14 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                </svg>
                {games.length === 0 ? (
                  <>
                    <p className="text-gray-500 font-semibold">Segera hadir!</p>
                    <p className="text-gray-400 text-sm">Item game akan tersedia dalam waktu dekat.</p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 font-semibold">Belum ada item</p>
                    <p className="text-gray-400 text-sm">Belum ada item untuk kategori ini.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {sortedProducts.map((product) => (
                  <ItemCard key={product.id} product={product} onBuy={handleBuy} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal sementara untuk checkout item — sebelum halaman /checkout/item dibuat */}
      {/* Navigasi langsung via useNavigate sudah diset, halaman akan ditambah di fase berikutnya */}
    </div>
  );
};

export default LandingPageV2;
