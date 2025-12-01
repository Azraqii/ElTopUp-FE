export const productDetails = {
  id: 'fish-it',
  name: 'Fish It!',
  developer: 'Fish Atelier',
  description: 'Fish It! adalah pengalaman simulator memancing Roblox. Dikembangkan dan diperbarui oleh tim Fish Atelier.',
  imageBanner: 'https://tr.rbxcdn.com/180 DAY-c43a951666475e599518649555945356/768/432/Image/Png', // Placeholder URL asli Roblox
  serverActive: true,
};

export interface ProductPackage {
  id: number;
  name: string;
  price: number;
  type: 'currency' | 'gamepass' | 'bundle'; // Tipe item
  image?: string; // Opsional
}

export const productPackages: ProductPackage[] = [
  { id: 1, name: '15.000 Coins + Binary Edge', price: 105000, type: 'bundle' },
  { id: 2, name: '30.000 Coins', price: 200000, type: 'currency' },
  { id: 3, name: 'VIP Gamepass', price: 50000, type: 'gamepass' }, // Cuma bisa beli 1
  { id: 4, name: 'Lucky Rod', price: 75000, type: 'gamepass' },     // Cuma bisa beli 1
  { id: 5, name: '100.000 Coins', price: 600000, type: 'currency' },
  { id: 6, name: 'Starter Bundle', price: 25000, type: 'bundle' },
];