import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StoryFeature {
  icon: string;
  title: string;
  description: string;
}

interface ImageGrid {
  src: string;
  alt: string;
  containerClass: string;
}

@Component({
  selector: 'app-brand-story',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand-story.component.html',
  styleUrl: './brand-story.component.css'
})
export class BrandStoryComponent {
  @Input() title: string = 'A Legacy of Artistry';
  @Input() description: string = 'Founded on the principles of uncompromising quality and timeless beauty, VGH Jewellers brings together traditional techniques with visionary design.';
  
  @Input() features: StoryFeature[] = [
    {
      icon: 'draw',
      title: 'Master Craftsmanship',
      description: 'Every piece is meticulously handcrafted by our master artisans, ensuring a unique soul in every curve and facet.'
    },
    {
      icon: 'history_edu',
      title: 'Heritage & Honor',
      description: 'Drawing from generations of jewelry-making heritage, we honor the past while defining the future of luxury.'
    }
  ];

  @Input() column1Images: ImageGrid[] = [
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUzZm6c6u0MEyGOkrqORldU-CGYijUSVEaABL-qkwQIiu1h2b1SFf8Bt5d2BMxUZdohni56W3AWvrhelzYD8aEmyMeN18o45jdUc3ZI_jMXg8jTsOV7M0a4pSdUJdLOAL_KqexidB7Gk-KvwHCOnE8m9gXZJA0MgXnkBsJvR0_fereB8j80sKgMlzk11WOes-UZ0hlfb0eT4DzGQxcOM3hOzsevdrNI1QoMfjgzW3LZBETmdlv87guXeU4aal6uJRTW8HMUEkkb5XM',
      alt: 'Jewelry artisan at work',
      containerClass: 'h-64'
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF8S-3EjPAfMwRxTaX_zKVlT3e3gy1XOaK2B7Ne_V1_Tls_whfodEz6tsecjhjkfwJbhVtTgW8ojAU_nnGcnzmNOsM-uZ8tYIHwcVHBA9dfSGJ_hfEEtHD77lp7vvsjyWvYHHw2R07kVt9ZBpCE7JG2brcI-PrdAT9snk4HYNOGVf001ALNHWv2UmjA4qUANW24T8V48b-C-2jwBCMXHPMJbsX2SDHvo-O8iLjc9nmd0ZOH6XqxgPY2slkGkyR_AxXC_-x_O97JE2R',
      alt: 'Jewelry design sketches',
      containerClass: 'h-48'
    }
  ];

  @Input() column2Images: ImageGrid[] = [
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBolnY1FuSX0sYvlJEYlJIll_XMNcxP55QpakLMiNw0oAgze4XYfxT0U-9nkkifpgVqZdboV9N4MMcv418M1-mPS-Eu2rAe1tlljUzh4urW0WYV6tp7bYjMHOsspk8shRIxXwg0OAfuRYuYs3YqksNu1YESeZZLAcKy276f4ZawGJ_GmddYkeunLEzfhT3zE_DuOO9mS7RhkBsdUULFS7U0vJtJ5TdcGCh3skyXHJUPFWdR9JHC7nLs99jt4Sq5FitmG3nW8O72fSnr',
      alt: 'Raw gold materials',
      containerClass: 'h-48'
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHAq8e1jQ8Rjr0yeInglYndl1Pv2Lj9Dje9IO87b3mV9pP8zyl92NHakDCkgQki8ztmc2zd03lkoS4Hs9PZI007SQUnqH_UDGzammyq6xqqLJJEqVj7VLmStwHzzeQir2XHpJdxhzvGtcQs-4uTodZ-00EED8NtPc_KKLpXmVfo1esiDOodOSgGOmUxcGJ1xA_LaKDr5tyE97LZEvGjoqDeEOK64tSWR4R8ZFluciEUy_XKACzVyP7LKkn3Ql9EPQJKtEL4Ba6_D-e',
      alt: 'Finished jewelry piece',
      containerClass: 'h-64'
    }
  ];
}
