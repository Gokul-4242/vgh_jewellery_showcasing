import { createReducer, on } from '@ngrx/store';
import { CartItem, BullionRates } from '../../models/cart.model';
import * as CartActions from './cart.actions';

export interface CartState {
  items: CartItem[];
  rates: BullionRates | null;
  loading: boolean;
  error: string | null;
}

const LOCAL_STORAGE_KEY = 'vgh_cart_local';
const RATES_STORAGE_KEY = 'vgh_rates_cache';

function getInitialLocalItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function getInitialRates(): BullionRates | null {
  try {
    const raw = localStorage.getItem(RATES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveLocalItems(items: CartItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save cart to localStorage', e);
  }
}

export function saveRates(rates: BullionRates): void {
  try {
    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rates));
  } catch (e) {
    console.warn('Failed to save rates to localStorage', e);
  }
}

export const initialCartState: CartState = {
  items: getInitialLocalItems(),
  rates: getInitialRates(),
  loading: false,
  error: null
};

export const cartReducer = createReducer(
  initialCartState,

  // Bullion Rates
  on(CartActions.loadRates, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CartActions.loadRatesSuccess, (state, { rates }) => {
    saveRates(rates);
    return {
      ...state,
      rates,
      loading: false
    };
  }),
  on(CartActions.loadRatesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Cart
  on(CartActions.loadCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CartActions.loadCartSuccess, (state, { items }) => {
    saveLocalItems(items);
    return {
      ...state,
      items,
      loading: false
    };
  }),
  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Add To Cart
  on(CartActions.addToCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CartActions.addToCartSuccess, (state, { items }) => {
    saveLocalItems(items);
    return {
      ...state,
      items,
      loading: false
    };
  }),
  on(CartActions.addToCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Quantity
  on(CartActions.updateCartQuantity, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CartActions.updateCartQuantitySuccess, (state, { items }) => {
    saveLocalItems(items);
    return {
      ...state,
      items,
      loading: false
    };
  }),
  on(CartActions.updateCartQuantityFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Remove From Cart
  on(CartActions.removeFromCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CartActions.removeFromCartSuccess, (state, { items }) => {
    saveLocalItems(items);
    return {
      ...state,
      items,
      loading: false
    };
  }),
  on(CartActions.removeFromCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Clear Cart
  on(CartActions.clearCart, (state) => {
    saveLocalItems([]);
    return {
      ...state,
      items: [],
      loading: false,
      error: null
    };
  })
);
