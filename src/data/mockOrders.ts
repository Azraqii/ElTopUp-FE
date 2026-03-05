// src/data/mockOrders.ts

export type OrderStatus = 'on_progress' | 'completed' | 'failed' | 'cancelled';

export interface Order {
  id: string;
  productName: string;
  gameName: string;
  gameImage: string;
  amount: string;    // e.g. "400 Robux", "30.000 Coins"
  price: number;
  status: OrderStatus;
  date: string;
  robloxUsername?: string;
}

export const mockOrders: Order[] = [
  {
    id: 'TRX-20260305-001',
    productName: '400 Robux',
    gameName: 'Roblox',
    gameImage: 'https://placehold.co/80x80/1364FF/ffffff?text=RBX',
    amount: '400 Robux',
    price: 62000,
    status: 'completed',
    date: '2026-03-05T10:23:00Z',
    robloxUsername: 'PlayerOne123',
  },
  {
    id: 'TRX-20260304-002',
    productName: 'VIP Gamepass',
    gameName: 'Fish It!',
    gameImage: 'https://tr.rbxcdn.com/180DAY-c43a951666475e599518649555945356/768/432/Image/Png',
    amount: '1x VIP Gamepass',
    price: 50000,
    status: 'on_progress',
    date: '2026-03-04T15:44:00Z',
    robloxUsername: 'PlayerOne123',
  },
  {
    id: 'TRX-20260303-003',
    productName: '800 Robux',
    gameName: 'Roblox',
    gameImage: 'https://placehold.co/80x80/1364FF/ffffff?text=RBX',
    amount: '800 Robux',
    price: 120000,
    status: 'completed',
    date: '2026-03-03T08:15:00Z',
    robloxUsername: 'PlayerOne123',
  },
  {
    id: 'TRX-20260228-004',
    productName: '100.000 Coins',
    gameName: 'Fish It!',
    gameImage: 'https://tr.rbxcdn.com/180DAY-c43a951666475e599518649555945356/768/432/Image/Png',
    amount: '100.000 Coins',
    price: 60000,
    status: 'failed',
    date: '2026-02-28T19:02:00Z',
    robloxUsername: 'PlayerOne123',
  },
  {
    id: 'TRX-20260225-005',
    productName: 'Lucky Rod',
    gameName: 'Fish It!',
    gameImage: 'https://tr.rbxcdn.com/180DAY-c43a951666475e599518649555945356/768/432/Image/Png',
    amount: '1x Lucky Rod',
    price: 75000,
    status: 'cancelled',
    date: '2026-02-25T12:30:00Z',
    robloxUsername: 'PlayerOne123',
  },
  {
    id: 'TRX-20260220-006',
    productName: '2000 Robux',
    gameName: 'Roblox',
    gameImage: 'https://placehold.co/80x80/1364FF/ffffff?text=RBX',
    amount: '2000 Robux',
    price: 290000,
    status: 'completed',
    date: '2026-02-20T09:10:00Z',
    robloxUsername: 'PlayerOne123',
  },
];
