import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CheckoutState } from './checkout.reducer';
import { BillingItem, InvoiceData } from '../../models/invoice.model';

export const selectCheckoutState = createFeatureSelector<CheckoutState>('checkout');

export const selectShippingInfo = createSelector(
  selectCheckoutState,
  (state: CheckoutState) => state?.shippingInfo || null
);

export const selectPaymentMethod = createSelector(
  selectCheckoutState,
  (state: CheckoutState) => state?.paymentMethod || 'card'
);

export const selectPaymentData = createSelector(
  selectCheckoutState,
  (state: CheckoutState) => state?.paymentData || null
);

export const selectPlacingOrder = createSelector(
  selectCheckoutState,
  (state: CheckoutState) => state?.placingOrder || false
);

export const selectCurrentOrder = createSelector(
  selectCheckoutState,
  (state: CheckoutState) => state?.currentOrder || null
);

export const selectCheckoutError = createSelector(
  selectCheckoutState,
  (state: CheckoutState) => state?.error || null
);

export const selectConfirmedInvoiceData = createSelector(
  selectCurrentOrder,
  selectShippingInfo,
  (order, shipping): InvoiceData | null => {
    if (!order) return null;

    const items: BillingItem[] = (order.items || []).map((it: any, idx: number) => {
      const prod = it.productId || {};
      const unitPrice = it.priceSnapshot || prod.price || 0;
      const weight = prod.weight || 0;
      const making = prod.makingCharge || 0;
      const wastage = prod.wastagePercent || 0;

      return {
        id: prod._id || `item-${idx}`,
        productId: prod._id || '',
        name: prod.name || 'Fine Jewellery Piece',
        code: prod.sku || `SKU-${idx + 1}`,
        weight,
        purity: prod.material || 'Gold',
        rate: Math.round(unitPrice / (weight || 1)),
        makingCharges: making,
        wastage,
        discount: 0,
        total: unitPrice * it.quantity
      };
    });

    const subtotal = order.totalAmount || items.reduce((a, b) => a + b.total, 0);
    const gst = Math.round(subtotal * 0.03);
    const grandTotal = subtotal + gst;

    const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
    const dateFormatted = orderDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    return {
      invoiceNo: order._id ? `VGH-${order._id.substring(order._id.length - 8).toUpperCase()}` : 'VGH-88291',
      date: dateFormatted,
      customer: shipping || {
        name: 'Valued Customer',
        phone: 'N/A',
        address: 'Direct Online Order'
      },
      items,
      subtotal,
      gst,
      gstRate: 3,
      discount: 0,
      makingTotal: items.reduce((a, b) => a + b.makingCharges, 0),
      wastageTotal: 0,
      grandTotal,
      goldRate: 0,
      paymentMethod: (order.paymentDetails?.paymentId ? 'Card' : 'Card'),
      status: order.status === 'SUCCESS' ? 'Completed' : 'Pending'
    };
  }
);
