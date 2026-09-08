import { createAction, props } from '@ngrx/store';
import { CustomerDetails } from '../../models/invoice.model';

export interface PaymentData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard?: boolean;
}

export const setShippingInfo = createAction(
  '[Checkout] Set Shipping Info',
  props<{ shipping: CustomerDetails }>()
);

export const setPaymentMethod = createAction(
  '[Checkout] Set Payment Method',
  props<{ method: 'card' | 'upi' | 'banking' }>()
);

export const setPaymentData = createAction(
  '[Checkout] Set Payment Data',
  props<{ paymentData: PaymentData }>()
);

export const placeOrder = createAction(
  '[Checkout] Place Order',
  props<{
    items: { productId: string; quantity: number }[];
    userId?: string;
    customer?: CustomerDetails;
    paymentMethod?: string;
  }>()
);

export const placeOrderSuccess = createAction(
  '[Checkout] Place Order Success',
  props<{ order: any }>()
);

export const placeOrderFailure = createAction(
  '[Checkout] Place Order Failure',
  props<{ error: string }>()
);

export const resetCheckout = createAction('[Checkout] Reset Checkout');
