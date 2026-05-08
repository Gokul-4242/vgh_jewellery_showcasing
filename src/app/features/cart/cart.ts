import { Component, computed, inject } from '@angular/core';
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
  private readonly cartService = inject(CartService);
  
  // Connect to service signals
  items = this.cartService.items;
  itemCount = this.cartService.itemCount;
  subtotal = this.cartService.subtotal;
  
  // Map backend structure to template expectations
  cartItems = computed(() => {
    return this.items().map((item: any) => ({
      id: item.productId?._id,
      name: item.productId?.name,
      collection: `${item.productId?.category || ''} | ${item.productId?.material || ''}`,
      price: item.productId?.price || 1200, // Fallback price for demo
      quantity: item.quantity,
      image: item.productId?.images?.[0]?.url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop',
      description: item.productId?.description || 'Exquisite piece from VGH Jewellers collection.'
    }));
  });

  // Computed properties for summary
  shipping = computed(() => 0); 
  salesTax = computed(() => this.subtotal() * 0.085);
  total = computed(() => this.subtotal() + this.salesTax());

  updateQuantity(productId: string, delta: number) {
    const item = this.items().find((i: any) => i.productId?._id === productId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      this.cartService.updateQuantity(productId, newQuantity).subscribe();
    }
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId).subscribe();
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout/shipping']);
  }
}
