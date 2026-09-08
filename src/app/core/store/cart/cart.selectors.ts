import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';
import { BullionRates, CartItem, ProductSummary } from '../../models/cart.model';
import { BillingItem, InvoiceData } from '../../models/invoice.model';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state?.items || []
);

export const selectCartRates = createSelector(
  selectCartState,
  (state: CartState) => state?.rates || null
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state: CartState) => state?.loading || false
);

export const selectCartError = createSelector(
  selectCartState,
  (state: CartState) => state?.error || null
);

/** Helper to calculate unit price based on live rates & product specs */
export function calculateUnitPrice(p: ProductSummary | undefined, rates: BullionRates | null): number {
  if (!p) return 0;
  if (p.price && p.price > 0 && !p.weight) {
    return p.price;
  }

  const mat = (p.material || '').toLowerCase();
  let rate = 0;
  if (rates) {
    if (mat.includes('24k')) rate = Number(rates.gold24k) || 0;
    else if (mat.includes('22k') || mat.includes('gold')) rate = Number(rates.gold22k) || 0;
    else if (mat.includes('silver')) rate = Number(rates.silver) || 0;
  }

  const weight = Number(p.weight) || 0;
  const wastagePercent = Number(p.wastagePercent) || 0;
  const making = Number(p.makingCharge) || 0;
  const stone = Number(p.stoneCost) || 0;

  if (rate > 0 && weight > 0) {
    const totalWeight = weight + weight * (wastagePercent / 100);
    return Math.round(totalWeight * rate + making + stone);
  }

  return p.price || 0;
}

export const selectCartItemCount = createSelector(
  selectCartItems,
  (items) => items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0)
);

export const selectCartItemsDetailed = createSelector(
  selectCartItems,
  selectCartRates,
  (items, rates) => {
    if (!items || !Array.isArray(items)) return [];
    return items
      .filter((item) => item && (item.productId || (item as any).id))
      .map((item) => {
        const p: any = typeof item.productId === 'object' && item.productId !== null
          ? item.productId
          : (typeof item === 'object' ? item : {});

        const unitPrice = calculateUnitPrice(p, rates);
        
        let imageUrl = 'https://ik.imagekit.io/vghxvenkat/vgh_products/image__1__7JO0-QONk.png';
        if (p?.images && Array.isArray(p.images) && p.images.length > 0) {
          imageUrl = typeof p.images[0] === 'string' ? p.images[0] : (p.images[0]?.url || imageUrl);
        } else if (p?.image) {
          imageUrl = p.image;
        }

        const qty = Number(item.quantity) || 1;

        return {
          id: p?._id || p?.id || (item as any)._id || '',
          name: p?.name || 'VGH Jewellery Piece',
          sku: p?.sku || 'VGH-01',
          category: p?.category || 'Fine Jewellery',
          collection: `${p?.category || 'Fine Jewellery'} | ${p?.material || 'Gold'}`,
          material: p?.material || 'Gold',
          weight: Number(p?.weight) || 0,
          makingCharge: Number(p?.makingCharge) || 0,
          wastagePercent: Number(p?.wastagePercent) || 0,
          stoneCost: Number(p?.stoneCost) || 0,
          price: unitPrice,
          quantity: qty,
          total: unitPrice * qty,
          image: imageUrl,
          description: p?.description || 'Authentic handcrafted fine jewelry certified by VGH Jewellers.'
        };
      });
  }
);

export const selectCartSubtotal = createSelector(
  selectCartItemsDetailed,
  (detailedItems) => detailedItems.reduce((acc, item) => acc + item.total, 0)
);

// Complimentary luxury delivery
export const selectCartShipping = createSelector(
  selectCartSubtotal,
  () => 0
);

// Estimated Tax (8.5%)
export const selectCartTax = createSelector(
  selectCartSubtotal,
  (subtotal) => Math.round(subtotal * 0.085 * 100) / 100
);

export const selectCartTotal = createSelector(
  selectCartSubtotal,
  selectCartShipping,
  selectCartTax,
  (subtotal, shipping, tax) => Math.round((subtotal + shipping + tax) * 100) / 100
);

/** Generates InvoiceData structure matching jewellery_billing for Bill Copy Preview */
export const selectInvoicePreviewData = createSelector(
  selectCartItemsDetailed,
  selectCartRates,
  selectCartSubtotal,
  selectCartTax,
  selectCartTotal,
  (items, rates, subtotal, gst, grandTotal): InvoiceData => {
    let makingTotal = 0;
    let wastageTotal = 0;
    const goldRate = rates?.gold22k || rates?.gold24k || 0;
    const silverRate = rates?.silver || 0;

    const billingItems: BillingItem[] = items.map((item) => {
      const mat = item.material.toLowerCase();
      const currentRate = mat.includes('silver') ? silverRate : goldRate;
      const wastageValue = (item.weight * (item.wastagePercent || 0) / 100) * currentRate;
      const makingValue = item.makingCharge * item.quantity;
      
      makingTotal += makingValue;
      wastageTotal += wastageValue * item.quantity;

      return {
        id: item.id,
        productId: item.id,
        name: item.name,
        code: item.sku,
        weight: item.weight,
        purity: item.material,
        rate: currentRate,
        makingCharges: item.makingCharge,
        wastage: item.wastagePercent,
        stoneCost: item.stoneCost,
        discount: 0,
        total: item.total
      };
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    return {
      invoiceNo: `VGH-PREV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      date: dateStr,
      customer: {
        name: 'Guest Customer',
        phone: 'N/A',
        address: 'Direct Online Store Purchase'
      },
      items: billingItems,
      subtotal,
      gst,
      gstRate: 3,
      discount: 0,
      makingTotal,
      wastageTotal: Math.round(wastageTotal),
      grandTotal,
      goldRate,
      silverRate,
      paymentMethod: 'Card',
      status: 'Pending'
    };
  }
);
