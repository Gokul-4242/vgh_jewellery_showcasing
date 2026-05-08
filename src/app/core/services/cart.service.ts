import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

export interface CartItem {
  productId: {
    _id: string;
    name: string;
    price?: number;
    images?: { url: string }[];
    category?: string;
    material?: string;
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
  
  // Internal state using signals
  private cartState = signal<any>(null);

  // Expose signals for components
  cart = computed(() => this.cartState());
  items = computed(() => this.cartState()?.items || []);
  
  // Totals
  itemCount = computed(() => this.items().reduce((acc: number, item: any) => acc + item.quantity, 0));
  
  subtotal = computed(() => {
    return this.items().reduce((acc: number, item: any) => {
      // Note: Product price might be calculated or fixed. 
      // Using a default if not present for now.
      const price = item.productId?.price || 0; 
      return acc + (price * item.quantity);
    }, 0);
  });

  constructor() {
    this.loadCart();
  }

  loadCart() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.apiService.get<CartResponse>('/cart').subscribe({
      next: (res) => this.cartState.set(res.data),
      error: (err) => console.error('Error loading cart', err)
    });
  }

  addToCart(productId: string, quantity: number = 1) {
    return this.apiService.post<CartResponse>('/cart/add', { productId, quantity }).pipe(
      tap(res => {
        if (res.success) {
          this.cartState.set(res.data);
        }
      })
    );
  }

  updateQuantity(productId: string, quantity: number) {
    return this.apiService.put<CartResponse>('/cart/update', { productId, quantity }).pipe(
      tap(res => {
        if (res.success) {
          this.cartState.set(res.data);
        }
      })
    );
  }

  removeFromCart(productId: string) {

    return this.apiService.delete<CartResponse>(`/cart/${productId}`).pipe(
      tap(res => {
        if (res.success) {
          this.cartState.set(res.data);
        }
      })
    );
  }
}
