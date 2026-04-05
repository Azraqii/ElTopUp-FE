import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Game, GameCategory, Product } from '../types/catalog';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${API_URL}/items/games`)
      .then(res => setGames(res.data.games || []))
      .catch(() => setError('Gagal memuat daftar game'))
      .finally(() => setLoading(false));
  }, []);

  return { games, loading, error };
}

export function useGameCatalog(gameSlug: string | null) {
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch kategori saat game berubah
  useEffect(() => {
    if (!gameSlug) return;
    setLoadingCategories(true);
    axios.get(`${API_URL}/items/games/${gameSlug}/categories`)
      .then(res => setCategories(res.data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  }, [gameSlug]);

  // Fetch semua produk saat game berubah (tanpa filter kategori)
  useEffect(() => {
    if (!gameSlug) return;
    setLoadingProducts(true);
    axios.get(`${API_URL}/items/games/${gameSlug}/products`)
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [gameSlug]);

  // Fetch produk dengan filter kategori
  const fetchByCategory = (categorySlug: string | null) => {
    if (!gameSlug) return;
    setLoadingProducts(true);
    const url = categorySlug
      ? `${API_URL}/items/games/${gameSlug}/products?categorySlug=${categorySlug}`
      : `${API_URL}/items/games/${gameSlug}/products`;
    axios.get(url)
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  };

  return { categories, products, loadingCategories, loadingProducts, fetchByCategory };
}
