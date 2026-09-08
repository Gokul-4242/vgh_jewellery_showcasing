import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { FiltersComponent, FilterOption } from '../../shared/components/filters/filters.component';
import { ProductService } from '../../core/services/product.service';

interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  category: string;
  material: string;
  imageSrc: string;
  imageAlt: string;
  inStock: boolean;
}

@Component({
  selector: 'app-silver-collection',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FiltersComponent],
  templateUrl: './silver-collection.component.html',
  styleUrl: './silver-collection.component.css'
})
export class SilverCollectionComponent implements OnInit {
  // No pre-applied filters by default
  jewelryTypes: FilterOption[] = [
    { label: 'Earrings', checked: false },
    { label: 'Necklaces', checked: false },
    { label: 'Rings', checked: false },
    { label: 'Bracelets', checked: false }
  ];

  purityLevels: FilterOption[] = [
    { label: '925 Sterling', active: false },
    { label: 'Fine Silver', active: false },
    { label: 'Oxidized', active: false }
  ];

  products: Product[] = [];
  liveRates: any = { silver: 0 };
  isLoading = true;
  selectedMinPrice: number = 0;
  selectedMaxPrice: number = 50000;
  isPriceFilterActive: boolean = false;

  constructor(
    private productService: ProductService, 
    private ngZone: NgZone, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Fetch Rates independently
    this.productService.getRates().subscribe({
      next: (rateRes: any) => {
        let parsedRes = rateRes;
        if (typeof rateRes === 'string') {
          try { parsedRes = JSON.parse(rateRes); } catch(e) {}
        }
        
        let rates = parsedRes?.data || parsedRes;
        if (Array.isArray(rates)) rates = rates[0];

        this.ngZone.run(() => {
          if (rates && typeof rates === 'object') {
            this.liveRates = { ...this.liveRates, ...rates };
            this.recalculatePrices();
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => console.error('Failed to fetch rates:', err)
    });

    // Fetch Products independently with 'silver' filter
    this.productService.getProducts(1, 100, 'silver').subscribe({
      next: (prodRes) => {
        const backendProducts = (prodRes as any).data;
        this.ngZone.run(() => {
          if (backendProducts && Array.isArray(backendProducts)) {
            this.products = backendProducts
              .filter((p: any) => p.material.toLowerCase().includes('silver'))
              .map((p: any) => this.mapToProduct(p));
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
        this.ngZone.run(() => { 
          this.isLoading = false; 
          this.cdr.detectChanges();
        });
      }
    });
  }

  private mapToProduct(p: any): Product {
    const rate = this.liveRates?.silver || 95;
    const totalWeight = (p.weight || 0) + ((p.weight || 0) * ((p.wastagePercent || 0) / 100));
    const estimatedPrice = p.price && p.price > 0 && (!p.weight || p.weight === 0)
      ? p.price
      : Math.round((totalWeight * rate) + (p.makingCharge || 0) + (p.stoneCost || 0));

    let imgUrl = 'https://placehold.co/400';
    if (Array.isArray(p.images) && p.images.length > 0) {
      const first = p.images[0];
      imgUrl = typeof first === 'string' ? first : (first?.url || imgUrl);
    }

    return {
      id: p._id,
      name: p.name,
      price: estimatedPrice,
      weight: `${p.weight || 0} Grams`,
      category: p.category || 'Silver Jewellery',
      material: p.material || '925 Silver',
      imageSrc: imgUrl,
      imageAlt: p.name,
      inStock: p.stock > 0
    };
  }

  private recalculatePrices() {
    if (this.products.length === 0) return;
    this.products = this.products.map(p => {
      const rate = this.liveRates?.silver || 95;
      const weightNum = parseFloat(p.weight) || 0;
      if (weightNum > 0) {
        const estimatedPrice = Math.round(weightNum * 1.05 * rate);
        return { ...p, price: estimatedPrice };
      }
      return p;
    });
  }

  isFiltersVisible = false;

  get filteredProducts(): Product[] {
    const activeTypes = this.jewelryTypes.filter(t => t.checked).map(t => t.label.toLowerCase());
    const activePurities = this.purityLevels.filter(p => p.active).map(p => p.label.toLowerCase());

    return this.products.filter(product => {
      // Price Filter Check - only if customer actively customized price filter
      if (this.isPriceFilterActive) {
        if (product.price < this.selectedMinPrice || product.price > this.selectedMaxPrice) {
          return false;
        }
      }

      const name = (product.name || '').toLowerCase();
      const cat = (product.category || '').toLowerCase();
      const combined = `${name} ${cat}`;
      
      let typeMatch = true;
      if (activeTypes.length > 0) {
        typeMatch = activeTypes.some(t => {
          if (t === 'necklaces') return combined.includes('chain') || combined.includes('pendant') || combined.includes('necklace') || combined.includes('choker') || combined.includes('nool');
          if (t === 'rings') return combined.includes('ring') || combined.includes('band') || combined.includes('metti');
          if (t === 'bracelets') return combined.includes('bracelet') || combined.includes('bangle') || combined.includes('cuff') || combined.includes('anklet') || combined.includes('kolusu');
          if (t === 'earrings') return combined.includes('earring') || combined.includes('stud') || combined.includes('hoop') || combined.includes('kammal') || combined.includes('jhumka');
          return false;
        });
      }

      let purityMatch = true;
      if (activePurities.length > 0) {
        purityMatch = activePurities.some(p => {
          const mat = (product.material || '').toLowerCase();
          if (p.includes('925') || p.includes('sterling')) return mat.includes('925') || mat.includes('sterling');
          if (p.includes('fine')) return mat.includes('fine') || mat.includes('999');
          if (p.includes('oxidized')) return mat.includes('oxidized');
          return mat.includes('silver');
        });
      }

      return typeMatch && purityMatch;
    });
  }

  onFilterChange(event: { types: FilterOption[], purities: FilterOption[], minPrice?: number, maxPrice?: number, isReset?: boolean }) {
    this.jewelryTypes = event.types;
    this.purityLevels = event.purities;
    if (event.minPrice !== undefined) this.selectedMinPrice = event.minPrice;
    if (event.maxPrice !== undefined) this.selectedMaxPrice = event.maxPrice;

    if (event.isReset) {
      this.isPriceFilterActive = false;
    } else {
      this.isPriceFilterActive = (this.selectedMinPrice > 0 || (this.selectedMaxPrice !== undefined && this.selectedMaxPrice < 50000));
    }
  }

  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  scrollToProducts() {
    document.getElementById('silver-products')?.scrollIntoView({ behavior: 'smooth' });
  }
}
