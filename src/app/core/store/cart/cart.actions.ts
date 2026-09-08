import { createAction, props } from '@ngrx/store';
import { CartItem, BullionRates } from '../../models/cart.model';

// Rates
export const loadRates = createAction('[Cart] Load Bullion Rates');
export const loadRatesSuccess = createAction(
  '[Cart] Load Bullion Rates Success',
  props<{ rates: BullionRates }>()
);
export const loadRatesFailure = createAction(
  '[Cart] Load Bullion Rates Failure',
  props<{ error: string }>()
);

// Load Cart
export const loadCart = createAction('[Cart] Load Cart');
export const loadCartSuccess = createAction(
  '[Cart] Load Cart Success',
  props<{ items: CartItem[] }>()
);
export const loadCartFailure = createAction(
  '[Cart] Load Cart Failure',
  props<{ error: string }>()
);

// Add to Cart
export const addToCart = createAction(
  '[Cart] Add To Cart',
  props<{ productId: string; quantity: number; productSnapshot?: any }>()
);
export const addToCartSuccess = createAction(
  '[Cart] Add To Cart Success',
  props<{ items: CartItem[] }>()
);
export const addToCartFailure = createAction(
  '[Cart] Add To Cart Failure',
  props<{ error: string }>()
);

// Update Quantity
export const updateCartQuantity = createAction(
  '[Cart] Update Cart Quantity',
  props<{ productId: string; quantity: number }>()
);
export const updateCartQuantitySuccess = createAction(
  '[Cart] Update Cart Quantity Success',
  props<{ items: CartItem[] }>()
);
export const updateCartQuantityFailure = createAction(
  '[Cart] Update Cart Quantity Failure',
  props<{ error: string }>()
);

// Remove From Cart
export const removeFromCart = createAction(
  '[Cart] Remove From Cart',
  props<{ productId: string }>()
);
export const removeFromCartSuccess = createAction(
  '[Cart] Remove From Cart Success',
  props<{ items: CartItem[] }>()
);
export const removeFromCartFailure = createAction(
  '[Cart] Remove From Cart Failure',
  props<{ error: string }>()
);

// Clear Cart
export const clearCart = createAction('[Cart] Clear Cart');
