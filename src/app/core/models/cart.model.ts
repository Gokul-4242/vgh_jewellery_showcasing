export interface ProductSummary {
  _id: string;
  name: string;
  sku?: string;
  category?: string;
  material?: string;
  weight?: number;
  makingCharge?: number;
  wastagePercent?: number;
  stoneCost?: number;
  price?: number;
  images?: { url: string; fileId?: string; _id?: string }[];
  description?: string;
  stock?: number;
}

export interface CartItem {
  productId: ProductSummary;
  quantity: number;
  _id?: string;
}

export interface BullionRates {
  gold24k: number;
  gold22k: number;
  silver: number;
  updatedAt?: string;
}

export interface CartResponse {
  success: boolean;
  data: {
    _id: string;
    userId: string;
    items: CartItem[];
  };
}
