import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
