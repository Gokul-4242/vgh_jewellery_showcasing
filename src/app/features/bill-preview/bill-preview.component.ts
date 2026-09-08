import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectInvoicePreviewData } from '../../core/store/cart/cart.selectors';
import { selectShippingInfo } from '../../core/store/checkout/checkout.selectors';
import { InvoiceData } from '../../core/models/invoice.model';

@Component({
  selector: 'app-bill-preview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bill-preview.component.html',
  styleUrl: './bill-preview.component.css'
})
export class BillPreviewComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  invoice = this.store.selectSignal(selectInvoicePreviewData);
  shipping = this.store.selectSignal(selectShippingInfo);

  isWindowBlurred = signal<boolean>(false);
  screenshotAlert = signal<string | null>(null);
  alertTimeout: any = null;

  // Settings matching jewellery_billing company branding
  storeSettings = {
    name: 'VGH Jewellers',
    tagline: 'Legacy of Pure Elegance & Craftsmanship',
    address: 'No. 42, Cathedral Road, T. Nagar, Chennai - 600017',
    contact: '+91 98765 43210 / 044-2828-9999',
    gstNo: '33AAAAA0000A1Z5',
    email: 'concierge@vghjewellers.com',
    website: 'www.vghjewellers.com'
  };

  @HostListener('window:blur')
  onWindowBlur() {
    this.isWindowBlurred.set(true);
  }

  @HostListener('window:focus')
  onWindowFocus() {
    this.isWindowBlurred.set(false);
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.hidden) {
      this.isWindowBlurred.set(true);
    } else {
      this.isWindowBlurred.set(false);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const isPrint = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p';
    const isSave = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
    const isDevTools = (event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'i';
    const isPrintScreen = event.key === 'PrintScreen';
    const isSnippingTool = (event.metaKey || event.ctrlKey) && event.shiftKey && (event.key.toLowerCase() === 's' || event.key === '4' || event.key === '3');

    if (isPrint || isSave || isDevTools || isPrintScreen || isSnippingTool) {
      event.preventDefault();
      event.stopPropagation();
      this.triggerSecurityAlert('Screenshots and digital captures are restricted on this bill preview for data confidentiality.');
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.triggerSecurityAlert('Right-click inspection is disabled on secure bill previews.');
  }

  triggerSecurityAlert(msg: string) {
    this.screenshotAlert.set(msg);
    if (this.alertTimeout) clearTimeout(this.alertTimeout);
    this.alertTimeout = setTimeout(() => {
      this.screenshotAlert.set(null);
    }, 4000);
  }

  proceedToShipping() {
    this.router.navigate(['/checkout/shipping']);
  }
}
