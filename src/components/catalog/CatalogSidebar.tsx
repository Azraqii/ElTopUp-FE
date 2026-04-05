import React from 'react';
import type { GameCategory } from '../../types/catalog';

interface CatalogSidebarProps {
  categories: GameCategory[];
  selectedCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
  loading: boolean;
}

const CatalogSidebar: React.FC<CatalogSidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortOrder,
  onSortChange,
  loading,
}) => {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Section Kategori */}
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Kategori</p>

          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {/* Semua */}
              <button
                onClick={() => onCategoryChange(null)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-50 text-brand-blue font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.slug)}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-blue-50 text-brand-blue font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Section Urutkan */}
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Urutkan</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onSortChange('asc')}
              className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                sortOrder === 'asc'
                  ? 'border-brand-blue bg-blue-50 text-brand-blue font-semibold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Harga Terendah
            </button>
            <button
              onClick={() => onSortChange('desc')}
              className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                sortOrder === 'desc'
                  ? 'border-brand-blue bg-blue-50 text-brand-blue font-semibold'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Harga Tertinggi
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Footer Info */}
        <div className="p-4 flex flex-col gap-1">
          <p className="text-xs font-bold text-gray-500">El Top Up</p>
          <p className="text-xs text-gray-400">Item dikirim via meetup di Roblox</p>
          <a
            href="https://wa.me/6285121300646"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-brand-blue transition-colors mt-1"
          >
            Pertanyaan? Chat kami
          </a>
        </div>
      </div>
    </aside>
  );
};

export default CatalogSidebar;
