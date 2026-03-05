// src/data/mockData.ts

export const productDetails = {
  id: 'fish-it',
  name: 'Fish It!',
  developer: 'Fish Atelier',
  description: 'Fish It! adalah pengalaman simulator memancing Roblox. Dikembangkan dan diperbarui oleh tim Fish Atelier.',
  imageBanner: 'https://tr.rbxcdn.com/180DAY-c43a951666475e599518649555945356/768/432/Image/Png',
  serverActive: true,
};

// Definisikan Tipe Kategori yang diminta
export type ProductCategory = 
  | 'Coins' 
  | 'Crates' 
  | 'Game Pass' 
  | 'Limited Time' 
  | 'Server Boost' 
  | 'Upgrade Server Boost' 
  | 'Wheel Spins';

export interface ProductPackage {
  id: number;
  name: string;
  price: number;
  type: 'currency' | 'gamepass' | 'bundle'; // Tipe logic (untuk quantity limit)
  category: ProductCategory; // Tipe untuk Filter UI
  image: string;
}

export const productPackages: ProductPackage[] = [
  // --- COINS ---
  { 
    id: 1, name: '30.000 Coins', price: 20000, type: 'currency', category: 'Coins',
    image: 'https://placehold.co/200x200/f59e0b/ffffff?text=30K+Coins' 
  },
  { 
    id: 2, name: '100.000 Coins', price: 60000, type: 'currency', category: 'Coins',
    image: 'https://placehold.co/200x200/fbbf24/000000?text=100K+Coins' 
  },
  
  // --- CRATES ---
  { 
    id: 3, name: 'Standard Crate', price: 15000, type: 'currency', category: 'Crates',
    image: 'https://placehold.co/200x200/78350f/ffffff?text=Crate' 
  },

  // --- GAME PASS ---
  { 
    id: 4, name: 'VIP Gamepass', price: 50000, type: 'gamepass', category: 'Game Pass',
    image: 'https://placehold.co/200x200/b91c1c/ffffff?text=VIP' 
  },
  { 
    id: 5, name: 'Lucky Rod', price: 75000, type: 'gamepass', category: 'Game Pass',
    image: 'https://placehold.co/200x200/0ea5e9/ffffff?text=Lucky+Rod' 
  },

  // --- LIMITED TIME ---
  { 
    id: 6, name: 'Binary Edge', price: 79101, type: 'gamepass', category: 'Limited Time',
    image: 'https://placehold.co/200x200/10b981/ffffff?text=Binary+Edge' 
  },
  { 
    id: 7, name: 'Corruption Edge', price: 79101, type: 'gamepass', category: 'Limited Time',
    image: 'https://placehold.co/200x200/ef4444/ffffff?text=Corruption' 
  },
  { 
    id: 8, name: '1x1x1x1 Ban Hammer', price: 108801, type: 'gamepass', category: 'Limited Time',
    image: 'https://placehold.co/200x200/6366f1/ffffff?text=Ban+Hammer' 
  },

  // --- SERVER BOOST ---
  { 
    id: 9, name: '2x Luck (30m)', price: 25000, type: 'currency', category: 'Server Boost',
    image: 'https://placehold.co/200x200/8b5cf6/ffffff?text=2x+Luck' 
  },

  // --- WHEEL SPINS ---
  { 
    id: 10, name: '5 Wheel Spins', price: 10000, type: 'currency', category: 'Wheel Spins',
    image: 'https://placehold.co/200x200/ec4899/ffffff?text=Spins' 
  },
];