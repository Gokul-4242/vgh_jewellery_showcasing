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

export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  category: string;
  material: string;
  weight?: number;
  makingCharge?: number;
  wastagePercent?: number;
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

  selectedImage: string = '';
  selectedSize: string = '';

  relatedProducts: RelatedProduct[] = [];
  similarSectionTitle: string = 'Similar Products';
  similarSectionSubtitle: string = 'More pieces from our inventory';
  viewMoreRoute: any[] = ['/gold-collection'];
  viewMoreLabel: string = 'Explore Collection';

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

  getCategoryFamily(name: string, category: string): 'earrings' | 'rings' | 'necklaces' | 'bangles' | 'general' {
    const combined = `${category || ''} ${name || ''}`.toLowerCase();
    
    if (['earring', 'earrings', 'jhumka', 'kammal', 'stud', 'studs', 'drops', 'danglers', 'bali', 'jimikki', 'thodu', 'hoop'].some(w => combined.includes(w))) {
      return 'earrings';
    }
    if (['ring', 'rings', 'solitaire', 'band', 'modhiram', 'metti'].some(w => combined.includes(w))) {
      return 'rings';
    }
    if (['necklace', 'necklaces', 'chain', 'chains', 'choker', 'chokers', 'haram', 'maalai', 'pendant', 'pendants', 'locket', 'aarom', 'nool'].some(w => combined.includes(w))) {
      return 'necklaces';
    }
    if (['bangle', 'bangles', 'bracelet', 'bracelets', 'kada', 'kadas', 'valayal', 'kaapu'].some(w => combined.includes(w))) {
      return 'bangles';
    }
    return 'general';
  }

  calculateEstimatedPrice(p: any, rates: any): number {
    if (p.price && p.price > 0 && (!p.weight || p.weight === 0)) {
      return p.price;
    }
    const mat = (p.material || '').toLowerCase();
    let rate = rates?.gold24k || 0;
    if (mat.includes('22k') || mat.includes('gold')) rate = rates?.gold22k || rates?.gold24k || 7000;
    if (mat.includes('silver')) rate = rates?.silver || 95;

    const wastage = p.wastagePercent || 0;
    const making = p.makingCharge || 0;
    const stone = p.stoneCost || 0;
    const weight = p.weight || 0;

    const totalWeight = weight + (weight * (wastage / 100));
    return Math.round((totalWeight * rate) + making + stone);
  }

  buildSimilarProducts(currentP: any, allDbProducts: any[], rates: any) {
    const currentId = currentP._id || currentP.id;
    if (!Array.isArray(allDbProducts) || allDbProducts.length === 0) {
      this.relatedProducts = [];
      return;
    }

    // Strictly from the inventory: filter out the current product itself
    const otherProducts = allDbProducts.filter((p: any) => (p._id || p.id) !== currentId);

    if (otherProducts.length === 0) {
      this.relatedProducts = [];
      return;
    }

    const pCategory = (currentP.category || '').toLowerCase().trim();
    const pMaterial = (currentP.material || '').toLowerCase().trim();
    const pFamily = this.getCategoryFamily(currentP.name || '', pCategory);

    // Score each inventory product based on category & material similarity
    const scored = otherProducts.map((item: any) => {
      let score = 0;
      const itemCategory = (item.category || '').toLowerCase().trim();
      const itemMaterial = (item.material || '').toLowerCase().trim();
      const itemFamily = this.getCategoryFamily(item.name || '', itemCategory);

      // Exact category match or family match gets top priority (e.g. other earrings)
      if (pCategory && itemCategory === pCategory) {
        score += 100;
      } else if (itemFamily === pFamily && pFamily !== 'general') {
        score += 80;
      }

      // Material match (e.g. 22K Gold with 22K Gold)
      const isBothGold = (pMaterial.includes('gold') || pMaterial.includes('22k')) && 
                         (itemMaterial.includes('gold') || itemMaterial.includes('22k'));
      const isBothSilver = pMaterial.includes('silver') && itemMaterial.includes('silver');

      if (isBothGold || isBothSilver) {
        score += 40;
      }

      return { item, score };
    });

    // Sort by highest similarity score first
    scored.sort((a, b) => b.score - a.score);

    // Take top 4 from the inventory
    this.relatedProducts = scored.slice(0, 4).map(({ item }) => {
      const itemImg = (item.images && item.images.length > 0)
        ? (typeof item.images[0] === 'string' ? item.images[0] : (item.images[0]?.url || ''))
        : '';

      return {
        id: item._id || item.id,
        name: item.name,
        price: this.calculateEstimatedPrice(item, rates),
        imageSrc: itemImg,
        category: item.category,
        material: item.material,
        weight: item.weight,
        makingCharge: item.makingCharge,
        wastagePercent: item.wastagePercent
      };
    });

    // Set heading based on whether exact category items were found
    const hasCategoryMatch = scored.some(s => s.score >= 80);
    if (hasCategoryMatch) {
      this.similarSectionTitle = `Similar Products in ${currentP.category || 'Collection'}`;
      this.similarSectionSubtitle = `Explore more ${currentP.category || 'pieces'} from our inventory`;
    } else {
      this.similarSectionTitle = 'Similar Products';
      this.similarSectionSubtitle = `Explore more handcrafted pieces from our inventory`;
    }

    const isSilver = pMaterial.includes('silver');
    this.viewMoreRoute = isSilver ? ['/silver-collection'] : ['/gold-collection'];
    this.viewMoreLabel = isSilver ? 'View Silver Collection' : 'View Gold Collection';
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
      prodRes: this.productService.getProduct(id),
      allProdsRes: this.productService.getProducts(1, 100).pipe(
        catchError(err => {
          console.error('Products list fetch failed:', err);
          return of({ data: [] });
        })
      )
    }).subscribe({
      next: ({ rateRes, prodRes, allProdsRes }) => {
        this.ngZone.run(() => {
          try {
            const p = prodRes?.data || prodRes;
            let rates = rateRes?.data || rateRes;
            if (Array.isArray(rates)) rates = rates[0];

            if (!p) {
              throw new Error('Product data is missing from response');
            }

            const estimatedPrice = this.calculateEstimatedPrice(p, rates);

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
                { label: 'Weight', value: `${p.weight || 0} Grams` },
                { label: 'Making Charge', value: `₹${p.makingCharge || 0}` },
                { label: 'Wastage', value: `${p.wastagePercent || 0}%` }
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

            const allProducts = allProdsRes?.data || allProdsRes || [];
            this.buildSimilarProducts(p, allProducts, rates);

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

  onSelectSimilarProduct(item: RelatedProduct) {
    this.router.navigate(['/product-details', item.id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToCart() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.product) {
      const weightVal = parseFloat(this.product.specs?.find(s => s.label === 'Weight')?.value || '0');
      const makingVal = parseFloat(this.product.specs?.find(s => s.label === 'Making Charge')?.value.replace('₹', '') || '0');
      const wastageVal = parseFloat(this.product.specs?.find(s => s.label === 'Wastage')?.value.replace('%', '') || '0');
      const matVal = this.product.specs?.find(s => s.label === 'Material')?.value || 'Gold';

      const snapshot = {
        _id: id,
        name: this.product.name,
        category: this.product.collection,
        price: this.product.price,
        images: [{ url: this.selectedImage || (this.product.images.length > 0 ? this.product.images[0] : '') }],
        weight: weightVal,
        material: matVal,
        makingCharge: makingVal,
        wastagePercent: wastageVal,
        description: 'VGH Certified Fine Jewellery'
      };

      this.cartService.addToCart(id, 1, snapshot).subscribe({
        next: () => {
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          console.error('Error adding to cart', err);
          this.router.navigate(['/cart']);
        }
      });
    }
  }
}
