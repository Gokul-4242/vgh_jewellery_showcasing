import { Component, OnInit, NgZone } from '@angular/core';
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

  products: Product[] = [];
  liveRates: any = { gold24k: 0, gold22k: 0};
  isLoading = true;

  constructor(private productService: ProductService, private ngZone: NgZone) {}

  ngOnInit(): void {
    forkJoin({
      rateRes: this.productService.getRates(),
      prodRes: this.productService.getProducts(1, 50)
    }).subscribe(({ rateRes, prodRes }) => {
      const rates = Array.isArray((rateRes as any).data) ? (rateRes as any).data[0] : (rateRes as any).data;
      const backendProducts = (prodRes as any).data;

      this.ngZone.run(() => {
        this.liveRates = rates || { gold24k: 0, gold22k: 0 };
        this.products = backendProducts
          .filter((p: any) => p.material === 'gold24k' || p.material === 'gold22k')
          .map((p: any) => {
            let rate = this.liveRates.gold24k;
            if (p.material === 'gold22k') rate = this.liveRates.gold22k;
            const totalWeight = p.weight + (p.weight * (p.wastagePercent / 100));
            const estimatedPrice = Math.round((totalWeight * rate) + p.makingCharge + (p.stoneCost || 0));
            return {
              id: p._id,
              name: p.name,
              price: estimatedPrice,
              weight: `${p.weight} Grams`,
              category: p.category,
              imageSrc: p.images && p.images.length > 0 ? p.images[0].url : 'https://placehold.co/400',
              imageAlt: p.name,
              inStock: p.stock > 0
            };
          });
        this.isLoading = false;
      });
    });
  }

  isFiltersVisible = false;

  get filteredProducts(): Product[] {
    const activeTypes = this.jewelryTypes.filter(t => t.checked).map(t => t.label.toLowerCase());
    const activePurities = this.purityLevels.filter(p => p.active).map(p => p.label.toLowerCase());

    return this.products.filter(product => {
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
           if (p.includes('24k')) return cat.includes('24k');
           if (p.includes('22k')) return cat.includes('22k');
           if (p.includes('18k')) return cat.includes('18k');
           if (p.includes('rose')) return cat.includes('rose');
           return false;
         });
      }

      return typeMatch && purityMatch;
    });
  }

  onFilterChange(event: { types: FilterOption[], purities: FilterOption[] }) {
    this.jewelryTypes = event.types;
    this.purityLevels = event.purities;
  }

  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  scrollToProducts() {
    document.getElementById('gold-products')?.scrollIntoView({ behavior: 'smooth' });
  }
}
