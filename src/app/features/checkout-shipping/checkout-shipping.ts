import { Component, inject, OnInit, signal, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CheckoutStepperComponent } from '../../shared/components/checkout-stepper/checkout-stepper';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { PincodeService, DeliveryInfo } from '../../core/services/pincode.service';
import * as CheckoutActions from '../../core/store/checkout/checkout.actions';
import { selectShippingInfo } from '../../core/store/checkout/checkout.selectors';
import { CustomerDetails } from '../../core/models/invoice.model';

@Component({
  selector: 'app-checkout-shipping',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CheckoutStepperComponent],
  templateUrl: './checkout-shipping.html',
  styleUrl: './checkout-shipping.css',
})
export class CheckoutShipping implements OnInit {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly pincodeService = inject(PincodeService);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('countryDropdownRef') countryDropdownRef!: ElementRef;
  isCountryDropdownOpen = false;
  countries = [
    'India',
    'United States',
    'United Kingdom',
    'United Arab Emirates',
    'Singapore'
  ];

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.isCountryDropdownOpen && this.countryDropdownRef && !this.countryDropdownRef.nativeElement.contains(event.target)) {
      this.isCountryDropdownOpen = false;
    }
  }

  toggleCountryDropdown() {
    this.isCountryDropdownOpen = !this.isCountryDropdownOpen;
  }

  selectCountry(country: string) {
    this.shippingData.country = country;
    this.isCountryDropdownOpen = false;
    this.cdr.markForCheck();
  }

  // Dynamic signals from Store
  cartItems = this.cartService.detailedItems;
  itemCount = this.cartService.itemCount;
  subtotal = this.cartService.subtotal;
  tax = this.cartService.tax;
  total = this.cartService.total;

  // PIN Code & Delivery signals
  pincodeLoading = signal<boolean>(false);
  pincodeVerified = signal<boolean>(false);
  pincodeMessage = signal<string>('');
  deliveryInfo = signal<DeliveryInfo | null>(null);

  shippingData: CustomerDetails = {
    name: '',
    email: '',
    phone: '',
    houseNo: '',
    address: '',
    city: '',
    district: '',
    state: '',
    postalCode: '',
    country: 'India'
  };

  ngOnInit() {
    this.cartService.init();
    const saved = this.store.selectSignal(selectShippingInfo)();
    if (saved && (saved.name || saved.postalCode || saved.address)) {
      this.shippingData = { ...this.shippingData, ...saved };
      if (this.shippingData.postalCode && this.shippingData.postalCode.length === 6) {
        this.lookupPincode(this.shippingData.postalCode);
      }
    } else {
      const user = this.authService.currentUser();
      if (user) {
        this.shippingData.name = user.name || '';
        this.shippingData.email = user.email || '';
        this.shippingData.phone = user.phone || '';
      }
    }
  }

  onPincodeChange(value: string) {
    const cleaned = (value || '').replace(/\D/g, '').slice(0, 6);
    this.shippingData.postalCode = cleaned;

    if (cleaned.length === 6) {
      this.lookupPincode(cleaned);
    } else {
      this.pincodeVerified.set(false);
      this.pincodeMessage.set('');
      this.deliveryInfo.set(null);
    }
  }

  onPincodeBlur() {
    const pin = (this.shippingData.postalCode || '').trim();
    if (pin.length === 6 && !this.pincodeVerified() && !this.pincodeLoading()) {
      this.lookupPincode(pin);
    }
  }

  lookupPincode(pin: string) {
    if (!pin || pin.length !== 6) return;

    this.pincodeLoading.set(true);
    this.pincodeMessage.set('');
    this.pincodeService.lookupPincode(pin).subscribe({
      next: (res) => {
        this.pincodeLoading.set(false);
        const isSuccess = Boolean(res && (res.success || res.valid || res.data?.valid) && res.data);
        if (isSuccess && res.data) {
          const d = res.data;
          const detectedDistrict = d.district || d.city || '';
          const detectedState = d.state || '';
          const detectedCountry = d.country || 'India';

          this.shippingData = {
            ...this.shippingData,
            district: detectedDistrict,
            state: detectedState,
            country: detectedCountry
          };

          this.deliveryInfo.set(d.delivery || null);
          this.pincodeVerified.set(true);
          this.pincodeMessage.set('');
          this.cdr.markForCheck();
        } else {
          this.pincodeVerified.set(false);
          this.pincodeMessage.set(res?.message || 'Invalid or unserviceable PIN code.');
          this.deliveryInfo.set(null);
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        this.pincodeLoading.set(false);
        this.pincodeVerified.set(false);
        this.pincodeMessage.set(err?.error?.message || 'Could not verify PIN code. You may proceed by filling details manually.');
        this.deliveryInfo.set(null);
        this.cdr.markForCheck();
      }
    });
  }

  onContinue() {
    if (!this.shippingData.name || !this.shippingData.email || !this.shippingData.address || !this.shippingData.city || !this.shippingData.district || !this.shippingData.postalCode) {
      alert('Please complete all required shipping information.');
      return;
    }

    this.store.dispatch(
      CheckoutActions.setShippingInfo({ shipping: this.shippingData })
    );

    this.router.navigate(['/checkout/payment']);
  }
}
