import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutStepperComponent } from '../../shared/components/checkout-stepper/checkout-stepper';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckoutStepperComponent],
  templateUrl: './checkout-payment.html',
  styleUrl: './checkout-payment.css'
})
export class CheckoutPayment {
  private readonly router = inject(Router);

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
  }

  onCompletePurchase() {
    console.log('Completing purchase with:', {
      method: this.paymentMethod(),
      data: this.paymentData
    });
    this.router.navigate(['/checkout/confirmation']);
  }
}
