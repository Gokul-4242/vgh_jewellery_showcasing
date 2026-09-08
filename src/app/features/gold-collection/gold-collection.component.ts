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
  selector: 'app-gold-collection',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FiltersComponent],
  templateUrl: './gold-collection.component.html',
  styleUrl: './gold-collection.component.css'
})
export class GoldCollectionComponent implements OnInit {
  // No pre-applied filters by default: customer selects as needed
  jewelryTypes: FilterOption[] = [
    { label: 'Necklaces', checked: false },
    { label: 'Rings', checked: false },
    { label: 'Bracelets', checked: false },
    { label: 'Earrings', checked: false }
  ];

  purityLevels: FilterOption[] = [
    { label: '24K Gold', active: false },
    { label: '22K Gold', active: false },
    { label: '18K Gold', active: false }
  ];

  products: Product[] = [];
  liveRates: any = { gold24k: 0, gold22k: 0 };
  isLoading = true;
  selectedMinPrice: number = 0;
  selectedMaxPrice: number = 500000;
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

    // Fetch Products independently with 'gold' filter
    this.productService.getProducts(1, 100, 'gold').subscribe({
      next: (prodRes) => {
        const backendProducts = (prodRes as any).data;
        this.ngZone.run(() => {
          if (backendProducts && Array.isArray(backendProducts)) {
            this.products = backendProducts
              .filter((p: any) => {
                const mat = (p.material || '').toLowerCase();
                return mat.includes('gold') || mat.includes('22k') || mat.includes('24k') || mat.includes('18k') || !mat.includes('silver');
              })
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
    const mat = (p.material || '').toLowerCase();
    let rate = this.liveRates?.gold24k || 7500;
    if (mat.includes('22k') || mat.includes('gold')) rate = this.liveRates?.gold22k || this.liveRates?.gold24k || 7000;
    if (mat.includes('18k')) rate = (this.liveRates?.gold24k || 7500) * 0.75;
    
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
      category: p.category || 'Gold Jewellery',
      material: p.material || '22k Gold',
      imageSrc: imgUrl,
      imageAlt: p.name,
      inStock: p.stock > 0
    };
  }

  private recalculatePrices() {
    if (this.products.length === 0) return;
    this.products = this.products.map(p => {
      const mat = (p.material || '').toLowerCase();
      let rate = this.liveRates?.gold24k || 7500;
      if (mat.includes('22k') || mat.includes('gold')) rate = this.liveRates?.gold22k || this.liveRates?.gold24k || 7000;
      if (mat.includes('18k')) rate = (this.liveRates?.gold24k || 7500) * 0.75;

      const weightNum = parseFloat(p.weight) || 0;
      if (weightNum > 0) {
        const estimatedPrice = Math.round(weightNum * 1.1 * rate);
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
      // Price filter check - only applied if customer actively customized the price filter
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
          if (t === 'necklaces') return combined.includes('chain') || combined.includes('pendant') || combined.includes('necklace') || combined.includes('choker') || combined.includes('nool') || combined.includes('haram');
          if (t === 'rings') return combined.includes('ring') || combined.includes('band') || combined.includes('solitaire') || combined.includes('metti');
          if (t === 'bracelets') return combined.includes('bracelet') || combined.includes('bangle') || combined.includes('cuff') || combined.includes('kada');
          if (t === 'earrings') return combined.includes('earring') || combined.includes('stud') || combined.includes('hoop') || combined.includes('kammal') || combined.includes('jhumka') || combined.includes('bali') || combined.includes('drop');
          return false;
        });
      }

      let purityMatch = true;
      if (activePurities.length > 0) {
        purityMatch = activePurities.some(p => {
          const mat = (product.material || '').toLowerCase();
          if (p.includes('22k')) return mat.includes('22k');
          if (p.includes('24k')) return mat.includes('24k');
          if (p.includes('18k')) return mat.includes('18k');
          return false;
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
      this.isPriceFilterActive = (this.selectedMinPrice > 0 || (this.selectedMaxPrice !== undefined && this.selectedMaxPrice < 500000));
    }
  }

  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  scrollToProducts() {
    document.getElementById('gold-products')?.scrollIntoView({ behavior: 'smooth' });
  }
}
