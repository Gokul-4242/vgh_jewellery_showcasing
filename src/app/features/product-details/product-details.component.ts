import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


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
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchProductDetails(id);
      }
    });
  }

  fetchProductDetails(id: string) {
    this.isLoading = true;
    
    forkJoin({
      rateRes: this.productService.getRates().pipe(
        catchError(err => {
          console.error('Rates fetch failed, using defaults:', err);
          return of({ data: { gold24k: 0, gold22k: 0, silver: 0 } });
        })
      ),
      prodRes: this.productService.getProduct(id)
    }).subscribe({
      next: ({ rateRes, prodRes }) => {
        this.ngZone.run(() => {
          try {
            console.log('Product Details Response:', prodRes);
            console.log('Rates Response:', rateRes);

            const p = prodRes?.data || prodRes;
            let rates = rateRes?.data || rateRes;
            if (Array.isArray(rates)) rates = rates[0];

            if (!p) {
              throw new Error('Product data is missing from response');
            }

            console.log('Processing product:', p.name || p.id);

            const mat = (p.material || '').toLowerCase();
            let rate = rates?.gold24k || 0;
            if (mat.includes('22k')) rate = rates?.gold22k || 0;
            if (mat.includes('silver')) rate = rates?.silver || 0;

            const wastage = p.wastagePercent || 0;
            const making = p.makingCharge || 0;
            const stone = p.stoneCost || 0;
            const weight = p.weight || 0;
            
            const totalWeight = weight + (weight * (wastage / 100));
            const estimatedPrice = Math.round((totalWeight * rate) + making + stone);

            this.product = {
              name: p.name || 'Fine Jewellery Piece',
              collection: p.category || 'Exclusive Collection',
              price: estimatedPrice,
              originalPrice: Math.round(estimatedPrice * 1.15),
              images: Array.isArray(p.images) ? p.images.map((img: any) => {
                if (typeof img === 'string') return img;
                return img?.url || '';
              }).filter((url: string) => !!url) : [],
              specs: [
                { label: 'Material', value: p.material || 'Premium Alloy' },
                { label: 'Weight', value: `${weight} Grams` },
                { label: 'Making Charge', value: `₹${making}` },
                { label: 'Wastage', value: `${wastage}%` }
              ],
              sizes: p.sizes || ['Standard'],
              features: [
                { name: 'Live Estimate', detail: 'This price is dynamically updated from today\'s bullion rate.' },
                { name: 'Certified Purity', detail: 'All jewelry is authenticated.' }
              ]
            };

            if (this.product.images.length > 0) {
              this.selectedImage = this.product.images[0];
            }
            if (this.product.sizes.length > 0) {
              this.selectedSize = this.product.sizes[0];
            }
            
            console.log('Mapping complete, displaying UI. Product:', this.product.name);
            this.isLoading = false;
            this.cdr.detectChanges();
          } catch (err) {
            console.error('Critical mapping error:', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('API Fetch Error:', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  services: BrandService[] = [
    {
      icon: 'auto_awesome',
      title: 'BIS Hallmarked Gold',
      description: 'Certified purity with proper hallmarking for complete trust and transparency.'
    },
    {
      icon: 'local_shipping',
      title: 'Delivery Timeline',
      description: 'Customized jewellery orders are crafted with care and typically delivered within 10–15 days.'
    },
    {
      icon: 'workspace_premium',
      title: 'Design Your Own Jewellery',
      description: 'Share your idea and we’ll craft it exactly to your requirement.'
    }
  ];

  selectedImage: string = '';
  selectedSize: string = '';

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

  addToCart() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cartService.addToCart(id, 1).subscribe({
        next: () => {
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          console.error('Error adding to cart', err);
          if (err.status === 401) {
            this.router.navigate(['/auth']);
          }
        }
      });
    }
  }
}

