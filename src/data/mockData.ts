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
  image: string; // Opsional
}

export const productPackages: ProductPackage[] = [
  {id: 1,
    name: '80 Robux',
    price: 12000,
    type: 'currency',
    image: 'https://tr.rbxcdn.com/1a79cd9c78825c006fc53e8395ea7510/150/150/Image/Png', // Contoh URL
  },
  {
    id: 2,
    name: 'Gamepass VIP',
    price: 75000,
    type: 'gamepass',
    image: 'https://tr.rbxcdn.com/c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6/150/150/Image/Png',
  }
];