import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { FiltersComponent, FilterOption } from '../../shared/components/filters/filters.component';

interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
}

@Component({
  selector: 'app-gold-collection',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FiltersComponent],
  templateUrl: './gold-collection.component.html',
  styleUrl: './gold-collection.component.css'
})
export class GoldCollectionComponent {
  jewelryTypes: FilterOption[] = [
    { label: 'Necklaces', checked: false },
    { label: 'Rings', checked: true },
    { label: 'Bracelets', checked: false },
    { label: 'Earrings', checked: false }
  ];

  purityLevels: FilterOption[] = [
    { label: '24K Gold', active: true },
    { label: '22K Gold', active: false },
    { label: '18K Gold', active: false },
    { label: 'Rose Gold', active: false }
  ];

  products: Product[] = [
    {
      id: 'aura-gold-bangle-1',
      name: 'Artisan Curb Chain',
      price: 2450,
      weight: '18.5 Grams',
      category: '24K Yellow Gold',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8zfqQijXssC8Za5ega9bfswhbbMDLwTSvSUM52dV79eEpF5KzAAljEbfWaU76wuaTczHE6ridCL5Zn8_IY5r6MQ3CX3GlHh-TMNrHEihns-WZZEmgc7dwmmNie7DZck1Dj28JCY4rTdUriCR51qcmV8Pbpe83FJm-MgLAJySM8mF1fzFBBkZvGQiFgdDhbYpQ3pu1sUAA0Vjs8ZFO8_h4NyCspJZiU3_RGV87-PQP_ch4EBnxJn_JalP5khNvT4yYkJjYrlDOjm8C',
      imageAlt: 'High quality solid gold chain necklace'
    },
    {
      id: 'ethereal-band-set',
      name: 'Ethereal Band Set',
      price: 1890,
      weight: '12 Grams',
      category: '22K Handcrafted',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyJdOsAPra3CHQPpz3V8qCPGTu6zmjKg8cgjIXjQHu5l-Ml1FyT58RqYB92ixpQeGUc6GxFDBEiTDfumK1V9lmRAI1Tfl0f60IPhR9Nv_Wc1FfMbjGYTf_-0klj4D7llArymthqVS7UL3zh-tAeNHRjbyy5dacxQ5lnLiWANaNtrl5pa3ayCuQ8RXXW0obcgmGGCoMIhK79J5umdJamWvF-uNgAfHivRinQF9s2WQcMtSJ4JG6XdmBS6i5Eo5-nqOhh_3PrxxZE0e6',
      imageAlt: 'Intricate gold wedding ring set'
    },
    {
      id: 'royal-bangle',
      name: 'Royal Bangle',
      price: 4120,
      weight: '32 Grams',
      category: 'Solid 24K Gold',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPjFnqSI1APV9bvUu6NCqN0_xBvuDgmlLqFzOVfm8TrF59FV84cSt6W5xpgy_0US13G7OGcEfvwanUPYFWUDydqu4uJg6Z0QrflMn-km5jHZoEpSj0cndUtD4u7q7wlNk6Ux7gjCgyMw_Nbc5MFHOFyzQBiFyaONnLCWotqIlz2Ge6s8Rz9CeIZwAa-mvoo44vrvaZQSBtOdxj8pF6AQe3R81-nWPZmgn3x8gaHVjZgNEMPTjTIIkxrYL2kL9aSfn36D-Ay4GjMqCQ',
      imageAlt: 'Heavy luxury gold bracelet'
    },
    {
      id: 'emblem-pendant',
      name: 'Emblem Pendant',
      price: 1250,
      weight: '9 Grams',
      category: "Collector's Series",
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQNuc3UbkZ3Fy4cixl_McqSubFldOAsXhvtLZtCIYoMXFPCDD4BVBUSDqiolOowu4zEJ2_SNE0U_0INr0WJMv1xoYh3g2P4Fr1t6L7y9GDpNosHCpyaKUJ91vGWgCnCoPCeimrK_7bgz8l1-HP_VVsfqOLEtyBnX1Cm6ZySeuYTJvx4USRCgjIUNdwhPhgnHFBAMN8iGgcSZakJMHdzG-V15x8dzKN7-l765DQqPN8oKmfV_Ny9HaqjP4D3WUfWTo9higD53ObIivH',
      imageAlt: 'Gold pendant with intricate carvings'
    },
    {
      id: 'signature-ring',
      name: 'Horizon Signature Ring',
      price: 980,
      weight: '6 Grams',
      category: '18K Modern',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpl6GHumYOkrsI_0V1NQAnnlkekYlTWkqlB0K-gc44UAdfh7dzSTDWBTsKDzdIMtP2AoQbT9FKZSCa03GY8NzfpmlSwASPhd-oNrNI0_57T3ecJFFj5qCG8qg-Bt79CPsB915Mak22SjBTRfSuS6C2aWK4ctPbFh86MhzYsN7V0b40g3hDcEB0c1k6x5ov4HltqrB2mwmbOFkF2PxFP1tkVoEGbRGDSTXuFSF2loSFQODygX_9SarPGY8Ob2WrXP3um0aleHJ6Pwz9',
      imageAlt: 'Minimalist gold ring with matte finish'
    },
    {
      id: 'sun-drenched-earrings',
      name: 'Sun-Drenched Earrings',
      price: 3200,
      weight: '22 Grams',
      category: '24K Masterpiece',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBtxiFM7XIiAnQM9pxt6Li4vBST7LxfJ9i-Qr_3Sqc6gWzJFEyc7t4ABmyGq5X7goo9xX43YBXGgJGziHwEwy34I5GzXS4X8Vmr__p3ckd8DTi_P5dhZ6hnWE6XHRYDwPHti7jtRImuTaSoa_HijDYMxI3hQBl_aAXxg5pP-8cjVwhBlt_t9yhmuPrM7kBjoGcOeWsjb-GY6l6VDxQ1tMp9JcaGn7BylbB22C_8cJOg8JdGEqyg-OAEhAgMaz8_1unhNMP9PR2bVa6',
      imageAlt: 'Elegant gold drop earrings'
    }
  ];
}
