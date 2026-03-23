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
  selector: 'app-silver-collection',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FiltersComponent],
  templateUrl: './silver-collection.component.html',
  styleUrl: './silver-collection.component.css'
})
export class SilverCollectionComponent {
  jewelryTypes: FilterOption[] = [
    { label: 'Earrings', checked: true },
    { label: 'Necklaces', checked: false },
    { label: 'Rings', checked: false },
    { label: 'Bracelets', checked: false }
  ];

  purityLevels: FilterOption[] = [
    { label: '925 Sterling', active: true },
    { label: 'Fine Silver', active: false },
    { label: 'Oxidized', active: false }
  ];

  products: Product[] = [
    {
      id: 'minimalist-sphere-studs',
      name: 'Minimalist Sphere Studs',
      price: 145,
      weight: '4.2g',
      category: '925 Sterling',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDOwdvc6FAT3KvPZm85KL3NbfyuQTTf96vw9JAzkSsEMY050DGVXfyWua3abyw4Sl0SUCk4COCCwWO_Z17-ooArVH5qDF4du1our1mjGpA8smIlSpB8CzGNHWB3ym4tror6DlXhw8FMDpIc2nPvs0arhmkmcsbPrJIMu1bbCghfinTtJjPhR3FDI7Te4JhRbjkgX9BbwmPkMU02O7tl3RQyH8RnOGR2602iGcMHhnvDPJtJEdqp6J_suCAIiLei0596IIyA1hcN-HP',
      imageAlt: 'Polished sterling silver stud earrings'
    },
    {
      id: 'serpentine-link-chain',
      name: 'Serpentine Link Chain',
      price: 290,
      weight: '12.8g',
      category: '925 Sterling',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYW9Bdw7KEprq1bmKkzDN7jQzXF5Jt_zFs365XCenHSklRBk6e80r8rGerWxybfwNQ0-H4MiI9KZHBxOMatOFRDet5BXT9B7c5boFAU-dNxLaPCZw3Gg5t-PrSDNfydYFZmtOQeA3CKkYI4n4ray7sSm59hOZkNScVzF9WBAiyzHRfFWjbOx9usy7_1bs65rS3xAo_O0oJBjcT7NebKtSvMaxz1SP6B1ZvargbUWWZpdiFITQRl4Lh4kCrP_nzdk-ca9JvFxWC9SGW',
      imageAlt: 'Delicate sterling silver chain necklace'
    },
    {
      id: 'horizon-signet-ring',
      name: 'Horizon Signet Ring',
      price: 210,
      weight: '8.5g',
      category: '925 Sterling',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH1ynxniDfni8I7WJr8Jm0XVyKBTKSzAbOIU4NfT9SjdzPw3kjBc_ZXeAhxduazAMqArdlUv2LDS0ioKGjSwtL7oJ_UCV-vOH7Dp9sga0gewon_D5CD4g2KSo8SIMcS8bbX4hShhh17jtARQ7SSVmlFomtY5iyu3oqjVLSQIwz6IS-woWbR7d41vrNJD9VY2F6xYz49hz_4rNPe_ce6sOrRhCz_dinrFLFLBDxBCm3pN24NFOz1QaNHPj4_-qUloD9MyaFHMPcXBib',
      imageAlt: 'Solid sterling silver band ring'
    },
    {
      id: 'lunar-crest-pendant',
      name: 'Lunar Crest Pendant',
      price: 375,
      weight: '15.2g',
      category: '925 Sterling',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlptvR3z-pMUaTuEr7HYnTuPD2daDnP6mQRN_kHrDrmUhzdB1CC3KxuAowaQlQap7qn5sOjp5OzTLXdUpf0xzmR9fiedq54DrlLfxtlLvPTh-Jynb_DFGtjyHOCvSIagW8uC4Ke4z980DkO1hOhY_C3PYkHc9p-RfMA0WxzX4_BN_WVw9vs-lD57GyNt84UOFjFj4-MjbMFsPvuMvSksyR3EYR_gXuXF63W_nlawL7s6ZuS6fobRwf9q5_646DRoKxeVqMi08UNYry',
      imageAlt: 'Artisan silver pendant necklace'
    },
    {
      id: 'bold-eclipse-hoops',
      name: 'Bold Eclipse Hoops',
      price: 195,
      weight: '10.4g',
      category: '925 Sterling',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1igyyLgSOmguLpDg95pWUEEUzniY4S6e0WH1WeeO8Ngwm6-f17nZpBsTL1xGHvNrex1j0S0x_POTIQhixkJs0Y-vQ9DuXSdv1YXyzPEBAimCVyDXfE4msYg8vkpnck7u2SlgNk1AtCX9Uh9Ab3ytmQ0ft9LC_7WX0a22_14TzBIYwwYQFXB0HcpQvOJ_EKX3-gw7v3Z7VFy4Nl5K0BUZe7_hRamdNWwNyPECPl-7Ps-3icfeAOjG4dX2ZQxA_NaUDRjeI2DOnwERa',
      imageAlt: 'Chunky silver hoop earrings'
    },
    {
      id: 'braid-weave-cuff',
      name: 'Braid Weave Cuff',
      price: 520,
      weight: '24.1g',
      category: '925 Sterling',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmej3Wsx0a15PabGfFiiJSeZnenkhvNXn1A5QWGSfsrXe8yxkJCJYvRm2vXf-ERSXP_H1YUl8LF9M9sApe84egYHP6Hlaw63l4HMThpgqZNyeGsn6bkTR2Vun4jGudqY3M5cm_lg0pLvBvGmRHy_axJyQB7vUX9ajer43fZFhpTkYpmpJ_Xt4wDAvyqWEjcrGrZvbNjqATEQuVJeTHuSMtmZpetpS7vOwlQR7XxtrvvlXzNTXcnrLuBwX_4LJ5fxxZZRzODUqgCZ8m',
      imageAlt: 'Woven silver cuff bracelet'
    }
  ];

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
           if (p === '925 sterling') return cat.includes('925');
           if (p === 'fine silver') return cat.includes('fine');
           if (p === 'oxidized') return cat.includes('oxidized');
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
    document.getElementById('silver-products')?.scrollIntoView({ behavior: 'smooth' });
  }
}
