import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CheckoutStepperComponent } from '../../shared/components/checkout-stepper/checkout-stepper';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import * as CheckoutActions from '../../core/store/checkout/checkout.actions';
import {
  selectPlacingOrder,
  selectCheckoutError,
  selectShippingInfo
} from '../../core/store/checkout/checkout.selectors';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CheckoutStepperComponent],
  templateUrl: './checkout-payment.html',
  styleUrl: './checkout-payment.css'
})
export class CheckoutPayment implements OnInit {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  ngOnInit() {
    this.cartService.init();
  }

  // Store signals
  cartItems = this.cartService.detailedItems;
  subtotal = this.cartService.subtotal;
  tax = this.cartService.tax;
  total = this.cartService.total;
  itemCount = this.cartService.itemCount;
  isPlacingOrder = this.store.selectSignal(selectPlacingOrder);
  checkoutError = this.store.selectSignal(selectCheckoutError);
  shippingInfo = this.store.selectSignal(selectShippingInfo);

  paymentMethod = signal<'card' | 'upi' | 'banking'>('card');

  paymentData = {
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  };

  setPaymentMethod(method: 'card' | 'upi' | 'banking') {
    this.paymentMethod.set(method);
    this.store.dispatch(CheckoutActions.setPaymentMethod({ method }));
  }

  onCompletePurchase() {
    const items = this.cartItems();
    if (!items || items.length === 0) {
      alert('Your cart is empty. Please add items to complete checkout.');
      this.router.navigate(['/']);
      return;
    }

    const cartPayload = items.map((i) => ({
      productId: i.id,
      quantity: i.quantity
    }));

    const user = this.authService.currentUser();
    const userId = user?._id || user?.id || '60d0fe4f5311236168a109ca';

    this.store.dispatch(
      CheckoutActions.setPaymentData({ paymentData: this.paymentData })
    );

    this.store.dispatch(
      CheckoutActions.placeOrder({
        items: cartPayload,
        userId,
        customer: this.shippingInfo() || undefined,
        paymentMethod: this.paymentMethod()
      })
    );
  }
}
