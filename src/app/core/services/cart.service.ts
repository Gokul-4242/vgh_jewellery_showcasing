import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ProductService } from './product.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface CartItem {
  productId: {
    _id: string;
    name: string;
    price?: number;
    images?: { url: string }[];
    category?: string;
    material?: string;
    weight?: number;
    makingCharge?: number;
    wastagePercent?: number;
  };
  quantity: number;
  _id?: string;
}

export interface CartResponse {
  success: boolean;
  data: {
    _id: string;
    userId: string;
    items: CartItem[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiService = inject(ApiService);
  private readonly productService = inject(ProductService);

  // Internal state using signals
  private cartState = signal<any>(null);
  private ratesState = signal<any>(null); // single rate object: { gold24k, gold22k, silver }

  // Expose signals for components
  cart = computed(() => this.cartState());
  items = computed(() => this.cartState()?.items || []);
  rates = computed(() => this.ratesState());

  // Totals
  itemCount = computed(() =>
    this.items()
      .filter((item: any) => item.productId)
      .reduce((acc: number, item: any) => acc + item.quantity, 0)
  );

  subtotal = computed(() => {
    return this.items()
      .filter((item: any) => item.productId)
      .reduce((acc: number, item: any) => {
        const price = this.calculateItemPrice(item.productId);
        return acc + price * item.quantity;
      }, 0);
  });

  constructor() {
    this.loadCart();
  }

  loadCart() {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch cart independently — a rates failure must NOT block cart display
    this.apiService
      .get<CartResponse>('/cart')
      .pipe(
        catchError((err) => {
          console.error('Error loading cart:', err);
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res && res.success) {
          this.cartState.set(res.data);
        }
      });

    // Fetch rates independently
    this.productService
      .getRates()
      .pipe(
        catchError((err) => {
          console.warn('Could not load rates (pricing will use product price field):', err);
          return of(null);
        })
      )
      .subscribe((res: any) => {
        if (res && res.success) {
          this.ratesState.set(res.data); // { gold24k, gold22k, silver }
        }
      });
  }

  /** Calculate item price from the rate object { gold24k, gold22k, silver } */
  public calculateItemPrice(p: any): number {
    if (!p) return 0;

    // If the product already has a fixed price, use it directly
    if (p.price) return p.price;

    const rates = this.rates();
    if (!rates) return 0;

    const material: string = (p.material || '').toLowerCase();
    let currentRate = 0;

    if (material.includes('24k')) {
      currentRate = Number(rates.gold24k) || 0;
    } else if (material.includes('22k') || material.includes('18k') || material.includes('rose gold') || material.includes('gold')) {
      currentRate = Number(rates.gold22k) || 0;
    } else if (material.includes('silver') || material.includes('platinum')) {
      currentRate = Number(rates.silver) || 0;
    }

    const weight = Number(p.weight) || 0;
    const making = Number(p.makingCharge) || 0;
    const wastage = Number(p.wastagePercent) || 0;

    const goldValue = weight * currentRate;
    const wastageValue = goldValue * (wastage / 100);

    return Math.round(goldValue + wastageValue + making);
  }

  addToCart(productId: string, quantity: number = 1) {
    return this.apiService
      .post<CartResponse>('/cart/add', { productId, quantity })
      .pipe(
        tap((res) => {
          if (res.success) {
            this.cartState.set(res.data);
          }
        })
      );
  }

  updateQuantity(productId: string, quantity: number) {
    return this.apiService
      .put<CartResponse>('/cart/update', { productId, quantity })
      .pipe(
        tap((res) => {
          if (res.success) {
            this.cartState.set(res.data);
          }
        })
      );
  }

  removeFromCart(productId: string) {
    return this.apiService
      .delete<CartResponse>(`/cart/${productId}`)
      .pipe(
        tap((res) => {
          if (res.success) {
            this.cartState.set(res.data);
          }
        })
      );
  }
}
