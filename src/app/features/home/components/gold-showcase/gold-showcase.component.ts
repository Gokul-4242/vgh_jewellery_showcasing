import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  category: string;
  imageSrc: string;
  altText: string;
}

@Component({
  selector: 'app-gold-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gold-showcase.component.html',
  styleUrl: './gold-showcase.component.css'
})
export class GoldShowcaseComponent {
  @Input() title: string = 'Featured Gold Artistry';
  @Input() subtitle: string = 'Exclusive Masterpieces from the VGH Vault';

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -350, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 350, behavior: 'smooth' });
  }

  products: Product[] = [
    {
      id: 'aura-gold-bangle-1',
      name: 'Artisan Curb Chain',
      price: 2450,
      weight: '18.5 Grams',
      category: '24K Yellow Gold',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8zfqQijXssC8Za5ega9bfswhbbMDLwTSvSUM52dV79eEpF5KzAAljEbfWaU76wuaTczHE6ridCL5Zn8_IY5r6MQ3CX3GlHh-TMNrHEihns-WZZEmgc7dwmmNie7DZck1Dj28JCY4rTdUriCR51qcmV8Pbpe83FJm-MgLAJySM8mF1fzFBBkZvGQiFgdDhbYpQ3pu1sUAA0Vjs8ZFO8_h4NyCspJZiU3_RGV87-PQP_ch4EBnxJn_JalP5khNvT4yYkJjYrlDOjm8C',
      altText: 'High quality solid gold chain necklace'
    },
    {
      id: 'ethereal-band-set',
      name: 'Ethereal Band Set',
      price: 1890,
      weight: '12 Grams',
      category: '22K Handcrafted',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyJdOsAPra3CHQPpz3V8qCPGTu6zmjKg8cgjIXjQHu5l-Ml1FyT58RqYB92ixpQeGUc6GxFDBEiTDfumK1V9lmRAI1Tfl0f60IPhR9Nv_Wc1FfMbjGYTf_-0klj4D7llArymthqVS7UL3zh-tAeNHRjbyy5dacxQ5lnLiWANaNtrl5pa3ayCuQ8RXXW0obcgmGGCoMIhK79J5umdJamWvF-uNgAfHivRinQF9s2WQcMtSJ4JG6XdmBS6i5Eo5-nqOhh_3PrxxZE0e6',
      altText: 'Intricate gold wedding ring set'
    },
    {
      id: 'royal-bangle',
      name: 'Royal Bangle',
      price: 4120,
      weight: '32 Grams',
      category: 'Solid 24K Gold',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPjFnqSI1APV9bvUu6NCqN0_xBvuDgmlLqFzOVfm8TrF59FV84cSt6W5xpgy_0US13G7OGcEfvwanUPYFWUDydqu4uJg6Z0QrflMn-km5jHZoEpSj0cndUtD4u7q7wlNk16Ux7gjCgyMw_Nbc5MFHOFyzQBiFyaONnLCWotqIlz2Ge6s8Rz9CeIZwAa-mvoo44vrvaZQSBtOdxj8pF6AQe3R81-nWPZmgn3x8gaHVjZgNEMPTjTIIkxrYL2kL9aSfn36D-Ay4GjMqCQ',
      altText: 'Heavy luxury gold bracelet'
    },
    {
      id: 'emblem-pendant',
      name: 'Emblem Pendant',
      price: 1250,
      weight: '9 Grams',
      category: "Collector's Series",
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQNuc3UbkZ3Fy4cixl_McqSubFldOAsXhvtLZtCIYoMXFPCDD4BVBUSDqiolOowu4zEJ2_SNE0U_0INr0WJMv1xoYh3g2P4Fr1t6L7y9GDpNosHCpyaKUJ91vGWgCnCoPCeimrK_7bgz8l1-HP_VVsfqOLEtyBnX1Cm6ZySeuYTJvx4USRCgjIUNdwhPhgnHFBAMN8iGgcSZakJMHdzG-V15x8dzKN7-l765DQqPN8oKmfV_Ny9HaqjP4D3WUfWTo9higD53ObIivH',
      altText: 'Gold pendant with intricate carvings'
    },
    {
      id: 'emblem-pendant',
      name: 'Emblem Pendant',
      price: 1250,
      weight: '9 Grams',
      category: "Collector's Series",
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQNuc3UbkZ3Fy4cixl_McqSubFldOAsXhvtLZtCIYoMXFPCDD4BVBUSDqiolOowu4zEJ2_SNE0U_0INr0WJMv1xoYh3g2P4Fr1t6L7y9GDpNosHCpyaKUJ91vGWgCnCoPCeimrK_7bgz8l1-HP_VVsfqOLEtyBnX1Cm6ZySeuYTJvx4USRCgjIUNdwhPhgnHFBAMN8iGgcSZakJMHdzG-V15x8dzKN7-l765DQqPN8oKmfV_Ny9HaqjP4D3WUfWTo9higD53ObIivH',
      altText: 'Gold pendant with intricate carvings'
    },
    {
      id: 'emblem-pendant',
      name: 'Emblem Pendant',
      price: 1250,
      weight: '9 Grams',
      category: "Collector's Series",
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQNuc3UbkZ3Fy4cixl_McqSubFldOAsXhvtLZtCIYoMXFPCDD4BVBUSDqiolOowu4zEJ2_SNE0U_0INr0WJMv1xoYh3g2P4Fr1t6L7y9GDpNosHCpyaKUJ91vGWgCnCoPCeimrK_7bgz8l1-HP_VVsfqOLEtyBnX1Cm6ZySeuYTJvx4USRCgjIUNdwhPhgnHFBAMN8iGgcSZakJMHdzG-V15x8dzKN7-l765DQqPN8oKmfV_Ny9HaqjP4D3WUfWTo9higD53ObIivH',
      altText: 'Gold pendant with intricate carvings'
    }
  ];
}
