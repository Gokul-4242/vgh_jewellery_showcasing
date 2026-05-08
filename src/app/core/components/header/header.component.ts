import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap, filter } from 'rxjs/operators';
import { ChangeDetectorRef, OnInit } from '@angular/core';


interface SearchResult {
  id: string;
  name: string;
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
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);
  private readonly cdr = inject(ChangeDetectorRef);
  itemCount = this.cartService.itemCount;


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
  isSearching = false;
  private searchSubject = new Subject<string>();

  constructor(private readonly router: Router) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.isSearching = true;
        this.cdr.detectChanges();
      }),
      switchMap(query => {
        const q = query.trim();
        if (q.length < 2) {
          return of({ empty: true }); // Skip API call
        }
        return this.productService.searchProducts(q, 5).pipe(
          catchError(err => {
            console.error('Search API failed:', err);
            return of({ error: true });
          })
        );
      })
    ).subscribe((res: any) => {
      this.isSearching = false;
      
      if (res.empty || res.error) {
        this.searchResults = [];
      } else if (res.success && res.data) {
        this.searchResults = res.data.map((p: any) => ({
          id: p._id,
          name: p.name,
          type: p.category || 'Jewellery'
        }));
      } else {
        this.searchResults = [];
      }
      
      this.cdr.detectChanges();
    });
  }

  onSearchChange() {
    // If less than 2 chars, clear instantly without waiting for debounce
    if (this.searchQuery.trim().length < 2) {
      this.searchResults = [];
      this.isSearching = false;
    } else {
      this.isSearching = true;
    }
    this.searchSubject.next(this.searchQuery);
  }

  onSearchFocus() {
    this.isSearchActive = true;
    if (this.searchQuery.trim().length >= 2) {
      this.onSearchChange();
    }
  }

  onSearchBlur() {
    // Slight delay so mousedown on result item can fire before active state drops
    setTimeout(() => {
      this.isSearchActive = false;
    }, 150);
  }

  goToResult(result: SearchResult) {
    this.router.navigate(['/product-details', result.id]);
    this.isSearchActive = false;
    this.searchQuery = '';
    this.searchResults = [];
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
