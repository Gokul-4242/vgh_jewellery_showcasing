import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-stepper.html',
  styleUrl: './checkout-stepper.css'
})
export class CheckoutStepperComponent {
  private readonly router = inject(Router);

  @Input() currentStep: number = 1;

  get progressWidth(): string {
    if (this.currentStep <= 1) return '0%';
    if (this.currentStep === 2) return '50%';
    return '100%';
  }

  isClickable(step: number): boolean {
    if (step === this.currentStep) return false;
    if (step < this.currentStep) return true;
    if (step === 2 && this.currentStep === 1) {
      return !!localStorage.getItem('vgh_shipping_info');
    }
    return false;
  }

  goToStep(step: number) {
    if (!this.isClickable(step)) return;
    if (step === 1) {
      this.router.navigate(['/checkout/shipping']);
    } else if (step === 2) {
      this.router.navigate(['/checkout/payment']);
    } else if (step === 3) {
      this.router.navigate(['/checkout/confirmation']);
    }
  }
}
