import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';

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
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
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
    this.productService.getRates().subscribe(rateRes => {
      const rates = rateRes.data;

      this.productService.getProduct(id).subscribe(prodRes => {
        const p = prodRes.data;
        
        let rate = rates.gold24k;
        if (p.material === 'gold22k') rate = rates.gold22k;
        if (p.material === 'silver') rate = rates.silver;

        // Dynamic price calculation
        const TotalWeight = p.weight + (p.weight * (p.wastagePercent / 100));
        const estimatedPrice = Math.round((TotalWeight * rate) + p.makingCharge + (p.stoneCost || 0));

        this.product = {
          name: p.name,
          collection: p.category,
          price: estimatedPrice,
          originalPrice: Math.round(estimatedPrice * 1.15), // Aesthetic markdown presentation
          images: p.images.map((img: any) => img.url),
          specs: [
            { label: 'Material', value: p.material },
            { label: 'Weight', value: `${p.weight} Grams` },
            { label: 'Making Charge', value: `₹${p.makingCharge}` },
            { label: 'Wastage', value: `${p.wastagePercent}%` }
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
        
        this.isLoading = false;
      });
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
}
