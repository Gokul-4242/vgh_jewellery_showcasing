import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  craftsmanshipSteps = [
    {
      icon: 'draw',
      title: 'Visionary Design',
      description: 'Every ornament begins with a <span class="highlight">conversation, not a catalog</span>. We sketch, refine, and shape designs based on your exact needs whether it’s traditional, modern, or something completely unique.'
    },
    {
      icon: 'precision_manufacturing',
      title: 'Custom Crafting',
      description: 'We <span class="highlight">don’t mass-produce</span>. Each piece is <span class="highlight">individually made</span> by skilled artisans, allowing full customization in weight, design, and detailing exactly how you want it.'
    },
    {
      icon: 'auto_fix_high',
      title: 'Precision Finishing',
      description: 'Our craftsmen carefully polish and finish every piece by <span class="highlight">hand</span>, ensuring a <span class="highlight">smooth, rich shine</span> that machine made jewellery simply can’t match.'
    },
    {
      icon: 'verified',
      title: 'Certified Purity',
      description: 'No vague promises. All our gold jewellery is <span class="highlight">BIS hallmarked</span> and comes with a <span class="highlight">purity testing report</span>, so you know exactly what you’re paying for.'
    }
  ];

  ethics = [
    {
      title: 'BIS Hallmarked Gold',
      description: 'Every gold ornament is BIS hallmarked, ensuring certified purity and standard quality you can rely on.',
      image: '/images/BIS HALLMARKED.png'
    },
    {
      title: 'Purity Tested Jewellery',
      description: 'Each piece comes with a purity testing report, so you know exactly what you’re buying no compromises.',
      image: '/images/PURITY TESTED JEWELLERY.png'
    }
  ];
}
