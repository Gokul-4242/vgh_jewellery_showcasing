import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { FiltersComponent, FilterOption } from '../../shared/components/filters/filters.component';
import { ProductService } from '../../core/services/product.service';
import { forkJoin } from 'rxjs';

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
  jewelryTypes: FilterOption[] = [
    { label: 'Necklaces', checked: false },
    { label: 'Rings', checked: false },
    { label: 'Bracelets', checked: false },
    { label: 'Earrings', checked: false }
  ];

  purityLevels: FilterOption[] = [
    // { label: '24K Gold', active: true },
    { label: '22K Gold', active: true },
    // { label: '18K Gold', active: false },
    // { label: 'Rose Gold', active: false }
  ];

  products: Product[] = [];
  liveRates: any = { gold24k: 0, gold22k: 0};
  isLoading = true;
  selectedMinPrice: number = 0;
  selectedMaxPrice: number = 100000;

  constructor(private productService: ProductService, private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

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
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => console.error('Failed to fetch rates:', err)
    });

    // Fetch Products independently with 'gold' filter
    this.productService.getProducts(1, 50, 'gold').subscribe({
      next: (prodRes) => {
        const backendProducts = (prodRes as any).data;
        this.ngZone.run(() => {
          if (backendProducts && Array.isArray(backendProducts)) {
            this.products = backendProducts
              .filter((p: any) => p.material.toLowerCase().includes('gold'))
              .map((p: any) => {
                const mat = p.material.toLowerCase();
                let rate = this.liveRates?.gold24k || 0;
                if (mat.includes('22k')) rate = this.liveRates?.gold22k || 0;
                
                const totalWeight = p.weight + (p.weight * (p.wastagePercent / 100));
                const estimatedPrice = Math.round((totalWeight * rate) + p.makingCharge + (p.stoneCost || 0));
                return {
                  id: p._id,
                  name: p.name,
                  price: estimatedPrice,
                  weight: `${p.weight} Grams`,
                  category: p.category,
                  material: p.material,
                  imageSrc: p.images && p.images.length > 0 ? p.images[0].url : 'https://placehold.co/400',
                  imageAlt: p.name,
                  inStock: p.stock > 0
                };
              });
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

  isFiltersVisible = false;

  get filteredProducts(): Product[] {
    const activeTypes = this.jewelryTypes.filter(t => t.checked).map(t => t.label.toLowerCase());
    const activePurities = this.purityLevels.filter(p => p.active).map(p => p.label.toLowerCase());

    return this.products.filter(product => {
      // Price Filter Check
      if (product.price < this.selectedMinPrice || product.price > this.selectedMaxPrice) {
        return false;
      }

      const name = product.name.toLowerCase();
      const cat = product.category.toLowerCase();
      
      let typeMatch = true;
      if (activeTypes.length > 0) {
         typeMatch = activeTypes.some(t => {
           if (t === 'necklaces') return name.includes('chain') || name.includes('pendant') || name.includes('necklace');
           if (t === 'rings') return name.includes('ring') || name.includes('band');
           if (t === 'bracelets') return name.includes('bracelet') || name.includes('bangle') || name.includes('cuff');
           if (t === 'earrings') return name.includes('earring') || name.includes('stud') || name.includes('hoop');
           return false;
         });
      }

      let purityMatch = true;
      if (activePurities.length > 0) {
         purityMatch = activePurities.some(p => {
           const mat = product.material.toLowerCase();
           if (p.includes('22k')) return mat.includes('22k');
           if (p.includes('24k')) return mat.includes('24k');
           if (p.includes('18k')) return mat.includes('18k');
           return false;
         });
      }

      return typeMatch && purityMatch;
    });
  }

  onFilterChange(event: { types: FilterOption[], purities: FilterOption[], minPrice?: number, maxPrice?: number }) {
    this.jewelryTypes = event.types;
    this.purityLevels = event.purities;
    if (event.minPrice !== undefined) this.selectedMinPrice = event.minPrice;
    if (event.maxPrice !== undefined) this.selectedMaxPrice = event.maxPrice;
  }

  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  scrollToProducts() {
    document.getElementById('gold-products')?.scrollIntoView({ behavior: 'smooth' });
  }
}
