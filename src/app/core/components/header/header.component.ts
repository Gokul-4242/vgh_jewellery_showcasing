import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface SearchResult {
  name: string;
  route: string;
  type: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;

  navItems = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Gold Collection', path: '/gold-collection', exact: false },
    { label: 'Silver Collection', path: '/silver-collection', exact: false },
    { label: 'About Us', path: '/about-us', exact: false },
    { label: 'Contact', path: '/contact', exact: false }
  ];

  searchQuery = '';
  searchResults: SearchResult[] = [];
  isSearchActive = false;

  private readonly allItems: SearchResult[] = [
    { name: 'Artisan Curb Chain', route: '/product-details', type: 'Gold' },
    { name: 'Ethereal Band Set', route: '/product-details', type: 'Gold' },
    { name: 'Royal Bangle', route: '/product-details', type: 'Gold' },
    { name: 'Emblem Pendant', route: '/product-details', type: 'Gold' },
    { name: 'Horizon Signature Ring', route: '/product-details', type: 'Gold' },
    { name: 'Sun-Drenched Earrings', route: '/product-details', type: 'Gold' },
    { name: 'Minimalist Sphere Studs', route: '/product-details', type: 'Silver' },
    { name: 'Serpentine Link Chain', route: '/product-details', type: 'Silver' },
    { name: 'Horizon Signet Ring', route: '/product-details', type: 'Silver' },
    { name: 'Lunar Crest Pendant', route: '/product-details', type: 'Silver' },
    { name: 'Bold Eclipse Hoops', route: '/product-details', type: 'Silver' },
    { name: 'Braid Weave Cuff', route: '/product-details', type: 'Silver' }
  ];

  constructor(private readonly router: Router) {}

  onSearchChange() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.searchResults = [];
      return;
    }
    
    this.searchResults = this.allItems.filter(item => 
      item.name.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)
    ).slice(0, 5); // Limit to 5 results
  }

  onSearchFocus() {
    this.isSearchActive = true;
    this.onSearchChange();
  }

  onSearchBlur() {
    // Slight delay so mousedown on result item can fire before active state drops
    setTimeout(() => {
      this.isSearchActive = false;
    }, 150);
  }

  goToResult(result: SearchResult) {
    this.router.navigate([result.route]);
    this.isSearchActive = false;
    this.searchQuery = '';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }
}
