import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);

  // Connect to Store-driven signals
  cartItems = this.cartService.detailedItems;
  itemCount = this.cartService.itemCount;
  subtotal = this.cartService.subtotal;
  salesTax = this.cartService.tax;
  total = this.cartService.total;
  isLoading = this.cartService.loading;

  updateQuantity(productId: string, delta: number) {
    const item = this.cartItems().find((i: any) => i.id === productId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      this.cartService.updateQuantity(productId, newQuantity);
    }
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  proceedToBillPreview() {
    this.router.navigate(['/checkout/bill-preview']);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout/shipping']);
  }
}
