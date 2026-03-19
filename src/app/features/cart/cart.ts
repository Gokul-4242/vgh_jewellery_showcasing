import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

interface CartItem {
  id: string;
  name: string;
  collection: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  private readonly router = inject(Router);
  
  // Cart items managed as a signal
  cartItems = signal<CartItem[]>([
    {
      id: '1',
      name: 'Eternal Gold Band',
      collection: '18k Yellow Gold | Size 6',
      price: 1200,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-AEmMxj6LlefGzvL5GDvfJvRLU_Bzz5JuRjhLjdWDhVKMKaOEfvVaaQNU14_U7BUBzLVFpqGGR66F1_WFT-WjdGjRKyMea1PDOpjvxSnsj44rUR5Hm-OOBhmnmzdyp8ddAhxmkSY74CFknzWAEmd0hRzdzg754_onqpB_8HZC6uU5pGjgWRnteyfe7hS9_mhxO85PoAbFWuTzkihGmmwKm0YAuesjpB0vnvJ47046x3tk08GtNWE7HuababoBKWhCbwBe4OOsboXW',
      description: 'Hand-crafted 18k yellow gold band with a timeless polished finish.'
    },
    {
      id: '2',
      name: 'Solitaire Diamond Pendant',
      collection: 'White Gold | 1.5 Carat',
      price: 2500,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDtov-wKrDH33z_Xr4sCtr2XDAbfFoU8y0ecBWDWznTeoc_Wf9ThDGBao1k83gOt8bbEDQfswxxqsdd2QVukMsJgO6O5Rp8kV0dwYQhkGYexvgirquvPxzX4HjEJ9xZjVcyoXYIVRI6_OyzQVwMVuRDFXRlQX_qnECU8mldmF27CrMTs0pElG8Ij5iojJHZ61kfaT7mq3QFI_Y0dvVxCOl-q0gHYx5VciofJpB4S7tKioUFAVEGBK2TBHB16o7ISyq7PrJ_N8gOxb2',
      description: 'Exquisite 1.5 carat round-cut diamond set in 14k white gold.'
    },
    {
      id: '3',
      name: 'VGH Stud Earrings',
      collection: 'Rose Gold | Minimalist',
      price: 850,
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9faNWaysB03VjFKUKNRLlOx72yxmapuJi4khUX-GXUbrSIR0LG2B0big_W1p7ujHgd2ziC3hKouTaSH4gr89g6-bkTs-vTs7FDDyiYqbDyeuKyEtnDKkvhHRZtqoP2HiKu6yQSr2VqP2j6g6ocup7_dFlTTQTowwxW-KS2ppJ9WBsULn0ftHPSBBYni-8A59Iq5QYUfdpP4SQNOlcDQBp6woDk9z6NDfDcZuhZrRB1Tb7C-qsBUb5mYIQ85DGzhZ4vksfuNt54c4q',
      description: 'Elegant rose gold studs featuring a unique architectural design.'
    }
  ]);

  // Computed properties
  itemCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  subtotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0));
  shipping = computed(() => 0); // Complimentary shipping
  salesTax = computed(() => this.subtotal() * 0.085); // 8.5% tax
  total = computed(() => this.subtotal() + this.salesTax());

  updateQuantity(id: string, delta: number) {
    this.cartItems.update(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  }

  removeItem(id: string) {
    this.cartItems.update(items => items.filter(item => item.id !== id));
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout/shipping']);
  }
}
