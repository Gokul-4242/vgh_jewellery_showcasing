import { createReducer, on } from '@ngrx/store';
import { CustomerDetails } from '../../models/invoice.model';
import * as CheckoutActions from './checkout.actions';
import { PaymentData } from './checkout.actions';

export interface CheckoutState {
  shippingInfo: CustomerDetails;
  paymentMethod: 'card' | 'upi' | 'banking';
  paymentData: PaymentData;
  placingOrder: boolean;
  currentOrder: any | null;
  error: string | null;
}

const SAVED_SHIPPING_KEY = 'vgh_shipping_info';
const LAST_ORDER_KEY = 'vgh_last_order';

function getInitialShipping(): CustomerDetails {
  try {
    const raw = localStorage.getItem(SAVED_SHIPPING_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  };
}

function getInitialLastOrder(): any | null {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export const initialCheckoutState: CheckoutState = {
  shippingInfo: getInitialShipping(),
  paymentMethod: 'card',
  paymentData: {
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  },
  placingOrder: false,
  currentOrder: getInitialLastOrder(),
  error: null
};

export const checkoutReducer = createReducer(
  initialCheckoutState,

  on(CheckoutActions.setShippingInfo, (state, { shipping }) => {
    try {
      localStorage.setItem(SAVED_SHIPPING_KEY, JSON.stringify(shipping));
    } catch (e) {}
    return {
      ...state,
      shippingInfo: shipping
    };
  }),

  on(CheckoutActions.setPaymentMethod, (state, { method }) => ({
    ...state,
    paymentMethod: method
  })),

  on(CheckoutActions.setPaymentData, (state, { paymentData }) => ({
    ...state,
    paymentData
  })),

  on(CheckoutActions.placeOrder, (state) => ({
    ...state,
    placingOrder: true,
    error: null
  })),

  on(CheckoutActions.placeOrderSuccess, (state, { order }) => {
    try {
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    } catch (e) {}
    return {
      ...state,
      placingOrder: false,
      currentOrder: order,
      error: null
    };
  }),

  on(CheckoutActions.placeOrderFailure, (state, { error }) => ({
    ...state,
    placingOrder: false,
    error
  })),

  on(CheckoutActions.resetCheckout, (state) => ({
    ...state,
    placingOrder: false,
    error: null
  }))
);
