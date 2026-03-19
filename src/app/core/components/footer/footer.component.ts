import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FooterLink {
  label: string;
  href: string;
  icon?: string;
  contentHtml?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  @Input() brandName: string = 'VGH Jewellers';
  @Input() brandDescription: string = 'Elevating personal style with conscious luxury and timeless craftsmanship.';
  @Input() copyrightText: string = '© 2024 VGH Jewellers Premium Jewelry. All rights reserved.';
  
  @Input() socialLinks: FooterLink[] = [
    { label: 'Public', href: '#', icon: 'public' },
    { label: 'Camera', href: '#', icon: 'photo_camera' },
    { label: 'Video', href: '#', icon: 'play_circle' }
  ];

  @Input() columns: FooterColumn[] = [
    {
      title: 'Collections',
      links: [
        { label: 'Gold Necklaces', href: '#' },
        { label: 'Bespoke Rings', href: '#' },
        { label: 'Silver Bracelets', href: '#' },
        { label: 'Diamond Earrings', href: '#' }
      ]
    },
    {
      title: 'Client Care',
      links: [
        { label: 'Shipping & Returns', href: '#' },
        { label: 'Sizing Guide', href: '#' },
        { label: 'Jewelry Care', href: '#' },
        { label: 'Privacy Policy', href: '#' }
      ]
    },
    {
      title: 'Heritage',
      links: [
        { label: 'Our Story', href: '/about-us' },
        { label: 'Ethical Sourcing', href: '#' },
        { label: 'Workshop', href: '#' }
      ]
    },
    {
      title: 'Contact Us',
      links: [
        { label: 'Address', href: '#', icon: 'location_on', contentHtml: '123 Elegance Blvd, <br/>New York, NY 10001' },
        { label: 'concierge@vghjewellers.com', href: '#', icon: 'mail' },
        { label: '+1 (800) AURA-GLD', href: '#', icon: 'call' }
      ]
    }
  ];
}
