import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CheckoutStepperComponent } from '../../shared/components/checkout-stepper/checkout-stepper';

@Component({
  selector: 'app-checkout-shipping',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CheckoutStepperComponent],
  templateUrl: './checkout-shipping.html',
  styleUrl: './checkout-shipping.css',
})
export class CheckoutShipping {
  private readonly router = inject(Router);

  shippingData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States'
  };

  onContinue() {
    console.log('Continuing to payment with:', this.shippingData);
    this.router.navigate(['/checkout/payment']);
  }
}
