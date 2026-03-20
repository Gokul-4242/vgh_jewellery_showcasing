import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  @Input() title: string = 'Handcrafted Gold Jewellery';
  @Input() subtitle: string = 'Custom-made designs with certified purity and trusted craftsmanship.';
  @Input() buttonText: string = 'Shop Gold Jewellery';
  @Input() imageSrc: string = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvk-YSG32Em4MVMhHEvd2Z2iu7WK0nD1Fnz5t2-t3NqKiuCdjAG2XiGb1jW_ecjwEmH3zu2qwnDhbOvBF_m2vnbg167gdDJoJpbudGlqydJjVbZ1SLLqS0b6gwaESI56Lf9jIap9CKp1EGGKJ6ScTJWknIHyoTvykHMLGKhp___ls1pEjJPQZHGHnV3uxYIv1oPTe4mU49Sycg1INclJGaRl_yps-r8ITOtIGZyRHscQsvIZ0pY1VoeiGm6k7ykZckKcKXQKnH7Rl0';
  @Input() imageAlt: string = 'Macro photography of a gold necklace';
}
