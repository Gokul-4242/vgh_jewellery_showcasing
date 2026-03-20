import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Collection {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  linkText: string;
  link: string;
}

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent {
  @Input() title: string = 'Signature Collections';
  @Input() collections: Collection[] = [
    {
      title: 'Gold Collection',
      description: 'Timeless pieces crafted in 18k solid gold.',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8GAgQxbT_Hs0aexNuL2KyuGWdxvN9tk-30-SK63DFL-nr26BBmV95WEn13RuVnvYfn1c1tuEw7_JnM74-zPvLvu1xMab6T4ca1KkcwgxNCELvP8Za8l3tfWCAWctzO6bcVWVnKIGA6WAfqpIiOUgg6PWkXeewmCaycgwJn-1AyxXPJe6fVbyxYraq-bDfrXFx2fHuARPa6EPJQ-u95__7DIx53xBO5JNwI8VVTB8GnnJMwuq0hpg3iSgwdnRyyYn55SiutmrNiT4_',
      imageAlt: 'Gold jewelry collection display',
      linkText: 'View Collection',
      link: '/gold-collection'
    },
    {
      title: 'Silver Collection',
      description: 'Contemporary sterling silver for modern luxury.',
      imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIBVxP8GhjBHQgvA-HfU1sIlL0k_x2ZNVNCuJFnjKli_GOpzs0dwz_QEm7e1RpiRMCIdZFdjJekwdtgj-uo5RVGAlvjgoJbeIEB24s8GdyRfxNvx8yGm-Ijo6jkX46ti879SbRgdTecSeO4zvo7DKjW9ExITenf1583OJ29q3E1MShgFn_XxSn3EbxI0VKWOEF23ZbuhMN-eSqdmXNI6RX8sMOKfkekSgyNqXvIs1xdA9UxW1c5F2USGTONBM0DNQ5zxYlOGsEoePG',
      imageAlt: 'Sterling silver jewelry pieces',
      linkText: 'View Collection',
      link: '/silver-collection'
    }
  ];
}
