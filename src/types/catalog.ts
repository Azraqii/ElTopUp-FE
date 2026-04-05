export interface Game {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  meetupWorldName: string | null;
}

export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  priceIdr: number;
  imageUrl: string | null;
  minQty: number;
  maxQty: number;
  stockEnabled: boolean;
  stockQty: number | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}
