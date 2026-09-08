import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { ProductService } from '../../services/product.service';
import * as CartActions from './cart.actions';
import { selectCartItems } from './cart.selectors';
import { CartItem, CartResponse } from '../../models/cart.model';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly apiService = inject(ApiService);
  private readonly productService = inject(ProductService);
  private readonly store = inject(Store);

  // Load Bullion Rates Effect
  loadRates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadRates),
      switchMap(() =>
        this.productService.getRates().pipe(
          map((res: any) => {
            let rates = res?.data || res;
            if (Array.isArray(rates)) rates = rates[0];
            return CartActions.loadRatesSuccess({ rates });
          }),
          catchError((err) =>
            of(CartActions.loadRatesFailure({ error: err.message || 'Failed to load rates' }))
          )
        )
      )
    )
  );

  // Load Cart Effect
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          // Guest mode: cart already hydrated in reducer from localStorage
          return of({ type: '[Cart] Guest Mode Active' });
        }
        return this.apiService.get<CartResponse>('/cart').pipe(
          map((res) => {
            if (res && res.success && res.data) {
              return CartActions.loadCartSuccess({ items: res.data.items || [] });
            }
            return CartActions.loadCartFailure({ error: 'Invalid cart response' });
          }),
          catchError((err) =>
            of(CartActions.loadCartFailure({ error: err.message || 'Failed to load cart' }))
          )
        );
      })
    )
  );

  // Add To Cart Effect
  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToCart),
      withLatestFrom(this.store.select(selectCartItems)),
      switchMap(([{ productId, quantity, productSnapshot }, currentItems]) => {
        const token = localStorage.getItem('token');
        if (token) {
          return this.apiService
            .post<CartResponse>('/cart/add', { productId, quantity })
            .pipe(
              map((res) => {
                if (res.success && res.data) {
                  return CartActions.addToCartSuccess({ items: res.data.items || [] });
                }
                return CartActions.addToCartFailure({ error: 'Add to cart failed' });
              }),
              catchError((err) =>
                of(CartActions.addToCartFailure({ error: err.message || 'Add to cart error' }))
              )
            );
        } else {
          // Guest Cart: handle locally
          const updated = [...currentItems];
          const index = updated.findIndex((i) => (i.productId?._id || i.productId) === productId);
          if (index > -1) {
            updated[index] = {
              ...updated[index],
              quantity: updated[index].quantity + quantity
            };
          } else {
            updated.push({
              productId: productSnapshot || { _id: productId, name: 'Jewellery Piece' },
              quantity
            });
          }
          return of(CartActions.addToCartSuccess({ items: updated }));
        }
      })
    )
  );

  // Update Cart Quantity Effect
  updateQuantity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartQuantity),
      withLatestFrom(this.store.select(selectCartItems)),
      switchMap(([{ productId, quantity }, currentItems]) => {
        const token = localStorage.getItem('token');
        if (token) {
          return this.apiService
            .put<CartResponse>('/cart/update', { productId, quantity })
            .pipe(
              map((res) => {
                if (res.success && res.data) {
                  return CartActions.updateCartQuantitySuccess({ items: res.data.items || [] });
                }
                return CartActions.updateCartQuantityFailure({ error: 'Update failed' });
              }),
              catchError((err) =>
                of(CartActions.updateCartQuantityFailure({ error: err.message || 'Update error' }))
              )
            );
        } else {
          // Guest Cart: update locally
          let updated = [...currentItems];
          if (quantity <= 0) {
            updated = updated.filter((i) => (i.productId?._id || i.productId) !== productId);
          } else {
            updated = updated.map((i) =>
              (i.productId?._id || i.productId) === productId ? { ...i, quantity } : i
            );
          }
          return of(CartActions.updateCartQuantitySuccess({ items: updated }));
        }
      })
    )
  );

  // Remove From Cart Effect
  removeFromCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeFromCart),
      withLatestFrom(this.store.select(selectCartItems)),
      switchMap(([{ productId }, currentItems]) => {
        const token = localStorage.getItem('token');
        if (token) {
          return this.apiService
            .delete<CartResponse>(`/cart/${productId}`)
            .pipe(
              map((res) => {
                if (res.success && res.data) {
                  return CartActions.removeFromCartSuccess({ items: res.data.items || [] });
                }
                return CartActions.removeFromCartFailure({ error: 'Remove failed' });
              }),
              catchError((err) =>
                of(CartActions.removeFromCartFailure({ error: err.message || 'Remove error' }))
              )
            );
        } else {
          // Guest Cart: remove locally
          const updated = currentItems.filter(
            (i) => (i.productId?._id || i.productId) !== productId
          );
          return of(CartActions.removeFromCartSuccess({ items: updated }));
        }
      })
    )
  );
}
