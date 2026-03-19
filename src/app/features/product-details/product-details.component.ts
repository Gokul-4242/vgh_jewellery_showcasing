import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProductSpec {
  label: string;
  value: string;
}

interface ProductFeature {
  name: string;
  detail: string;
}

interface Product {
  name: string;
  collection: string;
  price: number;
  originalPrice?: number;
  images: string[];
  specs: ProductSpec[];
  sizes: string[];
  features: ProductFeature[];
}

interface BrandService {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  product: Product = {
    name: 'VGH Jewellers Bangle',
    collection: 'Heritage Collection',
    price: 4250,
    originalPrice: 5100,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsSouJb4ZF1ndb42xqE6Q-GmkUymadtMqCVcBAb3UxxAeDIaA3QeDGUURRGSu9RNcVu5X0sMP-dZwrXH0GO7WFAjjNscaNr7WAV4NiYJoFPOzwmBK0O4XOl-9qdmTnb7_tUaleN7WbzARt8jmm8wrJwdfLUNmpBegHDgDuiPKBn23tJiXQa-NaKG0EX_Y5WxDeNdSIIRcf_C3CKb5zusZV1Radc-xCAHRK4rMuWnIHQMACcEclmFBHsRMe1dt4Vca4mmwv2XhH2PjR',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWrtI0nAdp6AFxgZLoC8f4jGLu-B2lgS3hUqWPj3-Efr9mvgLmPg3bnyKWGvrXvU5K3ZF7yB9eHQFZm9rcbVsRs1ISf7Z890ZTZ4gKVuyo27WLKz47ffp5E84givRGNWh-Vi5OnOl896ya45mcvP3iHxnH1lFK3_R9E9qFhmEcaWV8bk-qtKyvKkmv0L3qKpwIoJSMKgNP2VN-qv52cZMTE7E071OOVmgMvK_HupZbcUWtOCvnQWQclxPdyVDRoSJ_RgAwIwsQ6z5d',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4NJ-njiyqCQB_pFGHmgaP6EIjKW8orJdizQzibOLvMvb40bRrmsjsvEhgj1MsWlJUcYVUmW0xrIFw16atfb-AUS2SlV5JNRbzD_o_WYGrti2Df-U1bEtywDWY-lr2FKet8cIi94m4Wlf-EfeCxIkXIUMXvsMAYFt1BbQDPAoObhgHd4ACxjvNLzO5lFf2Q7DSazmJMlwBRnN4Q8-sfHuoT2b4_9ef4Hwd2xe3ntSHEI2dim_WDsHLta_78yVEtsOwrHI9dXHDVIS0',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATgmTSOTE73RR-pNQZKqkRJifVz9k2IA9zPPs7dtZM5sSyFciUal2_WSQEQY3c8535l_m1_OqU6q15NxH_mv6lQUxG9F3NOUfw_jnAl-KMFOpFz0Hfp5uvhUXFDuJ5i8UIM0LP-xSOkl5U0FOl3v9GPPG3bTVRpe2tjzLg-hjXbGbAClVBcZDC-gJVM2uDXq7Os0noHEloMWbIou98Q-7Y6lCMVswFfg8MNwAXNugNKwFwDtqQy-xVvKOXw_wTV_F2bcZEOcmGNZwE'
    ],
    specs: [
      { label: 'Metal', value: '22K Solid Gold' },
      { label: 'Weight', value: '42.5 Grams' },
      { label: 'Purity', value: '91.6% Pure Gold' },
      { label: 'Diameter', value: '2.4" (Standard)' }
    ],
    sizes: ['2.4', '2.6', '2.8'],
    features: [
      { name: 'Sustainable Sourcing', detail: 'Ethically mined 22K pure gold' },
      { name: 'Artisan Polishing', detail: 'Hand-finished mirror luster' },
      { name: 'Serial Certification', detail: 'Unique limited edition serials' }
    ]
  };

  services: BrandService[] = [
    {
      icon: 'auto_awesome',
      title: 'Jewelry Care',
      description: 'To maintain brilliance, avoid contact with harsh chemicals. Clean gently with a soft microfiber cloth.'
    },
    {
      icon: 'local_shipping',
      title: 'White Glove Delivery',
      description: 'Complimentary insured express shipping on all orders over $2,000. Each package is discreetly wrapped.'
    },
    {
      icon: 'workspace_premium',
      title: 'Lifetime Warranty',
      description: 'Our pieces are designed for eternity. We provide a lifetime warranty covering any manufacturing defects.'
    }
  ];

  selectedImage: string = this.product.images[0];
  selectedSize: string = this.product.sizes[0];

  relatedProducts = [
    {
      name: '22K Diamond Pendant',
      price: 1200,
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP90dfuLQ70RoiTBfm7jqhGQyeIhYegp90hMe3um9PtdE5gNrNQrv5h2yWnJ6yAQK3bAV8oi_eSHygi_l9FBG_gx27wYvNDuh62QMCIolZerSER_NLWlofZHpcnhmmykvOf5CKZWgg40wVxAH98v0jWNI-NYmTn7aXyejuinmDIYSR-VopYk8Q0LyI8tLhe3qridxh1UlTTKV1mZn2RgLi5vMkPLw_rHow8w5JTWy0xNxWmjGFbK-i9u1QKvtvGhqgd5rOMNi-ZpbZ'
    },
    {
      name: '22K Diamond Solitaire Ring',
      price: 1850,
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxy_hiHnodhI2OnGsvrcBZ-i-RDvh7J_a1gtAVbVpKlRjhMJe8xCGWkMQGD_L5Z7oYd1lrKrQ2zCCwg_vi49y4CLYdo16zMgat1lNchLlyPyXeoNUCaNUJ7QMgKoLuy18dOHEZT6bBJlVslAcyCdm2XDsOHAsfEPld6uDhL9dqyT1myMfUUEW3936Iv_Wki-u9E25glENvX2r7_1-K-qgWFWDVTlvtP4x1SJEzVZiggzExOg0nZcbwm1NAkGfqH1dXSGP3aSPG0YOh'
    },
    {
      name: 'Classic Jhumka Earrings',
      price: 3100,
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH9Uf-zI_gCh_kRxUArZt5G77i1f_x5da3gKuB6anfcX-UmPImuWXgwuBGRiW2V7Kv27StY9BsM2LzgTxqEFvC0nKsEV7NNnW3rx_3OmRBHsFk540wL6JmE6iE0Zebu_NbAQMeQ-m66yEeU0nw3UU0PQnlEes6hHs2mn5VhEt86uTfQdgOEu2dItErd5_d_95lTTki75QNpaZiOa73K4fensqvNHHlo8x3OOVwKsgI-cuv17N4CoH48_kL86etEm2xFFtfBAkMvZqq'
    },
    {
      name: 'Heritage Gold Choker',
      price: 5400,
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIGHEwLD1BSjiiWkqxHh2_0R9hdwRxgpNeAkjon5fsRs_Ft-smdZHQ9hTR8CXsZg9AinIE8YcUS6YqNtdc1-DXPJVHMDI2dYZ0ii5kGXdcbiOVPN_pLtQQgEJsovxcnJe0n3F_oE8W-_m5ZmzX1UdG4CIA7tMmPENafQKGHYhrP0JoTTg6MObIM_M8mlPoG1-Plgn-Ph1bBnuT-ZK8XvwhpWIf38Fp3ip7R_oeuuBcMu1faRHVLMhaEVZ4a7qnSKIluPNz2poMpbIM'
    }
  ];
}
