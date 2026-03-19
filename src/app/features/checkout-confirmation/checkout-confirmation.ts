import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CheckoutStepperComponent } from '../../shared/components/checkout-stepper/checkout-stepper';

@Component({
  selector: 'app-checkout-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, CheckoutStepperComponent],
  templateUrl: './checkout-confirmation.html',
  styleUrl: './checkout-confirmation.css'
})
export class CheckoutConfirmationComponent {
  private readonly router = inject(Router);

  orderNumber = signal('VGH-88291');
  deliveryEstimate = signal('Oct 24 - Oct 26');

  onTrackOrder() {
    console.log('Tracking order:', this.orderNumber());
    // In a real app, this would route to a tracking page
  }
}
