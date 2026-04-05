import React from 'react';
import type { Product } from '../../types/catalog';

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ItemCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ product, onBuy }) => {
  const isOutOfStock = product.stockEnabled && product.stockQty === 0;
  const isLowStock = product.stockEnabled && product.stockQty !== null && product.stockQty > 0 && product.stockQty <= 5;

  return (
    <div
      className={`
        relative bg-white rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden
        ${isOutOfStock
          ? 'border-gray-100 opacity-70'
          : 'border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100'
        }
      `}
    >
      {/* Gambar produk */}
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden rounded-t-2xl">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-3"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        {/* Placeholder jika tidak ada gambar */}
        {!product.imageUrl && (
          <div className="flex flex-col items-center justify-center gap-1 text-gray-300">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}

        {/* Badge stok rendah */}
        {isLowStock && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Stok: {product.stockQty}
          </div>
        )}

        {/* Overlay habis */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-t-2xl">
            <span className="bg-gray-200 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">Habis</span>
          </div>
        )}
      </div>

      {/* Info bawah */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">{product.name}</p>
        <p className="text-sm font-bold text-brand-blue mt-0.5">{formatIDR(product.priceIdr)}</p>
        {product.maxQty > 1 && (
          <p className="text-[10px] text-gray-400">Maks. {product.maxQty}x</p>
        )}

        {/* Tombol beli */}
        <div className="mt-auto pt-2 flex justify-end">
          <button
            onClick={() => !isOutOfStock && onBuy(product)}
            disabled={isOutOfStock}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all
              ${isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-blue text-white hover:bg-blue-700 active:scale-95'
              }
            `}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            Beli
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
