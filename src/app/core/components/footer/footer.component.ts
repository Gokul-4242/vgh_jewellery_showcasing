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
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '/home' },
        { label: 'Gold Collections', href: '/gold-collection' },
        { label: 'Silver Collections', href: '/silver-collection' },
        { label: 'About Us', href: '/about-us' }
      ]
    },
    // {
    //   title: 'Heritage',
    //   links: [
    //     { label: 'Our Story', href: '/about-us' },
    //     { label: 'Ethical Sourcing', href: '#' },
    //     { label: 'Workshop', href: '#' }
    //   ]
    // },
    {
      title: 'Contact Us',
      links: [
        { label: 'Address', href: 'https://www.google.com/maps/place/VGH+Jewellers/@8.1826844,77.4346691,54m/data=!3m1!1e3!4m6!3m5!1s0x3b04f1d80eb80b57:0xbbdb0aebb78415a4!8m2!3d8.1827003!4d77.4346704!16s%2Fg%2F11w8v2ldsm?entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D', icon: 'location_on', contentHtml: 'VGH Jewellers, Ammasimadam Street,Meenakshipuram.' },
        { label: 'vghjewellers@gmail.com', href: 'mailto:vghjewellers@gmail.com', icon: 'mail' },
        { label: 'vghjewellers', href: 'tel:+917904394546', icon: 'call' }
      ]
    }
  ];
}
