import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import * as CartActions from '../store/cart/cart.actions';
import {
  selectCartItems,
  selectCartItemsDetailed,
  selectCartItemCount,
  selectCartSubtotal,
  selectCartTax,
  selectCartTotal,
  selectCartRates,
  selectCartLoading,
  calculateUnitPrice
} from '../store/cart/cart.selectors';
import { CartItem, BullionRates, ProductSummary } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly store = inject(Store);

  // Expose signals from Store
  items = this.store.selectSignal(selectCartItems);
  detailedItems = this.store.selectSignal(selectCartItemsDetailed);
  itemCount = this.store.selectSignal(selectCartItemCount);
  subtotal = this.store.selectSignal(selectCartSubtotal);
  tax = this.store.selectSignal(selectCartTax);
  total = this.store.selectSignal(selectCartTotal);
  rates = this.store.selectSignal(selectCartRates);
  loading = this.store.selectSignal(selectCartLoading);

  constructor() {
    this.init();
  }

  init(): void {
    this.store.dispatch(CartActions.loadRates());
    this.store.dispatch(CartActions.loadCart());
  }

  loadCart(): void {
    this.store.dispatch(CartActions.loadCart());
  }

  calculateItemPrice(p: ProductSummary | any): number {
    return calculateUnitPrice(p, this.rates());
  }

  addToCart(productId: string, quantity: number = 1, productSnapshot?: any): Observable<boolean> {
    this.store.dispatch(CartActions.addToCart({ productId, quantity, productSnapshot }));
    return of(true);
  }

  updateQuantity(productId: string, quantity: number): Observable<boolean> {
    this.store.dispatch(CartActions.updateCartQuantity({ productId, quantity }));
    return of(true);
  }

  removeFromCart(productId: string): Observable<boolean> {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
    return of(true);
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }
}
