import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutStepperComponent } from '../../shared/components/checkout-stepper/checkout-stepper';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckoutStepperComponent],
  templateUrl: './checkout-payment.html',
  styleUrl: './checkout-payment.css'
})
export class CheckoutPayment {
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);

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
    console.log('Sending Payment details:', this.paymentData);
    
    // In a real app, this array would be pulled from a global CartService state.
    // For MVP integration testing, we construct the shape the backend expects.
    const cartPayload = [
      { productId: 'REPLACE_WITH_REAL_MONGO_PRODUCT_ID', quantity: 1 }
    ];

    this.orderService.createOrder(cartPayload).subscribe({
      next: (response) => {
        console.log('Backend Successfully Processed Order! Invoice details:', response);
        // Backend atomic stock deducted, safe to route to confirmation!
        this.router.navigate(['/checkout/confirmation']);
      },
      error: (err) => {
        console.error('Transaction Failed:', err);
        alert('Order failed to process. Check console.');
      }
    });
  }
}
