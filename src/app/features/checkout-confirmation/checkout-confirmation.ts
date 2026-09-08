import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CheckoutStepperComponent } from '../../shared/components/checkout-stepper/checkout-stepper';
import {
  selectCurrentOrder,
  selectConfirmedInvoiceData,
  selectShippingInfo
} from '../../core/store/checkout/checkout.selectors';

@Component({
  selector: 'app-checkout-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, CheckoutStepperComponent],
  templateUrl: './checkout-confirmation.html',
  styleUrl: './checkout-confirmation.css'
})
export class CheckoutConfirmationComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  currentOrder = this.store.selectSignal(selectCurrentOrder);
  confirmedInvoice = this.store.selectSignal(selectConfirmedInvoiceData);
  shippingInfo = this.store.selectSignal(selectShippingInfo);

  orderNumber = computed(() => {
    const order = this.currentOrder();
    if (order && order._id) {
      return `VGH-${order._id.substring(order._id.length - 8).toUpperCase()}`;
    }
    return 'VGH-88291';
  });

  deliveryEstimate = computed(() => {
    const now = new Date();
    const start = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
  });

  onViewBillPreview() {
    this.router.navigate(['/checkout/bill-preview']);
  }

  onTrackOrder() {
    alert(`Tracking active for Order #${this.orderNumber()}. A dispatch tracking link will be SMS'd once dispatched.`);
  }
}
